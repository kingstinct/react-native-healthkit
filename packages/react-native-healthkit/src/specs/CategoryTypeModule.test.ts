import { beforeAll, describe, expect, jest, test } from 'bun:test'

import '../test-setup'
import { queryCategorySamples } from '../healthkit.ios'
import { CategoryTypes } from '../modules'
import type { CategorySampleTyped } from '../types/CategoryType'

describe('CategoryTypeModule', () => {
  beforeAll(() => {
    // Set up test environment
  })

  test('queryCategorySamples should now default to unlimited samples', async () => {
    // Mock samples - more than the old default of 20
    const mockSamples: CategorySampleTyped<'HKCategoryTypeIdentifierSleepAnalysis'>[] =
      Array.from({ length: 50 }, (_, i) => ({
        uuid: `sample-${i}`,
        categoryType: 'HKCategoryTypeIdentifierSleepAnalysis' as const,
        value: 0,
        startDate: new Date(Date.now() - i * 1000 * 60 * 60),
        endDate: new Date(Date.now() - i * 1000 * 60 * 60 + 1000 * 60 * 30),
        metadata: {},
      }))

    // Mock the native module to return all samples when limit is infinity
    jest
      .spyOn(CategoryTypes, 'queryCategorySamples')
      .mockImplementation(async (identifier: any, options?: any) => {
        if (options?.limit === Number.POSITIVE_INFINITY) {
          return mockSamples as any // Return all samples when unlimited
        }
        const limit = options?.limit ?? 20
        return mockSamples.slice(0, limit) as any
      })

    // Test the new default behavior - should get all 50 samples
    const result = await queryCategorySamples(
      'HKCategoryTypeIdentifierSleepAnalysis',
    )
    expect(result).toHaveLength(50)

    // Verify that infinity was passed as the limit
    expect(CategoryTypes.queryCategorySamples).toHaveBeenCalledWith(
      'HKCategoryTypeIdentifierSleepAnalysis',
      expect.objectContaining({
        limit: Number.POSITIVE_INFINITY,
      }),
    )
  })

  test('queryCategorySamples should respect explicit limit options', async () => {
    // Mock the implementation to return different results based on limit
    const mockSamples: CategorySampleTyped<'HKCategoryTypeIdentifierSleepAnalysis'>[] =
      Array.from({ length: 50 }, (_, i) => ({
        uuid: `sample-${i}`,
        categoryType: 'HKCategoryTypeIdentifierSleepAnalysis' as const,
        value: 0,
        startDate: new Date(Date.now() - i * 1000 * 60 * 60), // 1 hour apart
        endDate: new Date(Date.now() - i * 1000 * 60 * 60 + 1000 * 60 * 30), // 30 min duration
        metadata: {},
      }))

    // Mock with default limit (20)
    jest
      .spyOn(CategoryTypes, 'queryCategorySamples')
      .mockImplementation(async (identifier: any, options?: any) => {
        const limit = options?.limit ?? 20 // Current default behavior
        return mockSamples.slice(
          0,
          limit === Number.POSITIVE_INFINITY ? mockSamples.length : limit,
        ) as any
      })

    // Test with custom limit (should return 30 samples)
    const customLimitResult = await queryCategorySamples(
      'HKCategoryTypeIdentifierSleepAnalysis',
      { limit: 30 },
    )
    expect(customLimitResult).toHaveLength(30)

    // Test with ascending option and limit
    const sortedResult = await queryCategorySamples(
      'HKCategoryTypeIdentifierSleepAnalysis',
      { limit: 10, ascending: true },
    )
    expect(sortedResult).toHaveLength(10)
  })

  test('queryCategorySamples should handle sleep analysis use case', async () => {
    // For sleep analysis, we want to be able to query multiple days of data
    // A full night of sleep from a fitness device can generate 50+ samples
    const mockSleepSamples: CategorySampleTyped<'HKCategoryTypeIdentifierSleepAnalysis'>[] =
      Array.from({ length: 100 }, (_, i) => ({
        uuid: `sleep-sample-${i}`,
        categoryType: 'HKCategoryTypeIdentifierSleepAnalysis' as const,
        value: i % 4, // Different sleep stages
        startDate: new Date(Date.now() - i * 1000 * 60 * 10), // 10 minutes apart
        endDate: new Date(Date.now() - i * 1000 * 60 * 10 + 1000 * 60 * 5), // 5 min duration
        metadata: {},
      }))

    jest
      .spyOn(CategoryTypes, 'queryCategorySamples')
      .mockImplementation(async (identifier: any, options?: any) => {
        const limit = options?.limit ?? 20
        return mockSleepSamples.slice(
          0,
          limit === Number.POSITIVE_INFINITY ? mockSleepSamples.length : limit,
        ) as any
      })

    // With new default behavior, we should get all samples for comprehensive sleep analysis
    const fullNightResult = await queryCategorySamples(
      'HKCategoryTypeIdentifierSleepAnalysis',
    )
    expect(fullNightResult).toHaveLength(100)

    // Verify infinity was passed
    expect(CategoryTypes.queryCategorySamples).toHaveBeenCalledWith(
      'HKCategoryTypeIdentifierSleepAnalysis',
      expect.objectContaining({
        limit: Number.POSITIVE_INFINITY,
      }),
    )
  })
})
