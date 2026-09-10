import {
  type ConfigPlugin,
  createRunOncePlugin,
  withEntitlementsPlist,
  withInfoPlist,
  withPlugins,
} from '@expo/config-plugins'

import pkg from './package.json'

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

type AppPluginConfig = InfoPlistConfig

const HEALTH_RECORDS_ACCESS = 'health-records'

const withEntitlementsPlugin: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (configPlist) => {
    configPlist.modResults['com.apple.developer.healthkit'] = true

    const existingAccess =
      configPlist.modResults['com.apple.developer.healthkit.access']
    const access = Array.isArray(existingAccess) ? [...existingAccess] : []
    if (!access.includes(HEALTH_RECORDS_ACCESS)) {
      access.push(HEALTH_RECORDS_ACCESS)
    }
    configPlist.modResults['com.apple.developer.healthkit.access'] = access

    return configPlist
  })
}

const withInfoPlistPlugin: ConfigPlugin<InfoPlistConfig> = (config, props) => {
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

const healthRecordsAppPlugin: ConfigPlugin<AppPluginConfig> = (
  config,
  props,
) => {
  return withPlugins(config, [
    withEntitlementsPlugin,
    [withInfoPlistPlugin, props],
  ])
}

export default createRunOncePlugin(
  healthRecordsAppPlugin,
  pkg.name,
  pkg.version,
)
