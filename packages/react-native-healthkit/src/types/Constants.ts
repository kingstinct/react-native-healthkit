/**
 * Represents a workout type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkouttypeidentifier Apple Docs HKWorkoutTypeIdentifier}
 */
export const WorkoutTypeIdentifier = 'HKWorkoutTypeIdentifier' as const

/**
 * Represents a workout route type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKWorkoutRouteTypeIdentifier Apple Docs WorkoutRouteTypeIdentifier}
 */
export const WorkoutRouteTypeIdentifier =
  'HKWorkoutRouteTypeIdentifier' as const

/**
 * Represents a state of mind type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmindtype Apple Docs HKStateOfMindType}
 */
export const StateOfMindTypeIdentifier = 'HKStateOfMindTypeIdentifier' as const

/**
 * Represents a series sample containing heartbeat data.
 * @see {@link https://developer.apple.com/documentation/healthkit/HKDataTypeIdentifierHeartbeatSeries Apple Docs DataTypeIdentifierHeartbeatSeries}
 */
export const HeartbeatSeriesTypeIdentifier =
  'HKDataTypeIdentifierHeartbeatSeries' as const

/**
 * A type that identifies samples containing electrocardiogram data.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkelectrocardiogramtype Apple Docs HKElectrocardiogramType}
 */
export const ElectrocardiogramTypeIdentifier =
  'HKElectrocardiogramType' as const
