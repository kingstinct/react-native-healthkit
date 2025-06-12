
import { CategoryTypes } from "..";
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";
import type { CategoryValueForIdentifier, MetadataMapperForCategoryIdentifier } from "../types/CategoryType";


export function saveCategorySample<T extends CategoryTypeIdentifier>(
  identifier: T,
  value: CategoryValueForIdentifier<T>,
  options?: {
    start?: Date;
    end?: Date;
    metadata?: MetadataMapperForCategoryIdentifier<T>;
  },
) {
  const start = options?.start || options?.end || new Date();
  const end = options?.end || options?.start || new Date();
  const metadata = options?.metadata || {};

  return CategoryTypes.saveCategorySample(
    identifier,
    value,
    start,
    end,
    metadata,
  );
}