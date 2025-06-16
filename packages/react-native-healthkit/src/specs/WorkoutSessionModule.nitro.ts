import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { WorkoutConfiguration } from '../types/WorkoutKit'
import type { WorkoutEventType } from '../types/Workouts'

export interface WorkoutSessionMirroringStartHandlerOptions {
  onError(errorMessage: string): void
  onStateChange(
    toState: WorkoutSessionState,
    fromState: WorkoutSessionState,
    date: Date,
  ): void
  onDataReceived(data: RemoteSessionSharableData[]): void
  onEventReceived(type: WorkoutEventType): void
}

export interface WorkoutSessionModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648358-startwatchapp Apple Docs }
   */
  startWatchAppWithWorkoutConfiguration(
    workoutConfiguration: WorkoutConfiguration,
  ): Promise<boolean>

  workoutSessionMirroringStartHandler(
    /*onError: (event: WorkoutErrorEvent) => void,
		onStateChange: (event: WorkoutStateChangeEvent) => void,
		onDataReceived: (event: WorkoutDataReceivedEvent) => void,
		onEventReceived: (event: WorkoutEventReceivedEvent) => void,*/
    options: WorkoutSessionMirroringStartHandlerOptions,
  ): boolean
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutsessionstate Apple Docs }
 */
export enum WorkoutSessionState {
  NotStarted = 1,
  Running = 2,
  Ended = 3,
  Paused = 4,
  Prepared = 5,
  Stopped = 6,
}

export interface WorkoutStateChangeEvent {
  readonly toState: WorkoutSessionState
  readonly fromState: WorkoutSessionState
  readonly date: Date
}

export interface WorkoutErrorEvent {
  readonly error: string
}

export interface RemoteSessionSharableData {
  readonly type: string
  readonly payload: AnyMap
}

export interface WorkoutDataReceivedEvent {
  readonly data: readonly RemoteSessionSharableData[]
}

export interface WorkoutEventReceivedEvent {
  readonly type: WorkoutEventType
}

/*type OnRemoteWorkoutStateChangeCallback = ;
type OnRemoteWorkoutErrorCallback = (event: WorkoutErrorEvent) => void;
type OnRemoteWorkoutDataCallback = (event: WorkoutDataReceivedEvent) => void;
type OnRemoteWorkoutEventReceivedCallback = (event: WorkoutEventReceivedEvent) => void;*/
