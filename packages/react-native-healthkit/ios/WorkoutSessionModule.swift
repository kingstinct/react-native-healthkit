//
//  Workout.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-13.
//

import WorkoutKit
import NitroModules
import HealthKit


@available(iOS 17.0, *)
class WorkoutSessionDelegate: NSObject, HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: any Error) {
        
    }
    
    
    
    // var options: WorkoutSessionMirroringStartHandlerOptions? = nil
    /*var onStateChange: ((_ event: WorkoutStateChangeEvent) -> Void)?
    var onError: ((_ event: WorkoutErrorEvent) -> Void)?
    var onDataReceived: ((_ event: WorkoutDataReceivedEvent) -> Void)?
    var onEventReceived: ((_ event: WorkoutEventReceivedEvent) -> Void)?*/
    // var options: WorkoutSessionMirroringStartHandlerOptions? = nil
    

    /*func workoutSession(
    _ workoutSession: HKWorkoutSession,
    didChangeTo toState: HKWorkoutSessionState,
    from fromState: HKWorkoutSessionState,
    date: Date
  ) {
    Task { @MainActor [weak self] in
      guard let self = self else { return }
        
        _listeners.onStateChange(
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

        self._listeners.onError(
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
            
            self._listeners.onDataReceived(
                WorkoutDataReceivedEvent(data: serializedData)
            )
        }
      }
    }
  }

  
    func workoutSession(_ workoutSession: HKWorkoutSession, didGenerate event: HKWorkoutEvent) {
        
        self._listeners.onEventReceived(
            WorkoutEventReceivedEvent(
                type: WorkoutEventType(rawValue: Int32(event.type.rawValue))!,
            )
        )
  }*/
}

class WorkoutSessionModule:  HybridWorkoutSessionModuleSpec {
    // var options: WorkoutSessionMirroringStartHandlerOptions? = nil
    func workoutSessionMirroringStartHandler(options: WorkoutSessionMirroringStartHandlerOptions) throws -> Bool {
        // self.options = options
        if #available(iOS 17.0, *) {
            store.workoutSessionMirroringStartHandler = { [weak self] mirroringSession in
                let workoutSessionDelegate = WorkoutSessionDelegate()
                // workoutSessionDelegate.options = options
                /*workoutSessionDelegate.onStateChange = { event in
                    // if let options = self?.options {
                        // options.onStateChange(event)
                    // }
                    
                    
                    options.onStateChange(event)
                }*/
                mirroringSession.delegate = workoutSessionDelegate
                self?._workoutSession = mirroringSession
                self?._workoutSessionDelegate = workoutSessionDelegate
            }
        }
        
        return true
    }
    
    /*func workoutSessionMirroringStartHandler(onError: @escaping (WorkoutErrorEvent) -> Void, onStateChange: @escaping (WorkoutStateChangeEvent) -> Void, onDataReceived: @escaping (WorkoutDataReceivedEvent) -> Void, onEventReceived: @escaping (WorkoutEventReceivedEvent) -> Void) throws -> Bool {
        if #available(iOS 17.0, *) {
            /*store.workoutSessionMirroringStartHandler = { [weak self] mirroringSession in
                let workoutSessionDelegate = WorkoutSessionDelegate()
                // workoutSessionDelegate.onStateChange = onStateChange
                mirroringSession.delegate = workoutSessionDelegate
                self?._workoutSession = mirroringSession
                self?._workoutSessionDelegate = workoutSessionDelegate
            }*/
        }
        
        return true
    }*/
    
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
    
    /*func workoutSessionMirroringStartHandler(options: StartWatchAppWithWorkoutConfigurationOptions) throws -> Bool {
        if #available(iOS 17.0, *) {
            store.workoutSessionMirroringStartHandler = { [weak self] mirroringSession in
                let workoutSessionDelegate = WorkoutSessionDelegate()
                workoutSessionDelegate.onStateChange = options.onStateChange
                mirroringSession.delegate = workoutSessionDelegate
                self?._workoutSession = mirroringSession
                self?._workoutSessionDelegate = workoutSessionDelegate
            }
        }
        
        return true
    }*/

}
