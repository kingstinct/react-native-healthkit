import HealthKit
import NitroModules

class ActivitySummaryModule: HybridActivitySummaryModuleSpec {
  func queryActivitySummaries(startDate: Date, endDate: Date) throws -> Promise<[ActivitySummary]> {
    return Promise.async {
      let calendar = Calendar.current

      var startComponents = calendar.dateComponents(
        [.day, .month, .year, .era], from: startDate)
      var endComponents = calendar.dateComponents(
        [.day, .month, .year, .era], from: endDate)
      // HKActivitySummaryQuery requires the calendar to be set on the predicate's
      // DateComponents — without it the query returns no results.
      startComponents.calendar = calendar
      endComponents.calendar = calendar

      let predicate = HKQuery.predicate(
        forActivitySummariesBetweenStart: startComponents, end: endComponents)

      let summaries: [HKActivitySummary] = try await withCheckedThrowingContinuation {
        continuation in
        let query = HKActivitySummaryQuery(predicate: predicate) { _, summaries, error in
          if let error = error {
            continuation.resume(throwing: error)
          } else {
            continuation.resume(returning: summaries ?? [])
          }
        }
        store.execute(query)
      }

      return summaries.map { summary in
        let components = summary.dateComponents(for: calendar)
        return ActivitySummary(
          dateYear: Double(components.year ?? 0),
          dateMonth: Double(components.month ?? 0),
          dateDay: Double(components.day ?? 0),
          activeEnergyBurned: summary.activeEnergyBurned.doubleValue(for: .kilocalorie()),
          activeEnergyBurnedGoal: summary.activeEnergyBurnedGoal.doubleValue(for: .kilocalorie()),
          appleExerciseTime: summary.appleExerciseTime.doubleValue(for: .minute()),
          appleExerciseTimeGoal: summary.appleExerciseTimeGoal.doubleValue(for: .minute()),
          appleStandHours: summary.appleStandHours.doubleValue(for: .count()),
          appleStandHoursGoal: summary.appleStandHoursGoal.doubleValue(for: .count()),
          appleMoveTime: summary.appleMoveTime.doubleValue(for: .minute()),
          appleMoveTimeGoal: summary.appleMoveTimeGoal.doubleValue(for: .minute())
        )
      }
    }
  }
}
