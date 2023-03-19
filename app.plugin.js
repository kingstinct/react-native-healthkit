/* eslint-disable import/no-extraneous-dependencies, functional/immutable-data, no-param-reassign, @typescript-eslint/no-var-requires */
/** @type {import('@expo/config-plugins')} */
const {
  withProjectBuildGradle,
  withDangerousMod,
  withPlugins,
  withAndroidManifest,
  withAppDelegate,
  WarningAggregator,
  createRunOncePlugin,
  withEntitlementsPlist,
} = require('@expo/config-plugins')
/* const fs = require('fs')
const path = require('path')

const ENABLE_BACKGROUND_DELIVERY = 'enableBackgroundDelivery'

const modifyAppDelegate = (appDelegate) => {
  if (!appDelegate.includes(SPOTLIGHT_IMPORT)) {
    appDelegate = SPOTLIGHT_IMPORT + appDelegate
  }
  const updatedAppDelegate = appDelegate.replace(
    SPOTLIGHT_ACTIVITY,
    SPOTLIGHT_ACTIVITY_ADD,
  )
  return updatedAppDelegate
} */

/** @type {import('@expo/config-plugins').ConfigPlugin} */
/* const withEnableBackgroundDelivery = (config) => withAppDelegate(config, (config) => {
  if (['objc', 'objcpp'].includes(config.modResults.language)) {
    config.modResults.contents = modifyAppDelegate(
      config.modResults.contents,
    )
  } else {
    WarningAggregator.addWarningIOS(
      'withSpotlightAppDelegate',
      'Swift AppDelegate files are not supported yet.',
    )
  }
  return config
}) */

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withEntitlements = (config) => withEntitlementsPlist(config, {
  'com.apple.developer.healthkit': true,
  'com.apple.developer.healthkit.background-delivery': true, // (optional) if you want to use background delivery
})

const pkg = require('./package.json')

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const mdsPlugins = (config) => withPlugins(config, [withEntitlements])

module.exports = createRunOncePlugin(mdsPlugins, pkg.name, pkg.version)
