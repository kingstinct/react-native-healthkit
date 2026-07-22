const {
  withPlugins,
  createRunOncePlugin,
  withAppDelegate,
  withEntitlementsPlist,
  withInfoPlist,
  WarningAggregator,
} = require('@expo/config-plugins')

/**
 * @typedef ConfigPlugin
 * @type {import('@expo/config-plugins').ConfigPlugin<T>}
 * @template T = void
 */

/**
 * @typedef InfoPlistConfig
 * @type {{
 *  NSHealthShareUsageDescription?: string | boolean,
 *  NSHealthUpdateUsageDescription?: string | boolean
 * }}
 */

/**
 * @typedef AppPluginConfig
 * @type {InfoPlistConfig & { background?: boolean }}
 */

/**
 * @type {ConfigPlugin<{background: boolean}>}
 */
const withEntitlementsPlugin = (
  config,
  /**
   * @type {{background: boolean} | undefined}
   * */
  props,
) =>
  withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.healthkit'] = true

    // background is enabled by default, but possible to opt-out from
    // (haven't seen any drawbacks from having it enabled)
    if (props?.background !== false) {
      config.modResults['com.apple.developer.healthkit.background-delivery'] =
        true
    }

    return config
  })

/**
 * @type {ConfigPlugin<InfoPlistConfig>}
 */
const withInfoPlistPlugin = (
  config,
  /**
   * @type {{NSHealthShareUsageDescription?: string | true, NSHealthUpdateUsageDescription?: string | false} | undefined}
   * */
  props,
) =>
  withInfoPlist(config, (config) => {
    config.modResults.NSHealthShareUsageDescription =
      typeof props?.NSHealthShareUsageDescription === 'string'
        ? props.NSHealthShareUsageDescription
        : typeof config.modResults.NSHealthShareUsageDescription === 'string'
          ? config.modResults.NSHealthShareUsageDescription
          : `${config.name} wants to read your health data`

    if (props?.NSHealthUpdateUsageDescription !== false) {
      config.modResults.NSHealthUpdateUsageDescription =
        typeof props?.NSHealthUpdateUsageDescription === 'string'
          ? props.NSHealthUpdateUsageDescription
          : typeof config.modResults.NSHealthUpdateUsageDescription === 'string'
            ? config.modResults.NSHealthUpdateUsageDescription
            : `${config.name} wants to update your health data`
    }

    return config
  })

const pkg = require('./package.json')

/**
 * @type {ConfigPlugin<{background: boolean}>}
 */
const withAppDelegatePlugin = (
  config,
  /**
   * @type {{background: boolean} | undefined}
   * */
  props,
) => {
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
      // Match the opening of didFinishLaunchingWithOptions and insert after the
      // opening brace. Expo SDK 53+ templates spread the Swift signature over
      // multiple lines, so the pattern must span newlines.
      const didFinishLaunching =
        /(func application\s*\([\s\S]*?didFinishLaunchingWithOptions[\s\S]*?\)\s*->\s*Bool\s*\{\n)/
      if (didFinishLaunching.test(configDelegate.modResults.contents)) {
        configDelegate.modResults.contents =
          configDelegate.modResults.contents.replace(
            didFinishLaunching,
            `$1${setupCall}`,
          )
      } else {
        // Background delivery silently never survives app termination without
        // this call, so an injection miss must be loud rather than invisible.
        WarningAggregator.addWarningIOS(
          pkg.name,
          'Could not find didFinishLaunchingWithOptions in AppDelegate — HealthKit background delivery will not be registered on cold launch. Add BackgroundDeliveryManager.shared.setupBackgroundObservers() manually.',
        )
      }
    }

    return configDelegate
  })
}

/**
 * @type {ConfigPlugin<AppPluginConfig>}
 */
const healthkitAppPlugin = (config, props) =>
  withPlugins(config, [
    [withEntitlementsPlugin, props],
    [withInfoPlistPlugin, props],
    [withAppDelegatePlugin, props],
  ])

/**
 * @type {ConfigPlugin<AppPluginConfig>}
 */
module.exports = createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
