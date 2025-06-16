/**
 * TypeScript utility types for verifying that two interfaces have matching method signatures.
 *
 * This is particularly useful for ensuring that typed and untyped versions of interfaces
 * stay in sync when one has generics and the other doesn't.
 *
 * @example
 * ```typescript
 * import type { InterfaceAssertion } from "./InterfaceVerification";
 *
 * interface BaseModule extends HybridObject<{ ios: "swift" }> {
 *   getData(id: string): Promise<string>;
 * }
 *
 * interface BaseModuleTyped {
 *   getData<T extends string>(id: T): Promise<string>;
 * }
 *
 * // This will cause a TypeScript error if the interfaces don't match
 * const _verification: InterfaceAssertion<BaseModule, BaseModuleTyped, keyof HybridObject> = true;
 * ```
 */

/**
 * Extracts method names from an interface, excluding specified keys
 */
export type ExtractMethodNames<
  T,
  ExcludeKeys extends keyof T = never,
> = Exclude<keyof T, ExcludeKeys>

/**
 * Gets the parameter count of a function type
 */
export type GetParameterCount<T> = T extends (...args: infer P) => unknown
  ? P['length']
  : never

/**
 * Checks if two interfaces have the same method names
 */
export type CheckMethodNames<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase extends keyof BaseInterface = never,
> = {
  BaseMethodNames: ExtractMethodNames<BaseInterface, ExcludeFromBase>
  TypedMethodNames: ExtractMethodNames<TypedInterface>
  MissingInBase: Exclude<
    ExtractMethodNames<TypedInterface>,
    ExtractMethodNames<BaseInterface, ExcludeFromBase>
  >
  MissingInTyped: Exclude<
    ExtractMethodNames<BaseInterface, ExcludeFromBase>,
    ExtractMethodNames<TypedInterface>
  >
  InterfaceMismatch:
    | Exclude<
        ExtractMethodNames<TypedInterface>,
        ExtractMethodNames<BaseInterface, ExcludeFromBase>
      >
    | Exclude<
        ExtractMethodNames<BaseInterface, ExcludeFromBase>,
        ExtractMethodNames<TypedInterface>
      >
}

/**
 * Checks parameter counts for shared methods between two interfaces
 */
export type CheckParameterCounts<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase extends keyof BaseInterface = never,
> = {
  SharedMethodNames: ExtractMethodNames<BaseInterface, ExcludeFromBase> &
    ExtractMethodNames<TypedInterface>
  ParameterCountMismatches: {
    [K in ExtractMethodNames<BaseInterface, ExcludeFromBase> &
      ExtractMethodNames<TypedInterface>]: GetParameterCount<
      BaseInterface[K]
    > extends GetParameterCount<TypedInterface[K]>
      ? GetParameterCount<TypedInterface[K]> extends GetParameterCount<
          BaseInterface[K]
        >
        ? never
        : K
      : K
  }[ExtractMethodNames<BaseInterface, ExcludeFromBase> &
    ExtractMethodNames<TypedInterface>]
}

/**
 * Complete interface verification that checks both method names and parameter counts
 */
export type VerifyInterfaceSync<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase extends keyof BaseInterface = never,
> = {
  MethodCheck: CheckMethodNames<BaseInterface, TypedInterface, ExcludeFromBase>
  ParameterCheck: CheckParameterCounts<
    BaseInterface,
    TypedInterface,
    ExcludeFromBase
  >

  // Final verification result
  Result: CheckMethodNames<
    BaseInterface,
    TypedInterface,
    ExcludeFromBase
  >['InterfaceMismatch'] extends never
    ? CheckParameterCounts<
        BaseInterface,
        TypedInterface,
        ExcludeFromBase
      >['ParameterCountMismatches'] extends never
      ? true
      : {
          ERROR: 'Parameter count mismatch detected'
          MethodsWithParameterCountMismatch: CheckParameterCounts<
            BaseInterface,
            TypedInterface,
            ExcludeFromBase
          >['ParameterCountMismatches']
        }
    : {
        ERROR: 'Interface mismatch detected'
        MissingInBase: CheckMethodNames<
          BaseInterface,
          TypedInterface,
          ExcludeFromBase
        >['MissingInBase']
        MissingInTyped: CheckMethodNames<
          BaseInterface,
          TypedInterface,
          ExcludeFromBase
        >['MissingInTyped']
      }
}

/**
 * Simplified interface verification for common use cases
 */
export type AssertInterfacesMatch<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase extends keyof BaseInterface = never,
> = VerifyInterfaceSync<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase
>['Result']

/**
 * Creates a compile-time assertion that two interfaces match
 * Usage: const _check: InterfaceAssertion<BaseInterface, TypedInterface> = true;
 */
export type InterfaceAssertion<
  BaseInterface,
  TypedInterface,
  ExcludeFromBase extends keyof BaseInterface = never,
> = AssertInterfacesMatch<BaseInterface, TypedInterface, ExcludeFromBase>
