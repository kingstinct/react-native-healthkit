import { afterEach, beforeEach, describe, expect, jest, test } from 'bun:test'

import { QuantityTypes } from '../modules'
import generateQuantityTypeSamples from './generateQuantityTypeSamples'

describe('generateQuantityTypeSamples', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should generate samples with default date range', async () => {
    const saveMock = jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockResolvedValue(true)
    const queryMock = jest
      .spyOn(QuantityTypes, 'queryQuantitySamples')
      .mockResolvedValue([])

    const result = await generateQuantityTypeSamples(
      'HKQuantityTypeIdentifierStepCount',
      5,
    )

    expect(result).toBe(true)
    expect(saveMock).toHaveBeenCalledTimes(5)
    expect(queryMock).toHaveBeenCalledTimes(1)
  })

  test('should generate samples with custom date range', async () => {
    const saveMock = jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockResolvedValue(true)
    const queryMock = jest
      .spyOn(QuantityTypes, 'queryQuantitySamples')
      .mockResolvedValue([])

    const fromDate = new Date('2024-01-01')
    const toDate = new Date('2024-01-07')

    const result = await generateQuantityTypeSamples(
      'HKQuantityTypeIdentifierHeartRate',
      7,
      { fromDate, toDate },
    )

    expect(result).toBe(true)
    expect(saveMock).toHaveBeenCalledTimes(7)
  })

  test('should return false if any sample fails to save', async () => {
    jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
    jest.spyOn(QuantityTypes, 'queryQuantitySamples').mockResolvedValue([])

    const result = await generateQuantityTypeSamples(
      'HKQuantityTypeIdentifierStepCount',
      3,
    )

    expect(result).toBe(false)
  })

  test('should spread samples evenly across time range', async () => {
    const saveMock = jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockResolvedValue(true)
    jest.spyOn(QuantityTypes, 'queryQuantitySamples').mockResolvedValue([])

    const fromDate = new Date('2024-01-01T00:00:00Z')
    const toDate = new Date('2024-01-04T00:00:00Z')

    await generateQuantityTypeSamples('HKQuantityTypeIdentifierStepCount', 3, {
      fromDate,
      toDate,
    })

    const calls = saveMock.mock.calls
    expect(calls.length).toBe(3)

    // Check that dates are spread evenly (each day)
    const dates = calls.map((call) => call[3] as Date)
    const timeRange = toDate.getTime() - fromDate.getTime()
    const interval = timeRange / 3

    for (let i = 0; i < dates.length; i++) {
      const expectedTime = fromDate.getTime() + interval * i
      expect(dates[i]?.getTime()).toBe(expectedTime)
    }
  })

  test('should use realistic values from the predefined ranges', async () => {
    const saveMock = jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockResolvedValue(true)
    jest.spyOn(QuantityTypes, 'queryQuantitySamples').mockResolvedValue([])

    await generateQuantityTypeSamples('HKQuantityTypeIdentifierHeartRate', 10)

    const calls = saveMock.mock.calls
    const values = calls.map((call) => call[2] as number)

    // Heart rate should be between 60 and 100 based on our realistic ranges
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(60)
      expect(value).toBeLessThanOrEqual(100)
    }
  })

  test('should handle errors gracefully', async () => {
    jest
      .spyOn(QuantityTypes, 'saveQuantitySample')
      .mockRejectedValue(new Error('Save failed'))
    jest.spyOn(QuantityTypes, 'queryQuantitySamples').mockResolvedValue([])

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const result = await generateQuantityTypeSamples(
      'HKQuantityTypeIdentifierStepCount',
      2,
    )

    expect(result).toBe(false)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2)

    consoleErrorSpy.mockRestore()
  })
})
