import deserializCategorySample from './deserializeCategorySample'
import deserializeQuantitySample from './deserializeSample'

import type {
  HKCategorySampleRaw, HKCorrelationRaw, HKCorrelationTypeIdentifier, HKQuantitySampleRaw, HKQuantityTypeIdentifier,
} from '../native-types'
import type { HKCorrelation } from '../types'

function deserializeCorrelation<
  TIdentifier extends HKCorrelationTypeIdentifier
>(s: HKCorrelationRaw<TIdentifier>): HKCorrelation<TIdentifier> {
  return {
    ...s,
    objects: s.objects.map((o) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      if (o.quantity !== undefined) {
        return deserializeQuantitySample(o as HKQuantitySampleRaw<HKQuantityTypeIdentifier>)
      }

      return deserializCategorySample(o as HKCategorySampleRaw)
    }),
    endDate: new Date(s.endDate),
    startDate: new Date(s.startDate),
  }
}

export default deserializeCorrelation
