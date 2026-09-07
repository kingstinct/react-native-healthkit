//
//  MemoryEstimation.swift
//  Pods
//
//  Rough estimates of the native heap kept alive by HybridObject proxies,
//  reported to Nitro via `memorySize` so the JS garbage collector can account
//  for memory it cannot see. Precision is not the goal; the right order of
//  magnitude per object is.
//

import HealthKit

/// Approximate bridging overhead that every Nitro HybridObject carries on the
/// native side but that Nitro itself does not report: the C++ HybridObject
/// with its per-runtime cache map, the Swift bridge class, the `shared_ptr`
/// control block and the reference-state records for the JS weak reference.
let nitroHybridObjectOverheadBytes = 512

/// Rough size of an `NSString` on the heap, including its object header.
func estimateStringMemorySize(_ value: String?) -> Int {
  guard let value = value else {
    return 0
  }
  return 32 + value.utf16.count * 2
}

/// Rough size of a `metadata` dictionary as HealthKit keeps it in memory.
func estimateMetadataMemorySize(_ metadata: [String: Any]?) -> Int {
  guard let metadata = metadata, !metadata.isEmpty else {
    return 0
  }
  // NSDictionary header plus one bucket per entry.
  var total = 64 + metadata.count * 48
  for (key, value) in metadata {
    total += estimateStringMemorySize(key)
    if let string = value as? String {
      total += estimateStringMemorySize(string)
    } else if value is HKQuantity {
      // HKQuantity: object header, unit object, double.
      total += 128
    } else {
      // NSNumber, NSDate and friends are small tagged or boxed objects.
      total += 32
    }
  }
  return total
}

/// Rough size of one `HKStatistics` entry: the object itself plus the
/// sum/min/max/average/most-recent quantities and their date interval.
let estimatedStatisticsEntryMemorySize = 512

func estimateWorkoutMemorySize(_ workout: HKWorkout) -> Int {
  // HKWorkout object, uuid, dates, HKSourceRevision (+HKSource), HKDevice,
  // and the four total quantities.
  var total = 1_024 + nitroHybridObjectOverheadBytes
  total += estimateMetadataMemorySize(workout.metadata)

  if let events = workout.workoutEvents {
    for event in events {
      // HKWorkoutEvent: object header, type, NSDateInterval.
      total += 128 + estimateMetadataMemorySize(event.metadata)
    }
  }

  if #available(iOS 16.0, *) {
    total += workout.allStatistics.count * estimatedStatisticsEntryMemorySize

    for activity in workout.workoutActivities {
      // HKWorkoutActivity: object header, uuid, dates, HKWorkoutConfiguration.
      total += 512
      total += estimateMetadataMemorySize(activity.metadata)
      total += activity.workoutEvents.count * 128
      total += activity.allStatistics.count * estimatedStatisticsEntryMemorySize
    }
  }

  return total
}
