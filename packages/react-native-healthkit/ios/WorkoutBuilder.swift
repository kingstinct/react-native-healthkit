import HealthKit
import NitroModules
import ReactNativeHealthkitCore

func createQuantitySampleForWorkout(_ sample: QuantitySampleForSaving) throws -> HKQuantitySample {
  let type = try initializeQuantityType(sample.quantityType.stringValue)
  let unit = try parseUnitStringSafe(sample.unit)

  if !type.is(compatibleWith: unit) {
    throw runtimeErrorWithPrefix(
      "Unit '\(sample.unit)' is not compatible with \(type.identifier)"
    )
  }
  if sample.startDate > sample.endDate {
    throw runtimeErrorWithPrefix("endDate must not be less than startDate")
  }

  return HKQuantitySample(
    type: type,
    quantity: HKQuantity(unit: unit, doubleValue: sample.quantity),
    start: sample.startDate,
    end: sample.endDate,
    metadata: anyMapToDictionaryOptional(sample.metadata)
  )
}

func createWorkoutEvent(_ event: WorkoutEvent) throws -> HKWorkoutEvent {
  guard let type = HKWorkoutEventType(rawValue: Int(event.type.rawValue)) else {
    throw runtimeErrorWithPrefix("Unknown WorkoutEventType with rawValue: \(event.type.rawValue)")
  }
  if event.startDate > event.endDate {
    throw runtimeErrorWithPrefix("endDate must not be less than startDate")
  }

  return try createWorkoutEventSafe(
    type: type,
    dateInterval: DateInterval(start: event.startDate, end: event.endDate),
    metadata: anyMapToDictionaryOptional(event.metadata)
  )
}

func parseActivityUUID(_ uuid: String) throws -> UUID {
  guard let parsed = UUID(uuidString: uuid) else {
    throw runtimeErrorWithPrefix("Invalid activity UUID: \(uuid)")
  }
  return parsed
}

class WorkoutBuilder: HybridWorkoutBuilderSpec {
  private enum State {
    case building, finishing, finished, discarded
  }

  private let builder: HKWorkoutBuilder
  private let stateLock = NSLock()
  private var state = State.building
  private var lastOperation: Task<Void, Never>?

  // Promise.async tasks can start in any order, so calls JS doesn't await could reach
  // HealthKit out of order (e.g. add after finishWorkout, resume before pause).
  private func enqueue<T>(_ operation: @escaping () async throws -> T) -> Promise<T> {
    let promise = Promise<T>()
    stateLock.lock()
    defer { stateLock.unlock() }
    let previous = lastOperation
    lastOperation = Task {
      await previous?.value
      do {
        promise.resolve(withResult: try await operation())
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  // HealthKit never calls the completion of some builder methods once the workout is finished,
  // so their promises would never settle.
  private func ensureBuilding(_ method: String) throws {
    stateLock.lock()
    defer { stateLock.unlock() }
    switch state {
    case .building:
      return
    case .finishing:
      throw runtimeErrorWithPrefix("\(method) can't be called while finishWorkout is in progress")
    case .finished:
      throw runtimeErrorWithPrefix("\(method) can't be called after finishWorkout")
    case .discarded:
      throw runtimeErrorWithPrefix("\(method) can't be called after discardWorkout")
    }
  }

  private func beginFinishing() throws {
    stateLock.lock()
    defer { stateLock.unlock() }
    switch state {
    case .building:
      state = .finishing
    case .finishing:
      throw runtimeErrorWithPrefix("finishWorkout is already in progress")
    case .finished:
      throw runtimeErrorWithPrefix("finishWorkout can't be called after finishWorkout")
    case .discarded:
      throw runtimeErrorWithPrefix("finishWorkout can't be called after discardWorkout")
    }
  }

  // discardWorkout may have run while finishWorkout was awaiting HealthKit; keep that state.
  private func endFinishing(_ newState: State) {
    stateLock.lock()
    defer { stateLock.unlock() }
    if state == .finishing {
      state = newState
    }
  }

  @available(iOS 16.0, *)
  private func parseBuilderActivityUUID(_ uuid: String) throws -> UUID {
    let parsed = try parseActivityUUID(uuid)
    if !builder.workoutActivities.contains(where: { $0.uuid == parsed }) {
      throw runtimeErrorWithPrefix("No activity with UUID \(uuid) has been added to this builder")
    }
    return parsed
  }

  init(workoutConfiguration: WorkoutConfiguration) {
    self.builder = HKWorkoutBuilder(
      healthStore: healthStore,
      configuration: parseWorkoutConfiguration(workoutConfiguration),
      device: .local()
    )
  }

  // The builder's samples, events and activities live in the HealthKit daemon, not in this process.
  let memorySize: Int = nitroHybridObjectOverheadBytes

  var workoutConfiguration: WorkoutConfiguration {
    return serializeWorkoutConfiguration(builder.workoutConfiguration)
  }

  var startDate: Date? {
    return builder.startDate
  }

  var endDate: Date? {
    return builder.endDate
  }

  var metadata: AnyMap {
    return serializeMetadata(builder.metadata)
  }

  var workoutEvents: [WorkoutEvent] {
    return serializeWorkoutEvents(builder.workoutEvents)
  }

  var workoutActivities: [WorkoutBuilderActivity] {
    if #available(iOS 16.0, *) {
      return builder.workoutActivities.map { activity in
        WorkoutBuilderActivity(
          startDate: activity.startDate,
          endDate: activity.endDate,
          uuid: activity.uuid.uuidString,
          duration: activity.duration,
          activityType: serializeWorkoutActivityType(activity)
        )
      }
    }
    return []
  }

  func elapsedTime(date: Date) -> Double {
    return builder.elapsedTime(at: date)
  }

  func beginCollection(startDate: Date) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("beginCollection")
      try await self.builder.beginCollection(at: startDate)
    }
  }

  func add(samples: [QuantitySampleForSaving]) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("add")
      let hkSamples = try samples.map(createQuantitySampleForWorkout)
      try await self.builder.addSamples(hkSamples)
    }
  }

  func addMetadata(metadata: AnyMap) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("addMetadata")
      try await self.builder.addMetadata(anyMapToDictionary(metadata))
    }
  }

  func addWorkoutEvents(workoutEvents: [WorkoutEvent]) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("addWorkoutEvents")
      let hkEvents = try workoutEvents.map(createWorkoutEvent)
      try await self.builder.addWorkoutEvents(hkEvents)
    }
  }

  func addWorkoutActivity(workoutActivity: WorkoutActivityForSaving) -> Promise<String> {
    return enqueue {
      try self.ensureBuilding("addWorkoutActivity")
      guard #available(iOS 16.0, *) else {
        throw runtimeErrorWithPrefix("addWorkoutActivity requires iOS 16.0 or later")
      }
      if let endDate = workoutActivity.endDate, workoutActivity.startDate > endDate {
        throw runtimeErrorWithPrefix("endDate must not be less than startDate")
      }

      let activity = HKWorkoutActivity(
        workoutConfiguration: parseWorkoutConfiguration(workoutActivity.workoutConfiguration),
        start: workoutActivity.startDate,
        end: workoutActivity.endDate,
        metadata: anyMapToDictionaryOptional(workoutActivity.metadata)
      )
      try await self.builder.addWorkoutActivity(activity)
      return activity.uuid.uuidString
    }
  }

  func updateActivityEndDate(uuid: String, endDate: Date) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("updateActivityEndDate")
      guard #available(iOS 16.0, *) else {
        throw runtimeErrorWithPrefix("updateActivityEndDate requires iOS 16.0 or later")
      }
      try await self.builder.updateActivity(uuid: try self.parseBuilderActivityUUID(uuid), end: endDate)
    }
  }

  func updateActivityMetadata(uuid: String, metadata: AnyMap) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("updateActivityMetadata")
      guard #available(iOS 16.0, *) else {
        throw runtimeErrorWithPrefix("updateActivityMetadata requires iOS 16.0 or later")
      }
      try await self.builder.updateActivity(
        uuid: try self.parseBuilderActivityUUID(uuid),
        adding: anyMapToDictionary(metadata)
      )
    }
  }

  func endCollection(endDate: Date) -> Promise<Void> {
    return enqueue {
      try self.ensureBuilding("endCollection")
      try await self.builder.endCollection(at: endDate)
    }
  }

  func finishWorkout() -> Promise<(any HybridWorkoutProxySpec)?> {
    return enqueue {
      try self.beginFinishing()
      let workout: HKWorkout?
      do {
        workout = try await self.builder.finishWorkout()
      } catch {
        self.endFinishing(.building)
        throw error
      }
      self.endFinishing(.finished)
      guard let workout else {
        return nil
      }
      return WorkoutProxy(workout: workout)
    }
  }

  func discardWorkout() {
    stateLock.lock()
    let alreadyFinished = state == .finished
    if !alreadyFinished {
      state = .discarded
    }
    stateLock.unlock()
    if !alreadyFinished {
      builder.discardWorkout()
    }
  }
}
