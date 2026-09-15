import { Platform } from 'react-native'

// biome-ignore lint/suspicious/noExplicitAny: must accept any function signature
type AnyFunction = (...args: any[]) => any

/**
 * Helpers for the stubs a package exports on platforms without HealthKit
 * (anything but iOS). `TModule` is the shape of the package's iOS entry point,
 * so each stub keeps the signature of the function it stands in for. The first
 * stub called on an unsupported platform warns once.
 *
 * @example
 * const { unavailableFn, warnIfUnavailable } =
 *   createUnavailableHelpers<typeof HealthkitIOS>('@kingstinct/react-native-healthkit')
 * export const isHealthDataAvailable = unavailableFn('isHealthDataAvailable', false)
 * export function queryQuantitySamples<T>(_id: T) {
 *   warnIfUnavailable()
 *   return Promise.resolve([])
 * }
 */
export const createUnavailableHelpers = <TModule extends object>(
  packageName: string,
) => {
  const notAvailableError = `[${packageName}] Platform "${Platform.OS}" not supported. HealthKit is only available on iOS.`
  let hasWarned = false

  /** Warns once that HealthKit is unavailable on this platform. */
  const warnIfUnavailable = () => {
    if (Platform.OS !== 'ios' && !hasWarned) {
      console.warn(notAvailableError)
      hasWarned = true
    }
  }

  /** A stub for `TModule[TKey]` that warns once and returns `defaultValue`. */
  const unavailableFn = <
    TKey extends keyof TModule,
    TFn extends AnyFunction = Extract<TModule[TKey], AnyFunction>,
  >(
    _fn: TKey,
    defaultValue: ReturnType<TFn>,
  ): TFn => {
    const stub = () => {
      warnIfUnavailable()
      return defaultValue
    }
    return stub as unknown as TFn
  }

  return { unavailableFn, warnIfUnavailable }
}
