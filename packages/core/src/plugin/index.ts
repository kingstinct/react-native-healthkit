/**
 * Building blocks for the Expo config plugins of the react-native-healthkit
 * packages. Not part of the runtime bundle: import from
 * `@react-native-healthkit/core/plugin` in an `app.plugin.ts` only.
 */
import {
  type ConfigPlugin,
  withEntitlementsPlist,
  withInfoPlist,
  withPlugins,
} from '@expo/config-plugins'

export interface HealthKitEntitlementsProps {
  /**
   * Adds the background-delivery entitlement. Enabled by default; set to
   * `false` to opt out. Launch-time observer registration needs no AppDelegate
   * change: the core pod hooks UIApplicationDidFinishLaunchingNotification.
   */
  readonly background?: boolean
  /**
   * Values to append to `com.apple.developer.healthkit.access`, e.g.
   * `health-records` for clinical records.
   */
  readonly access?: readonly string[]
}

/**
 * Adds the `com.apple.developer.healthkit` entitlement, the background-delivery
 * entitlement unless opted out, and any extra `healthkit.access` values.
 */
export const withHealthKitEntitlements: ConfigPlugin<
  HealthKitEntitlementsProps | undefined
> = (config, props) => {
  return withEntitlementsPlist(config, (configPlist) => {
    configPlist.modResults['com.apple.developer.healthkit'] = true

    // background is enabled by default, but possible to opt-out from
    // (haven't seen any drawbacks from having it enabled)
    if (props?.background !== false) {
      configPlist.modResults[
        'com.apple.developer.healthkit.background-delivery'
      ] = true
    }

    if (props?.access && props.access.length > 0) {
      const existingAccess =
        configPlist.modResults['com.apple.developer.healthkit.access']
      const access = Array.isArray(existingAccess) ? [...existingAccess] : []
      for (const entry of props.access) {
        if (!access.includes(entry)) {
          access.push(entry)
        }
      }
      configPlist.modResults['com.apple.developer.healthkit.access'] = access
    }

    return configPlist
  })
}

export interface UsageDescriptionProps {
  /** Info.plist key, e.g. `NSHealthShareUsageDescription`. */
  readonly key: string
  /** Explicit description; wins over whatever Info.plist already has. */
  readonly value?: string | boolean
  /**
   * Builds the description when neither `value` nor the existing Info.plist
   * entry is a string. Receives the app name.
   */
  readonly fallback: (appName: string) => string
  /** Used by `fallback` when the Expo config has no `name`. */
  readonly fallbackAppName?: string
}

/**
 * Sets one Info.plist usage description: an explicit string wins, an existing
 * string is kept, otherwise `fallback` builds a default from the app name.
 */
export const withUsageDescription: ConfigPlugin<UsageDescriptionProps> = (
  config,
  { key, value, fallback, fallbackAppName },
) => {
  return withInfoPlist(config, (configPlist) => {
    const existing = configPlist.modResults[key]
    configPlist.modResults[key] =
      typeof value === 'string'
        ? value
        : typeof existing === 'string'
          ? existing
          : fallback(config.name ?? fallbackAppName ?? 'This app')
    return configPlist
  })
}

export interface HealthKitPluginProps extends HealthKitEntitlementsProps {
  /**
   * Shown when asking the user for read access to health data. Defaults to
   * `<app name> wants to read your health data`.
   */
  readonly NSHealthShareUsageDescription?: string | boolean
  /** Used in default usage descriptions when the Expo config has no `name`. */
  readonly fallbackAppName?: string
}

/**
 * The configuration every HealthKit package needs: entitlements plus
 * `NSHealthShareUsageDescription`. Packages compose it with their own keys.
 */
export const withHealthKit: ConfigPlugin<HealthKitPluginProps | undefined> = (
  config,
  props,
) => {
  return withPlugins(config, [
    [
      withHealthKitEntitlements,
      { background: props?.background, access: props?.access },
    ],
    [
      withUsageDescription,
      {
        key: 'NSHealthShareUsageDescription',
        value: props?.NSHealthShareUsageDescription,
        fallback: (appName: string) =>
          `${appName} wants to read your health data`,
        fallbackAppName: props?.fallbackAppName,
      },
    ],
  ])
}
