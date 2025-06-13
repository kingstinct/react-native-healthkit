//
//  Workout.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-13.
//
#if canImport(WorkoutKit)
  import WorkoutKit
#endif
import NitroModules
import HealthKit

@available(iOS 17.0, *)
class WorkoutSessionDelegate: NSObject, HKWorkoutSessionDelegate {
    
    let _listeners: StartWatchAppWithWorkoutConfigurationOptions
    
    init(options: StartWatchAppWithWorkoutConfigurationOptions){
        _listeners = options
    }

  func workoutSession(
    _ workoutSession: HKWorkoutSession,
    didChangeTo toState: HKWorkoutSessionState,
    from fromState: HKWorkoutSessionState,
    date: Date
  ) {
    Task { @MainActor [weak self] in
      guard let self = self else { return }
        
        _listeners.onStateChange?(
            WorkoutStateChangeEvent(
                toState: WorkoutSessionState(rawValue: Int32(toState.rawValue))!,
                fromState: WorkoutSessionState(rawValue: Int32(fromState.rawValue))!,
                date: date
            )
        )
    }
  }

  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: any Error) {
    Task { @MainActor [weak self] in
      guard let self = self else { return }

        self._listeners.onError?(
            WorkoutErrorEvent(error: error.localizedDescription)
        )
    }
  }

  func workoutSession(
    _ workoutSession: HKWorkoutSession,
    didReceiveDataFromRemoteWorkoutSession data: [Data]
  ) {
    Task { [weak self] in
      guard let self = self else { return }

      do {
        let serializedData = data.compactMap { dataItem -> RemoteSessionSharableData? in
          guard let json = try? JSONSerialization.jsonObject(with: dataItem) as? [String: Any] else {
            return nil
          }
            if let type = json["type"] as? String,
               let payload = json["payload"] as? [String: Any] {
                
                return RemoteSessionSharableData(
                    type: type,
                    payload: serializeMetadata(payload)
                )
            }
            return nil
        }
         
        await MainActor.run { [weak self] in
          guard let self = self else { return }
            
            self._listeners.onDataReceived?(
                WorkoutDataReceivedEvent(data: serializedData)
            )
        }
      }
    }
  }

  
    func workoutSession(_ workoutSession: HKWorkoutSession, didGenerate event: HKWorkoutEvent) {
        
        self._listeners.onEventReceived?(
            WorkoutEventReceivedEvent(
                type: WorkoutEventType(rawValue: Int32(event.type.rawValue))!,
            )
        )
  }
}

class WorkoutSessionModule:  HybridWorkoutSessionModuleSpec  {
    // var workoutSession: HKWorkoutSession? = nil
    // var workoutSessionDelegate: WorkoutSessionDelegate? = nil
    
    func startWatchAppWithWorkoutConfiguration(workoutConfiguration: WorkoutConfiguration) throws -> Promise<Bool> {
        let configuration = parseWorkoutConfiguration(workoutConfiguration)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.startWatchApp(with: configuration) { success, error in
                  if let error {
                      continuation.resume(throwing: RuntimeError.error(withMessage: error.localizedDescription))
                  }

                  continuation.resume(returning: success)
                }
            }
        }
    }
    
    var _workoutSession: Any? = nil
    var _workoutSessionDelegate: Any? = nil
    
    func workoutSessionMirroringStartHandler(options: StartWatchAppWithWorkoutConfigurationOptions) throws -> Bool {
        if #available(iOS 17.0, *) {
            store.workoutSessionMirroringStartHandler = { [weak self] mirroringSession in
                let workoutSessionDelegate = WorkoutSessionDelegate(options: options)
                mirroringSession.delegate = workoutSessionDelegate
                self?._workoutSession = mirroringSession
                self?._workoutSessionDelegate = workoutSessionDelegate
            }
        }
        
        return true
    }

}
