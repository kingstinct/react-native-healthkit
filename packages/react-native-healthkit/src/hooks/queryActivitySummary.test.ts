import { describe, expect, test } from 'bun:test'
import {
  ActivityMoveMode,
  type ActivitySummary,
  type ActivitySummaryDateComponents,
  type ActivitySummaryQueryFilter,
} from '../types/ActivitySummary'

describe('ActivitySummary Types and Interface', () => {
  test('should construct a valid ActivitySummary object with all required properties', () => {
    const dateComponents: ActivitySummaryDateComponents = {
      era: 1,
      year: 2026,
      month: 10,
      day: 8,
    }

    const summary: ActivitySummary = {
      dateComponents,
      activityMoveMode: ActivityMoveMode.activeEnergy,
      activeEnergyBurned: {
        unit: 'kcal',
        quantity: 450.5,
      },
      activeEnergyBurnedGoal: {
        unit: 'kcal',
        quantity: 600,
      },
      appleExerciseTime: {
        unit: 'min',
        quantity: 42,
      },
      appleExerciseTimeGoal: {
        unit: 'min',
        quantity: 30,
      },
      appleStandHours: {
        unit: 'count',
        quantity: 11,
      },
      appleStandHoursGoal: {
        unit: 'count',
        quantity: 12,
      },
      appleMoveTime: {
        unit: 'min',
        quantity: 50,
      },
      appleMoveTimeGoal: {
        unit: 'min',
        quantity: 60,
      },
      isPaused: false,
    }

    expect(summary.activityMoveMode).toBe(ActivityMoveMode.activeEnergy)
    expect(summary.activeEnergyBurned.quantity).toBe(450.5)
    expect(summary.appleExerciseTime.quantity).toBe(42)
    expect(summary.appleStandHours.quantity).toBe(11)
    expect(summary.isPaused).toBe(false)
    expect(summary.dateComponents.year).toBe(2026)
  })

  test('should support ActivitySummaryQueryFilter with DateFilter', () => {
    const filter: ActivitySummaryQueryFilter = {
      date: {
        startDate: new Date('2026-10-01T00:00:00Z'),
        endDate: new Date('2026-10-08T23:59:59Z'),
      },
    }

    expect(filter.date?.startDate).toBeInstanceOf(Date)
    expect(filter.date?.endDate).toBeInstanceOf(Date)
  })

  test('should support ActivityMoveMode enum values', () => {
    expect(ActivityMoveMode.activeEnergy).toBe(1)
    expect(ActivityMoveMode.appleMoveTime).toBe(2)
  })
})
