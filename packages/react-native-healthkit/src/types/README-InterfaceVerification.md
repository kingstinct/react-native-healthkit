# Interface Verification Utility

A TypeScript utility for ensuring that typed and untyped versions of interfaces stay in sync during development.

## Overview

When working with libraries like `react-native-nitro-modules`, you often have two versions of an interface:
1. A base interface that extends `HybridObject` (for the native bridge)
2. A typed interface with generics for better type safety

This utility ensures both interfaces have the same method names and parameter counts, catching mismatches at compile-time.

## Quick Start

```typescript
import type { InterfaceAssertion } from "../types/InterfaceVerification";

// Base interface
export interface MyModule extends HybridObject<{ ios: "swift" }> {
	getData(id: string): Promise<string>;
	saveData(id: string, data: string): Promise<boolean>;
}

// Typed interface
export interface MyModuleTyped {
	getData<T extends string>(id: T): Promise<string>;
	saveData<T extends string>(id: T, data: string): Promise<boolean>;
}

// Verification - will cause TypeScript error if interfaces don't match
const _verification: InterfaceAssertion<MyModule, MyModuleTyped, keyof HybridObject> = true;
```

## Features

- ✅ **Method name verification** - Ensures both interfaces have the same methods
- ✅ **Parameter count verification** - Ensures corresponding methods have the same number of parameters
- ✅ **Descriptive error messages** - Shows exactly what's missing or mismatched
- ✅ **Zero runtime cost** - Pure TypeScript types with no JavaScript output
- ✅ **Compile-time checking** - Catches issues during development, not runtime

## Error Types

### Interface Mismatch
When method names don't match between interfaces:

```typescript
// Error: Interface mismatch detected
// MissingInBase: "newMethod"
// MissingInTyped: never
```

### Parameter Count Mismatch
When corresponding methods have different parameter counts:

```typescript
// Error: Parameter count mismatch detected
// MethodsWithParameterCountMismatch: "getData"
```

## API Reference

### `InterfaceAssertion<BaseInterface, TypedInterface, ExcludeFromBase>`

Main utility type for interface verification.

**Parameters:**
- `BaseInterface` - The base interface (usually extending HybridObject)
- `TypedInterface` - The typed interface with generics
- `ExcludeFromBase` - Keys to exclude from the base interface (e.g., `keyof HybridObject`)

**Returns:**
- `true` if interfaces match
- Error object with descriptive message if they don't match

### Other Utility Types

- `ExtractMethodNames<T, ExcludeKeys>` - Extracts method names from an interface
- `GetParameterCount<T>` - Gets parameter count of a function type
- `CheckMethodNames<BaseInterface, TypedInterface, ExcludeFromBase>` - Detailed method name comparison
- `CheckParameterCounts<BaseInterface, TypedInterface, ExcludeFromBase>` - Detailed parameter count comparison

## Usage in Your Project

1. Copy `InterfaceVerification.ts` to your project
2. Import `InterfaceAssertion` in your module files
3. Add verification lines after your interface definitions
4. TypeScript will show errors if interfaces don't match

## Best Practices

1. **Always exclude inherited keys** - Use `keyof HybridObject` or similar to exclude inherited methods
2. **Add verification immediately** - Add the verification line right after defining both interfaces
3. **Use descriptive naming** - Name your verification constants with `_verification` or similar
4. **Keep interfaces close** - Define both interfaces in the same file when possible

## Examples

See `InterfaceVerificationExample.ts` for complete examples including:
- Basic interfaces
- Interfaces with optional parameters
- What happens when interfaces don't match
- Real-world usage patterns
