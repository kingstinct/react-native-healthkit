import type { QuantityTypeIdentifier } from '@kingstinct/react-native-healthkit'

export const transformQuantityIdentifierToName = (
  identifier: QuantityTypeIdentifier,
) => {
  return identifier
    .replace('HKQuantityTypeIdentifier', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}
