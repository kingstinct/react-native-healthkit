import {
  type ConfigPlugin,
  createRunOncePlugin,
  withAppDelegate,
  withEntitlementsPlist,
  withInfoPlist,
  withPlugins,
} from '@expo/config-plugins'

import pkg from './package.json'

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

const withAppDelegatePlugin: ConfigPlugin<{
  background?: BackgroundConfig
}> = (config, props) => {
  if (props?.background === false) {
    return config
  }

  return withAppDelegate(config, (configDelegate) => {
    const contents = configDelegate.modResults.contents

    // Add import for HealthKit if not already present
    if (!contents.includes('import HealthKit')) {
      configDelegate.modResults.contents =
        configDelegate.modResults.contents.replace(
          /^(import .+\n)/m,
          '$1import HealthKit\n',
        )
    }

    // Insert BackgroundDeliveryManager setup into didFinishLaunchingWithOptions
    const setupCall =
      '    BackgroundDeliveryManager.shared.setupBackgroundObservers()\n'

    if (
      !configDelegate.modResults.contents.includes('BackgroundDeliveryManager')
    ) {
      // Match the opening of didFinishLaunchingWithOptions and insert after the opening brace
      configDelegate.modResults.contents =
        configDelegate.modResults.contents.replace(
          /(func application\(.+didFinishLaunchingWithOptions.+\{)\n/,
          `$1\n${setupCall}`,
        )
    }

    return configDelegate
  })
}

const healthkitAppPlugin: ConfigPlugin<AppPluginConfig> = (config, props) => {
  return withPlugins(config, [
    [withEntitlementsPlugin, props],
    [withInfoPlistPlugin, props],
    [withAppDelegatePlugin, props],
  ])
}

export default createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
