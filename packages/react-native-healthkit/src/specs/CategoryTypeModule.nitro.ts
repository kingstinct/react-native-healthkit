import type { AnyMap, HybridObject } from 'react-native-nitro-modules'

import type {
  CategorySample,
  CategorySamplesWithAnchorResponse,
  CategorySamplesWithAnchorResponseTyped,
  CategorySampleTyped,
  CategoryValueForIdentifier,
  MetadataForCategoryIdentifier,
} from '../types/CategoryType'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import type { InterfaceAssertion } from '../types/InterfaceVerification'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'

export interface CategoryTypeModule extends HybridObject<{ ios: 'swift' }> {
  saveCategorySample(
    identifier: CategoryTypeIdentifier,
    value: CategoryValueForIdentifier,
    startDate: Date,
    endDate: Date,
    metadata: AnyMap,
  ): Promise<boolean>

  queryCategorySamples(
    identifier: CategoryTypeIdentifier,
    options?: QueryOptionsWithSortOrder,
  ): Promise<readonly CategorySample[]>

  queryCategorySamplesWithAnchor(
    identifier: CategoryTypeIdentifier,
    options: QueryOptionsWithAnchor,
  ): Promise<CategorySamplesWithAnchorResponse>
}

// Interface verification to ensure CategoryTypeModule and CategoryTypeModuleTyped stay in sync
// This will cause a TypeScript compilation error if the interfaces have different method names or parameter counts
const _interfaceVerification: InterfaceAssertion<
  CategoryTypeModule,
  CategoryTypeModuleTyped,
  keyof HybridObject
> = true

export interface CategoryTypeModuleTyped {
  saveCategorySample<T extends CategoryTypeIdentifier>(
    identifier: T,
    value: CategoryValueForIdentifier,
    startDate: Date,
    endDate: Date,
    metadata: MetadataForCategoryIdentifier<T>,
  ): Promise<boolean>

  queryCategorySamples<T extends CategoryTypeIdentifier>(
    identifier: T,
    options?: QueryOptionsWithSortOrder,
  ): Promise<readonly CategorySampleTyped<T>[]>

  queryCategorySamplesWithAnchor<T extends CategoryTypeIdentifier>(
    identifier: T,
    options: QueryOptionsWithAnchor,
  ): Promise<CategorySamplesWithAnchorResponseTyped<T>>
}
