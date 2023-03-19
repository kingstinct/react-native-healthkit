/* eslint-disable import/no-extraneous-dependencies, functional/immutable-data, no-param-reassign, @typescript-eslint/no-var-requires */
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

// please note that the BackgroundConfig currently doesn't actually enable background delivery for any types, but you
// can set it to false if you don't want the entitlement

/**
 * @typedef BackgroundConfig
 * @type {false | Partial<Record<
 *  import('./src/native-types').HKSampleTypeIdentifier,
 *  import('./src/native-types').HKUpdateFrequency
 * >>}

/**
 * @typedef InfoPlistConfig
 * @type {{
 *  NSHealthShareUsageDescription?: string | false,
 *  NSHealthUpdateUsageDescription?: string | false
 * }}
*/

/**
 * @typedef AppPluginConfig
 * @type {InfoPlistConfig & { background?: BackgroundConfig }}
*/

/**
 * @type {ConfigPlugin<{background: BackgroundConfig}>}
 */
const withEntitlementsPlugin = (config, { background }) => withEntitlementsPlist(config, (config) => {
  config.modResults['com.apple.developer.healthkit'] = true
  config.modResults['com.apple.developer.healthkit.background-delivery'] = background !== false
  return config
})

/**
 * @type {ConfigPlugin<InfoPlistConfig>}
 */
const withInfoPlistPlugin = (config, { NSHealthShareUsageDescription, NSHealthUpdateUsageDescription }) => withInfoPlist(config, (config) => {
  config.modResults.NSHealthShareUsageDescription = NSHealthShareUsageDescription || (NSHealthShareUsageDescription === false ? undefined : `${config.name} wants to read your health data`)
  config.modResults.NSHealthUpdateUsageDescription = NSHealthUpdateUsageDescription || (NSHealthUpdateUsageDescription === false ? undefined : `${config.name} wants to update your health data`)
  return config
})

const pkg = require('./package.json')

/**
 * @type {ConfigPlugin<AppPluginConfig>}
*/
const healthkitAppPlugin = (config, { NSHealthShareUsageDescription, NSHealthUpdateUsageDescription, background }) => withPlugins(config, [
  [withEntitlementsPlugin, { background }],
  [withInfoPlistPlugin, { NSHealthShareUsageDescription, NSHealthUpdateUsageDescription }],
])

/**
 * @type {ConfigPlugin<AppPluginConfig>}
*/
module.exports = createRunOncePlugin(healthkitAppPlugin, pkg.name, pkg.version)
