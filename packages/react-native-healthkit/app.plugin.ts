import {
  type ConfigPlugin,
  createRunOncePlugin,
  withEntitlementsPlist,
  withInfoPlist,
  withPlugins,
} from '@expo/config-plugins'

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
   * change: the pod hooks UIApplicationDidFinishLaunchingNotification itself
   * (see ios/BackgroundLaunchHook.mm).
   */
  background?: BackgroundConfig
}

const withEntitlementsPlugin: ConfigPlugin<{
  background?: BackgroundConfig
}> = (config, props) => {
  return withEntitlementsPlist(config, (configPlist) => {
    configPlist.modResults['com.apple.developer.healthkit'] = true

    // background is enabled by default, but possible to opt-out from
    // (haven't seen any drawbacks from having it enabled)
    if (props?.background !== false) {
      configPlist.modResults[
        'com.apple.developer.healthkit.background-delivery'
      ] = true
    }

    return configPlist
  })
}

const withInfoPlistPlugin: ConfigPlugin<InfoPlistConfig> = (config, props) => {
  return withInfoPlist(config, (configPlist) => {
    const existingShareDescription =
      configPlist.modResults.NSHealthShareUsageDescription
    configPlist.modResults.NSHealthShareUsageDescription =
      typeof props?.NSHealthShareUsageDescription === 'string'
        ? props.NSHealthShareUsageDescription
        : typeof existingShareDescription === 'string'
          ? existingShareDescription
          : `${config.name ?? pkg.name} wants to read your health data`

    if (props?.NSHealthUpdateUsageDescription !== false) {
      const existingUpdateDescription =
        configPlist.modResults.NSHealthUpdateUsageDescription
      configPlist.modResults.NSHealthUpdateUsageDescription =
        typeof props?.NSHealthUpdateUsageDescription === 'string'
          ? props.NSHealthUpdateUsageDescription
          : typeof existingUpdateDescription === 'string'
            ? existingUpdateDescription
            : `${config.name ?? pkg.name} wants to update your health data`
    }

    return configPlist
  })
}

const healthkitAppPlugin: ConfigPlugin<AppPluginConfig> = (config, props) => {
  return withPlugins(config, [
    [withEntitlementsPlugin, props],
    [withInfoPlistPlugin, props],
  ])
}

export default createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
