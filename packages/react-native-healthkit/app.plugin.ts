import {
  type ConfigPlugin,
  createRunOncePlugin,
  withPlugins,
} from '@expo/config-plugins'
import {
  withHealthKit,
  withUsageDescription,
} from '@react-native-healthkit/core/plugin'

import pkg from './package.json'

type BackgroundConfig = boolean

type InfoPlistConfig = {
  NSHealthShareUsageDescription?: string | true
  NSHealthUpdateUsageDescription?: string | false
}

type AppPluginConfig = InfoPlistConfig & {
  /**
   * Adds the background-delivery entitlement. Enabled by default; set to
   * `false` to opt out. Launch-time observer registration needs no AppDelegate
   * change: the core pod hooks UIApplicationDidFinishLaunchingNotification
   * itself.
   */
  background?: BackgroundConfig
}

const healthkitAppPlugin: ConfigPlugin<AppPluginConfig> = (config, props) => {
  const withUpdateUsageDescription: ConfigPlugin = (config) =>
    props?.NSHealthUpdateUsageDescription === false
      ? config
      : withUsageDescription(config, {
          key: 'NSHealthUpdateUsageDescription',
          value: props?.NSHealthUpdateUsageDescription,
          fallback: (appName) => `${appName} wants to update your health data`,
          fallbackAppName: pkg.name,
        })

  return withPlugins(config, [
    [
      withHealthKit,
      {
        background: props?.background,
        NSHealthShareUsageDescription: props?.NSHealthShareUsageDescription,
        fallbackAppName: pkg.name,
      },
    ],
    withUpdateUsageDescription,
  ])
}

export default createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
