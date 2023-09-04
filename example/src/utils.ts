/* eslint-disable import/no-unresolved */
import { HKQuantityTypeIdentifier } from '@kingstinct/react-native-healthkit'

import type { HKQuantitySampleForSaving, CLLocationForSaving } from '@kingstinct/react-native-healthkit'

const distanceSamples = [
  {
    quantity: 1609.4,
    unit: 'm',
    quantityType: HKQuantityTypeIdentifier.distanceWalkingRunning,
  },
] as readonly HKQuantitySampleForSaving[]

const energySamples = [
  {
    quantity: 123,
    unit: 'kcal',
    quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
  },
] as readonly HKQuantitySampleForSaving[]

const hrSamples = [
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 180,
    startDate: new Date(1693238969173),
    endDate: new Date(1693238969173 + 5000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 120,
    startDate: new Date(1693238969173 + 5000),
    endDate: new Date(1693238969173 + 10000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 90,
    startDate: new Date(1693238969173 + 10000),
    endDate: new Date(1693238969173 + 15000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 60,
    startDate: new Date(1693238969173 + 15000),
    endDate: new Date(1693238969173 + 20000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 120,
    startDate: new Date(1693238969173 + 20000),
    endDate: new Date(1693238969173 + 25000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 110,
    startDate: new Date(1693238969173 + 25000),
    endDate: new Date(1693238969173 + 30000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 120,
    startDate: new Date(1693238969173 + 30000),
    endDate: new Date(1693238969173 + 35000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 110,
    startDate: new Date(1693238969173 + 35000),
    endDate: new Date(1693238969173 + 40000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 120,
    startDate: new Date(1693238969173 + 40000),
    endDate: new Date(1693238969173 + 45000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.heartRate,
    unit: 'count/min',
    quantity: 110,
    startDate: new Date(1693238969173 + 45000),
    endDate: new Date(1693238969173 + 50000),
  },
] as readonly HKQuantitySampleForSaving[]

const runningSpeedSamples = [
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2,
    startDate: new Date(1693238969173),
    endDate: new Date(1693238969173 + 5000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.4,
    startDate: new Date(1693238969173 + 5000),
    endDate: new Date(1693238969173 + 10000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 10000),
    endDate: new Date(1693238969173 + 15000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 15000),
    endDate: new Date(1693238969173 + 20000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 20000),
    endDate: new Date(1693238969173 + 25000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 25000),
    endDate: new Date(1693238969173 + 30000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 35000),
    endDate: new Date(1693238969173 + 40000),
  },
  {
    quantityType: HKQuantityTypeIdentifier.runningSpeed,
    unit: 'm/s',
    quantity: 2.2,
    startDate: new Date(1693238969173 + 40000),
    endDate: new Date(1693238969173 + 55000),
  },
] as readonly HKQuantitySampleForSaving[]

const locationSamples = [
  {
    timestamp: 1693238969173,
    latitude: 37.33092521,
    longitude: -122.03077056,
    speed: 1.1455277261275059,
    altitude: 12.7,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 2000,
    latitude: 37.330798,
    longitude: -122.03072881,
    speed: 1.285095821168931,
    altitude: 13.6,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 4000,
    latitude: 37.33074557,
    longitude: -122.0306985,
    speed: 1.402523088645488,
    altitude: 14.5,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 6000,
    latitude: 37.33069642,
    longitude: -122.03066881,
    speed: 1.5322020207350469,
    altitude: 13.7,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 8000,
    latitude: 37.33063636,
    longitude: -122.03063618,
    speed: 2.1356288346039416,
    altitude: 14,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 10000,
    latitude: 37.33058184,
    longitude: -122.03060705,
    speed: 2.1841806264885295,
    altitude: 12.6,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 12000,
    latitude: 37.33051217,
    longitude: -122.03054075,
    speed: 2.1502912379836863,
    altitude: 12.6,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 14000,
    latitude: 37.33047387,
    longitude: -122.03043177,
    speed: 2.1502912379836863,
    altitude: 12.6,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 16000,
    latitude: 37.3304468,
    longitude: -122.03030278,
    speed: 2.1753854497292195,
    altitude: 13.3,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 18000,
    latitude: 37.33043844,
    longitude: -122.03023338,
    speed: 2.1638740622473494,
    altitude: 13.5,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 20000,
    latitude: 37.33043145,
    longitude: -122.03009112,
    speed: 2.1693958013404178,
    altitude: 13.5,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 22000,
    latitude: 37.3304318,
    longitude: -122.03001785,
    speed: 2.7971076334601155,
    altitude: 13.3,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 24000,
    latitude: 37.3304353,
    longitude: -122.02993796,
    speed: 2.7288485957616135,
    altitude: 13.3,
    verticalAccuracy: 4.7,
    horizontalAccuracy: 3.4,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 26000,
    latitude: 37.33044444,
    longitude: -122.02977746,
    speed: 2.7288485957616135,
    altitude: 13.8,
    verticalAccuracy: 5.1,
    horizontalAccuracy: 2.8,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 28000,
    latitude: 37.33044907,
    longitude: -122.02969739,
    speed: 2.710493562684472,
    altitude: 13.7,
    verticalAccuracy: 5,
    horizontalAccuracy: 2.9,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 30000,
    latitude: 37.33045275,
    longitude: -122.02953296,
    speed: 2.7128010044790143,
    altitude: 14.1,
    verticalAccuracy: 4.8,
    horizontalAccuracy: 3.3,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 32000,
    latitude: 37.33045243,
    longitude: -122.02944956,
    speed: 2.7484091075606267,
    altitude: 13.6,
    verticalAccuracy: 4.8,
    horizontalAccuracy: 3.3,
    course: -1,
  },
  {
    timestamp: 1693238969173 + 34000,
    latitude: 37.33039592,
    longitude: -122.0293017,
    speed: 2.73806763140424,
    altitude: 13.3,
    verticalAccuracy: 4.8,
    horizontalAccuracy: 3.3,
    course: -1,
  },
] as readonly CLLocationForSaving[]
/**
 * Generate a unix timestamp from one minute ago
 * @returns number
 */
const getTimestampOneMinuteAgo = (): number => Date.now() - 60000

/**
 * Generates HR, distance, energy, speed and location samples to generate a sample Apple Health workout
 * @returns number
 */
export const generateWorkoutSamples = () => {
  const startTime = getTimestampOneMinuteAgo()

  // get HR samples and change startDate to be 5 seconds later on each sample
  const hr = hrSamples.map((sample, index) => ({
    ...sample,
    startDate: new Date(startTime + index * 5000),
    endDate: new Date(startTime + (index + 1) * 5000),
  }))

  const speed = runningSpeedSamples.map((sample, index) => ({
    ...sample,
    startDate: new Date(startTime + index * 5000),
    endDate: new Date(startTime + (index + 1) * 5000),
  }))

  const locations = locationSamples.map((sample, index) => ({
    ...sample,
    timestamp: startTime + index * 2000,
  }))

  return {
    startTime,
    samples: [
      ...distanceSamples,
      ...energySamples,
      ...hr,
      ...speed,
    ],
    locationSamples: locations,
  }
}
