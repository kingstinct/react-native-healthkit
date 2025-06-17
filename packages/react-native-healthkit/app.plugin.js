const {
  withPlugins,
  createRunOncePlugin,
  withEntitlementsPlist,
  withInfoPlist,
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
   * @type {{NSHealthShareUsageDescription: string | true, NSHealthUpdateUsageDescription: string | true} | undefined}
   * */
  props,
) =>
  withInfoPlist(config, (config) => {
    config.modResults.NSHealthShareUsageDescription =
      typeof props.NSHealthShareUsageDescription === 'string'
        ? props.NSHealthShareUsageDescription
        : `${config.name} wants to read your health data`

    config.modResults.NSHealthUpdateUsageDescription =
      typeof props.NSHealthUpdateUsageDescription === 'string'
        ? props.NSHealthUpdateUsageDescription
        : `${config.name} wants to update your health data`

    return config
  })

const pkg = require('./package.json')

/**
 * @type {ConfigPlugin<AppPluginConfig>}
 */
const healthkitAppPlugin = (config, props) =>
  withPlugins(config, [
    [withEntitlementsPlugin, props],
    [withInfoPlistPlugin, props],
  ])

/**
 * @type {ConfigPlugin<AppPluginConfig>}
 */
module.exports = createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
