import { useCallback, useEffect, useState } from 'react';
import Native, {
  EventEmitter,
  HKCategorySampleRaw,
  HKCategoryTypeIdentifier,
  HKCategoryValueForIdentifier,
  HKCharacteristicTypeIdentifier,
  HKCorrelationRaw,
  HKCorrelationTypeIdentifier,
  HKQuantitySampleRaw,
  HKQuantityTypeIdentifier,
  HKSampleTypeIdentifier,
  HKUnit,
  HKUnitSI,
  HKUnitSIPrefix,
  HKWorkoutRaw,
  MetadataMapperForCategoryIdentifier,
} from './native-types';
import type {
  GenericQueryOptions,
  GetMostRecentCategorySampleFn,
  GetMostRecentQuantitySampleFn,
  GetMostRecentWorkoutFn,
  GetPreferredUnitFn,
  GetPreferredUnitsFn,
  GetWorkoutRoutesFn,
  HKCategorySample,
  HKCorrelation,
  HKQuantitySample,
  HKWorkout,
  QueryCategorySamplesFn,
  QueryCorrelationSamplesFn,
  QueryQuantitySamplesFn,
  QueryStatisticsForQuantityFn,
  QueryWorkoutsFn,
  ReactNativeHealthkit,
  SaveCorrelationSampleFn,
  SaveQuantitySampleFn,
  SaveWorkoutSampleFn,
  SubscribeToChangesFn,
} from './types';

const getPreferredUnit: GetPreferredUnitFn = async (type) => {
  const [unit] = await getPreferredUnits([type]);
  return unit;
};

const ensureUnit = async <TUnit extends HKUnit>(
  type: HKQuantityTypeIdentifier,
  providedUnit?: TUnit
) => {
  if (providedUnit) {
    return providedUnit;
  }
  const unit = await Native.getPreferredUnits([type]);
  return unit[type] as TUnit;
};

function deserializeSample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit
>(
  sample: HKQuantitySampleRaw<TIdentifier, TUnit>
): HKQuantitySample<TIdentifier, TUnit> {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  };
}

function deserializeWorkout<TEnergy extends HKUnit, TDistance extends HKUnit>(
  sample: HKWorkoutRaw<TEnergy, TDistance>
): HKWorkout<TEnergy, TDistance> {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  };
}

const deserializCategorySample = <T extends HKCategoryTypeIdentifier>(
  sample: HKCategorySampleRaw<T>
): HKCategorySample<T> => {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  };
};

const serializeDate = (date?: Date | null): string => {
  return date ? date.toISOString() : new Date(0).toISOString();
};

const prepareOptions = (options: GenericQueryOptions) => {
  const limit =
    !options.limit || options.limit === Infinity ? 0 : options.limit;
  const ascending = options.ascending ?? limit === 0;
  const from = serializeDate(options.from);
  const to = serializeDate(options.to);
  return { limit, ascending, from, to };
};

const queryQuantitySamples: QueryQuantitySamplesFn = async (
  identifier,
  options
) => {
  const unit = await ensureUnit(identifier, options.unit);
  const opts = prepareOptions(options);

  const quantitySamples = await Native.queryQuantitySamples(
    identifier,
    unit,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending
  );

  return quantitySamples.map(deserializeSample);
};

const subscribeToChanges: SubscribeToChangesFn = async (
  identifier,
  callback
) => {
  const subscription = EventEmitter.addListener(
    'onChange',
    ({ typeIdentifier }) => {
      if (typeIdentifier === identifier) {
        callback();
      }
    }
  );

  const queryId = await Native.subscribeToObserverQuery(identifier).catch(
    (error) => {
      subscription.remove();
      return Promise.reject(error);
    }
  );

  return () => {
    subscription.remove();
    return Native.unsubscribeQuery(queryId);
  };
};

const getMostRecentQuantitySample: GetMostRecentQuantitySampleFn = async (
  identifier,
  unit
) => {
  const samples = await queryQuantitySamples(identifier, {
    limit: 1,
    unit: unit,
  });
  return samples[0];
};

function useMostRecentWorkout<
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(options?: { energyUnit?: TEnergy; distanceUnit?: TDistance }) {
  const [workout, setWorkout] = useState<HKWorkout<TEnergy, TDistance> | null>(
    null
  );
  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined;

    const init = async () => {
      const { energyUnit, distanceUnit } = await getPreferredUnitsTyped(
        options
      );

      cancelSubscription = await subscribeToChanges(
        'HKWorkoutTypeIdentifier',
        () => {
          getMostRecentWorkout({ energyUnit, distanceUnit }).then(setWorkout);
        }
      );
    };
    init();
    return () => {
      cancelSubscription && cancelSubscription();
    };
  }, [options]);
  return workout;
}

const getMostRecentCategorySample: GetMostRecentCategorySampleFn = async (
  identifier
) => {
  const samples = await queryCategorySamples(identifier, {
    limit: 1,
    ascending: false,
  });

  return samples[0];
};

function useMostRecentCategorySample<
  TCategory extends HKCategoryTypeIdentifier
>(identifier: TCategory) {
  const [category, setCategory] = useState<HKCategorySample<TCategory> | null>(
    null
  );
  const updater = useCallback(() => {
    getMostRecentCategorySample(identifier).then(setCategory);
  }, [identifier]);

  useSubscribeToChanges(identifier, updater);

  return category;
}

function useSubscribeToChanges<TIdentifier extends HKSampleTypeIdentifier>(
  identifier: TIdentifier,
  onChange: () => void
): void {
  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined;

    const init = async () => {
      cancelSubscription = await subscribeToChanges(identifier, onChange);
    };
    init();

    return () => {
      cancelSubscription && cancelSubscription();
    };
  }, [identifier, onChange]);
}

function useMostRecentQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
>(identifier: TIdentifier, unit?: TUnit) {
  const [lastSample, setLastSample] = useState<HKQuantitySample<
    TIdentifier,
    TUnit
  > | null>(null);

  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined;

    const init = async () => {
      const actualUnit = await ensureUnit(identifier, unit);

      cancelSubscription = await subscribeToChanges(identifier, () => {
        getMostRecentQuantitySample(identifier, actualUnit).then((value) => {
          setLastSample(value);
        });
      });
    };
    init();

    return () => {
      cancelSubscription && cancelSubscription();
    };
  }, [identifier, unit]);

  return lastSample;
}

const saveQuantitySample: SaveQuantitySampleFn = (
  identifier,
  unit,
  value,
  options
) => {
  const start = options?.start || options?.end || new Date();
  const end = options?.end || options?.start || new Date();
  const metadata = options?.metadata || {};

  return Native.saveQuantitySample(
    identifier,
    unit,
    value,
    start.toISOString(),
    end.toISOString(),
    metadata
  );
};

const queryStatisticsForQuantity: QueryStatisticsForQuantityFn = async (
  identifier,
  options,
  from,
  to,
  unit
) => {
  const actualUnit = await ensureUnit(identifier, unit);
  const toDate = to || new Date();
  const { mostRecentQuantityDateInterval, ...rawResponse } =
    await Native.queryStatisticsForQuantity(
      identifier,
      actualUnit,
      from.toISOString(),
      toDate.toISOString(),
      options
    );

  const response = {
    ...rawResponse,
    ...(mostRecentQuantityDateInterval
      ? {
          mostRecentQuantityDateInterval: {
            from: new Date(mostRecentQuantityDateInterval.from),
            to: new Date(mostRecentQuantityDateInterval.to),
          },
        }
      : {}),
  };

  return response;
};

const requestAuthorization = (
  read: (HKCharacteristicTypeIdentifier | HKSampleTypeIdentifier)[],
  write: HKSampleTypeIdentifier[] = []
): Promise<boolean> => {
  const readPermissions = read.reduce((obj, cur) => {
    return { ...obj, [cur]: true };
  }, {});

  const writePermissions = write.reduce((obj, cur) => {
    return { ...obj, [cur]: true };
  }, {});

  return Native.requestAuthorization(writePermissions, readPermissions);
};

const getDateOfBirth = async () => {
  const dateOfBirth = await Native.getDateOfBirth();
  return new Date(dateOfBirth);
};

const getRequestStatusForAuthorization = (
  read: (HKCharacteristicTypeIdentifier | HKSampleTypeIdentifier)[],
  write: HKSampleTypeIdentifier[] = []
) => {
  const readPermissions = read.reduce((obj, cur) => {
    return { ...obj, [cur]: true };
  }, {});

  const writePermissions = write.reduce((obj, cur) => {
    return { ...obj, [cur]: true };
  }, {});

  return Native.getRequestStatusForAuthorization(
    writePermissions,
    readPermissions
  );
};

const queryCategorySamples: QueryCategorySamplesFn = async (
  identifier,
  options
) => {
  const opts = prepareOptions(options);
  const results = await Native.queryCategorySamples(
    identifier,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending
  );

  return results.map(deserializCategorySample);
};

async function getPreferredUnitsTyped<
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(options?: { energyUnit?: TEnergy; distanceUnit?: TDistance }) {
  let energyUnit = options?.energyUnit;
  let distanceUnit = options?.distanceUnit;
  if (!energyUnit || !distanceUnit) {
    const units = await Native.getPreferredUnits([
      HKQuantityTypeIdentifier.distanceWalkingRunning,
      HKQuantityTypeIdentifier.activeEnergyBurned,
    ]);
    if (!energyUnit) {
      energyUnit = units[HKQuantityTypeIdentifier.distanceWalkingRunning] as
        | TEnergy
        | undefined;
    }
    if (!distanceUnit) {
      distanceUnit = units[HKQuantityTypeIdentifier.activeEnergyBurned] as
        | TDistance
        | undefined;
    }
  }
  if (!energyUnit) {
    energyUnit = HKUnit.Kilocalories as TEnergy;
  }
  if (!distanceUnit) {
    distanceUnit = HKUnit.Meters as TDistance;
  }
  return { energyUnit, distanceUnit };
}

const queryWorkouts: QueryWorkoutsFn = async (options) => {
  const { energyUnit, distanceUnit } = await getPreferredUnitsTyped(options);
  const opts = prepareOptions(options);

  const workouts = await Native.queryWorkoutSamples(
    energyUnit,
    distanceUnit,
    opts.from,
    opts.to,
    opts.limit,
    opts.ascending
  );

  return workouts.map(deserializeWorkout);
};

const getMostRecentWorkout: GetMostRecentWorkoutFn = async (options) => {
  const workouts = await queryWorkouts({
    limit: 1,
    ascending: false,
    energyUnit: options?.energyUnit,
    distanceUnit: options?.distanceUnit,
  });

  return workouts[0];
};

function saveCategorySample<T extends HKCategoryTypeIdentifier>(
  identifier: T,
  value: HKCategoryValueForIdentifier<T>,
  options?: {
    start?: Date;
    end?: Date;
    metadata?: MetadataMapperForCategoryIdentifier<T>;
  }
) {
  const start = options?.start || options?.end || new Date();
  const end = options?.end || options?.start || new Date();
  const metadata = options?.metadata || {};

  return Native.saveCategorySample(
    identifier,
    value,
    start.toISOString(),
    end.toISOString(),
    metadata || {}
  );
}

const getPreferredUnits: GetPreferredUnitsFn = async (identifiers) => {
  const units = await Native.getPreferredUnits(identifiers);
  return identifiers.map((i) => units[i]);
};

const buildUnitWithPrefix = (prefix: HKUnitSIPrefix, unit: HKUnitSI) => {
  return `${prefix}${unit}` as HKUnit;
};

function deserializeCorrelation<
  TIdentifier extends HKCorrelationTypeIdentifier
>(s: HKCorrelationRaw<TIdentifier>): HKCorrelation<TIdentifier> {
  return {
    ...s,
    objects: s.objects.map((o) => {
      // @ts-ignore
      if (o.quantity !== undefined) {
        return deserializeSample(o as HKQuantitySampleRaw);
      }

      return deserializCategorySample(o as HKCategorySampleRaw);
    }),
    endDate: new Date(s.endDate),
    startDate: new Date(s.startDate),
  };
}

function ensureMetadata<TMetadata>(metadata?: TMetadata) {
  return metadata || ({} as TMetadata);
}

const queryCorrelationSamples: QueryCorrelationSamplesFn = async (
  typeIdentifier,
  options
) => {
  const opts = prepareOptions(options);
  const correlations = await Native.queryCorrelationSamples(
    typeIdentifier,
    opts.from,
    opts.to
  );

  return correlations.map(deserializeCorrelation);
};

const saveCorrelationSample: SaveCorrelationSampleFn = async (
  typeIdentifier,
  samples,
  options
) => {
  const start = (options?.start || new Date()).toISOString();
  const end = (options?.end || new Date()).toISOString();

  return Native.saveCorrelationSample(
    typeIdentifier,
    samples,
    start,
    end,
    ensureMetadata(options?.metadata)
  );
};

const saveWorkoutSample: SaveWorkoutSampleFn = (
  typeIdentifier,
  quantities,
  _start,
  options
) => {
  const start = _start.toISOString();
  const end = (options?.end || new Date()).toISOString();

  return Native.saveWorkoutSample(
    typeIdentifier,
    quantities,
    start,
    end,
    ensureMetadata(options?.metadata)
  );
};

const getWorkoutRoutes: GetWorkoutRoutesFn = (workoutUUID: string) => {
  return Native.getWorkoutRoutes(workoutUUID);
};

const Healthkit: ReactNativeHealthkit = {
  authorizationStatusFor: Native.authorizationStatusFor,

  isHealthDataAvailable: Native.isHealthDataAvailable,

  buildUnitWithPrefix,

  disableAllBackgroundDelivery: Native.disableAllBackgroundDelivery,
  disableBackgroundDelivery: Native.disableBackgroundDelivery,
  enableBackgroundDelivery: Native.enableBackgroundDelivery,

  // simple convenience getters
  getBiologicalSex: Native.getBiologicalSex,
  getFitzpatrickSkinType: Native.getFitzpatrickSkinType,
  getWheelchairUse: Native.getWheelchairUse,
  getBloodType: Native.getBloodType,
  getDateOfBirth,

  getMostRecentQuantitySample,
  getMostRecentCategorySample,
  getMostRecentWorkout,

  getPreferredUnit,
  getPreferredUnits,
  getRequestStatusForAuthorization,

  getWorkoutRoutes,

  // query methods
  queryCategorySamples,
  queryCorrelationSamples,
  queryQuantitySamples,
  queryStatisticsForQuantity,
  queryWorkouts,

  requestAuthorization,

  // save methods
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,

  // subscriptions
  subscribeToChanges,

  // hooks
  useMostRecentCategorySample,

  useMostRecentQuantitySample,
  useMostRecentWorkout,

  useSubscribeToChanges,
};

export * from './native-types';
export * from './types';

export default Healthkit;
