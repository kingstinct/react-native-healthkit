import {
  type ConfigPlugin,
  createRunOncePlugin,
  withEntitlementsPlist,
  withInfoPlist,
  withPlugins,
} from '@expo/config-plugins'

import pkg from './package.json'

// please note that the BackgroundConfig currently doesn't actually enable background delivery for any types, but you
// can set it to false if you don't want the entitlement
type BackgroundConfig = boolean

type InfoPlistConfig = {
  NSHealthShareUsageDescription?: string | true
  NSHealthUpdateUsageDescription?: string | true
}

type AppPluginConfig = InfoPlistConfig & {
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
    configPlist.modResults.NSHealthShareUsageDescription =
      typeof props.NSHealthShareUsageDescription === 'string'
        ? props.NSHealthShareUsageDescription
        : `${config.name ?? pkg.name} wants to read your health data`

    // Add description if it's not undefined and not explicitly false

    configPlist.modResults.NSHealthUpdateUsageDescription =
      typeof props.NSHealthUpdateUsageDescription === 'string'
        ? props.NSHealthUpdateUsageDescription
        : `${config.name ?? pkg.name} wants to update your health data`

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
