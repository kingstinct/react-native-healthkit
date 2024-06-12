import deserializeCategorySample from './deserializeCategorySample'

import type { HKCategorySampleRaw } from '../types'

describe('deserializeCategorySample', () => {
  it('should deserialize category sample', async () => {
    const { HKCategoryTypeIdentifier } = await import('../native-types')

    const sample: HKCategorySampleRaw = {
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-01T00:00:00.000Z',
      value: 1,
      categoryType: HKCategoryTypeIdentifier.sexualActivity,
      metadata: {},
      uuid: 'uuid',
    }

    expect(deserializeCategorySample(sample)).toEqual({
      ...sample,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2020-01-01T00:00:00.000Z'),
    })
  })
})
