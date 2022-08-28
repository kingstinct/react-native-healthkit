/** @typedef { import('@expo/config-types').ExpoConfig } ExpoConfig  */

/**
 * @type {{ APP_ENV: 'staging' | 'development'}}
 */
const { CUSTOM_NAME } = process.env

/**
  * @param { { config: ExpoConfig } }
  * @returns {ExpoConfig}
  */
export default ({ config }) => (CUSTOM_NAME ? { ...config, name: CUSTOM_NAME } : config)
