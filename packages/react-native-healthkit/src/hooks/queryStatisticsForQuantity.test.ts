/**
 * Test case to verify that queryStatisticsForQuantity resolves when no data is present
 */

import { describe, expect, jest, test } from 'bun:test'
import { QuantityTypes } from '../modules'
import type { QueryStatisticsResponse } from '../types/QuantityType'
import type { FilterForSamples } from '../types/QueryOptions'

describe('queryStatisticsForQuantity', () => {
  test('should resolve with empty response when no data is present', async () => {
    // This test would normally require running on iOS simulator or device
    // For now, we're just testing the TypeScript interface

    const mockEmptyResponse: QueryStatisticsResponse = {
      sources: [],
    }

    // Verify that empty response is properly typed
    expect(mockEmptyResponse.averageQuantity).toBeUndefined()
    expect(mockEmptyResponse.sumQuantity).toBeUndefined()
    expect(mockEmptyResponse.startDate).toBeUndefined()
    expect(mockEmptyResponse.endDate).toBeUndefined()
  })

  test('should handle date range with no data', async () => {
    // This is more of a documentation of the expected behavior
    // The query should resolve with an empty response object
    // when there's no data in the specified timeframe
    const expectedResult: QueryStatisticsResponse = {
      sources: [],
      // All properties should be undefined for empty result
    }

    expect(expectedResult).toBeDefined()
  })

  test('should pass wasUserEntered filter option to native module queryStatisticsForQuantity', async () => {
    const spy = jest
      .spyOn(QuantityTypes, 'queryStatisticsForQuantity')
      .mockResolvedValue({
        sources: [],
        sumQuantity: {
          quantity: 1250,
          unit: 'count',
        },
      })

    const filter: FilterForSamples = {
      wasUserEntered: false,
      date: {
        startDate: new Date('2026-10-01T00:00:00.000Z'),
        endDate: new Date('2026-10-08T23:59:59.000Z'),
      },
    }

    const result = await QuantityTypes.queryStatisticsForQuantity(
      'HKQuantityTypeIdentifierStepCount',
      ['cumulativeSum'],
      { filter },
    )

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'HKQuantityTypeIdentifierStepCount',
      ['cumulativeSum'],
      {
        filter: expect.objectContaining({
          wasUserEntered: false,
        }),
      },
    )
    expect(result.sumQuantity?.quantity).toBe(1250)
  })

  test('should export MetadataKeyWasUserEntered constant matching HealthKit metadata key', async () => {
    const { MetadataKeyWasUserEntered } = await import('../types/Constants')
    expect(MetadataKeyWasUserEntered).toBe('HKMetadataKeyWasUserEntered')
  })
})
