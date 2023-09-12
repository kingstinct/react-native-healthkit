import Native from '../native-types';
async function saveWorkoutRoute(workoutUUID, locations) {
  return Native.saveWorkoutRoute(workoutUUID, locations.map(location => {
    const {
      timestamp,
      ...rest
    } = location;
    return {
      ...rest,
      ...(timestamp ? {
        timestamp: new Date(timestamp).toISOString()
      } : {
        timestamp: ''
      })
    };
  }));
}
export default saveWorkoutRoute;
//# sourceMappingURL=saveWorkoutRoute.js.map