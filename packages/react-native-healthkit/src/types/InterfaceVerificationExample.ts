/**
 * Example usage of the InterfaceVerification utility
 *
 * This file demonstrates how to use the reusable interface verification utility
 * to ensure that typed and untyped versions of interfaces stay in sync.
 */

import type { HybridObject } from 'react-native-nitro-modules'
import type { InterfaceAssertion } from './InterfaceVerification'

// Example: Basic interface without generics
export interface ExampleModule extends HybridObject<{ ios: 'swift' }> {
  getData(id: string): Promise<string>
  saveData(id: string, data: string): Promise<boolean>
  deleteData(id: string): Promise<void>
}

// Example: Typed version with generics
export interface ExampleModuleTyped {
  getData<T extends string>(id: T): Promise<string>
  saveData<T extends string>(id: T, data: string): Promise<boolean>
  deleteData<T extends string>(id: T): Promise<void>
}

// Verification: This will cause a TypeScript error if the interfaces don't match
const _exampleVerification: InterfaceAssertion<
  ExampleModule,
  ExampleModuleTyped,
  keyof HybridObject
> = true

// Example: Interface with optional parameters
export interface ConfigModule extends HybridObject<{ ios: 'swift' }> {
  getConfig(key: string, defaultValue?: string): Promise<string>
  setConfig(key: string, value: string, persistent?: boolean): Promise<void>
}

export interface ConfigModuleTyped {
  getConfig<T extends string>(key: T, defaultValue?: string): Promise<string>
  setConfig<T extends string>(
    key: T,
    value: string,
    persistent?: boolean,
  ): Promise<void>
}

// Verification for optional parameters
const _configVerification: InterfaceAssertion<
  ConfigModule,
  ConfigModuleTyped,
  keyof HybridObject
> = true

// Example: What happens when there's a mismatch
export interface BadModule extends HybridObject<{ ios: 'swift' }> {
  method1(): void
  method2(param: string): void
  // This method exists in BadModule but not in BadModuleTyped
  extraMethod(): void
}

export interface BadModuleTyped {
  method1(): void
  method2(param: string): void
  // Missing extraMethod - this will cause a TypeScript error
}

// This will show a TypeScript error indicating the mismatch
// Uncomment to see the error:
// const _badVerification: InterfaceAssertion<BadModule, BadModuleTyped, keyof HybridObject> = true;

/**
 * Usage Instructions:
 *
 * 1. Import the InterfaceAssertion type from InterfaceVerification
 * 2. Create your base interface (extending HybridObject)
 * 3. Create your typed interface (with generics)
 * 4. Add a verification line:
 *    const _verification: InterfaceAssertion<BaseInterface, TypedInterface, keyof HybridObject> = true;
 *
 * The verification will:
 * - Check that both interfaces have the same method names
 * - Check that corresponding methods have the same number of parameters
 * - Show descriptive TypeScript errors if there are mismatches
 *
 * Error Types:
 * - "Interface mismatch detected" - method names don't match
 * - "Parameter count mismatch detected" - parameter counts don't match
 */
