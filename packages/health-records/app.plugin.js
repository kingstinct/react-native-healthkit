const {
  withPlugins,
  createRunOncePlugin,
  withEntitlementsPlist,
  withInfoPlist,
} = require('@expo/config-plugins')

const pkg = require('./package.json')

/**
 * @typedef InfoPlistConfig
 * @type {{
 *  NSHealthClinicalHealthRecordsShareUsageDescription?: string,
 *  NSHealthShareUsageDescription?: string
 * }}
 */

/**
 * @typedef AppPluginConfig
 * @type {InfoPlistConfig & { background?: boolean }}
 */

const HEALTH_RECORDS_ACCESS = 'health-records'

/**
 * @type {import('@expo/config-plugins').ConfigPlugin<{ background?: boolean }>}
 */
const withEntitlementsPlugin = (config, props) => {
  return withEntitlementsPlist(config, (configPlist) => {
    configPlist.modResults['com.apple.developer.healthkit'] = true

    const existingAccess =
      configPlist.modResults['com.apple.developer.healthkit.access']
    const access = Array.isArray(existingAccess) ? [...existingAccess] : []
    if (!access.includes(HEALTH_RECORDS_ACCESS)) {
      access.push(HEALTH_RECORDS_ACCESS)
    }
    configPlist.modResults['com.apple.developer.healthkit.access'] = access

    if (props?.background !== false) {
      configPlist.modResults[
        'com.apple.developer.healthkit.background-delivery'
      ] = true
    }

    return configPlist
  })
}

/**
 * @type {import('@expo/config-plugins').ConfigPlugin<InfoPlistConfig>}
 */
const withInfoPlistPlugin = (config, props) => {
  return withInfoPlist(config, (configPlist) => {
    const existingClinicalDescription =
      configPlist.modResults.NSHealthClinicalHealthRecordsShareUsageDescription
    configPlist.modResults.NSHealthClinicalHealthRecordsShareUsageDescription =
      typeof props?.NSHealthClinicalHealthRecordsShareUsageDescription ===
      'string'
        ? props.NSHealthClinicalHealthRecordsShareUsageDescription
        : typeof existingClinicalDescription === 'string'
          ? existingClinicalDescription
          : `${config.name ?? pkg.name} wants to read your clinical health records`

    const existingShareDescription =
      configPlist.modResults.NSHealthShareUsageDescription
    configPlist.modResults.NSHealthShareUsageDescription =
      typeof props?.NSHealthShareUsageDescription === 'string'
        ? props.NSHealthShareUsageDescription
        : typeof existingShareDescription === 'string'
          ? existingShareDescription
          : `${config.name ?? pkg.name} wants to read your health data`

    return configPlist
  })
}

/**
 * @type {import('@expo/config-plugins').ConfigPlugin<AppPluginConfig>}
 */
const healthRecordsAppPlugin = (config, props) => {
  return withPlugins(config, [
    [withEntitlementsPlugin, props],
    [withInfoPlistPlugin, props],
  ])
}

module.exports = createRunOncePlugin(
  healthRecordsAppPlugin,
  pkg.name,
  pkg.version,
)
