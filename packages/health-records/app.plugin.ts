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
  /**
   * Shown when asking the user for access to clinical health records.
   * Required by Apple for apps that read clinical records.
   */
  NSHealthClinicalHealthRecordsShareUsageDescription?: string
  /**
   * Set if the core plugin (`@kingstinct/react-native-healthkit`) is not
   * also configured; otherwise the core plugin already adds this key.
   */
  NSHealthShareUsageDescription?: string
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

const HEALTH_RECORDS_ACCESS = 'health-records'

const healthRecordsAppPlugin: ConfigPlugin<AppPluginConfig> = (
  config,
  props,
) => {
  return withPlugins(config, [
    [
      withHealthKit,
      {
        background: props?.background,
        access: [HEALTH_RECORDS_ACCESS],
        NSHealthShareUsageDescription: props?.NSHealthShareUsageDescription,
        fallbackAppName: pkg.name,
      },
    ],
    [
      withUsageDescription,
      {
        key: 'NSHealthClinicalHealthRecordsShareUsageDescription',
        value: props?.NSHealthClinicalHealthRecordsShareUsageDescription,
        fallback: (appName: string) =>
          `${appName} wants to read your clinical health records`,
        fallbackAppName: pkg.name,
      },
    ],
  ])
}

export default createRunOncePlugin(
  healthRecordsAppPlugin,
  pkg.name,
  pkg.version,
)
