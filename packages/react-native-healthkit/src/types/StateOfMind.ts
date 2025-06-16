import type { AnyMap } from 'react-native-nitro-modules'
import type { Device } from './Device'
import type { SourceRevision } from './Source'

export enum StateOfMindValenceClassification {
  veryUnpleasant = 1,
  unpleasant = 2,
  slightlyUnpleasant = 3,
  neutral = 4,
  slightlyPleasant = 5,
  pleasant = 6,
  veryPleasant = 7,
}

export interface StateOfMindSample {
  readonly uuid: string
  readonly device?: Device
  readonly startDate: Date
  readonly endDate: Date
  readonly metadata?: AnyMap
  readonly sourceRevision?: SourceRevision
  // State of mind sample properties
  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/4337998-valence Apple Docs }
   * Value between -1 and 1
   */
  readonly valence: number
  readonly kind: StateOfMindKind
  readonly valenceClassification: StateOfMindValenceClassification
  readonly associations: readonly StateOfMindAssociation[]
  readonly labels: readonly StateOfMindLabel[]
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/label Apple Docs}
 */
export enum StateOfMindLabel {
  amazed = 1,
  amused = 2,
  angry = 3,
  anxious = 4,
  ashamed = 5,
  brave = 6,
  calm = 7,
  content = 8,
  disappointed = 9,
  discouraged = 10,
  disgusted = 11,
  embarrassed = 12,
  excited = 13,
  frustrated = 14,
  grateful = 15,
  guilty = 16,
  happy = 17,
  hopeless = 18,
  irritated = 19,
  jealous = 20,
  joyful = 21,
  lonely = 22,
  passionate = 23,
  peaceful = 24,
  proud = 25,
  relieved = 26,
  sad = 27,
  scared = 28,
  stressed = 29,
  surprised = 30,
  worried = 31,

  annoyed = 32,
  confident = 33,
  drained = 34,
  hopeful = 35,
  indifferent = 36,
  overwhelmed = 37,
  satisfied = 38,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/kind Apple Docs}
 */
export enum StateOfMindKind {
  dailyMood = 2,
  momentaryEmotion = 1,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/association Apple Docs}
 * @since iOS 17.0+
 */
export enum StateOfMindAssociation {
  community = 1,
  currentEvents = 2,
  dating = 3,
  education = 4,
  family = 5,
  fitness = 6,
  friends = 7,
  health = 8,
  hobbies = 9,
  identity = 10,
  money = 11,
  partner = 12,
  selfCare = 13,
  spirituality = 14,
  tasks = 15,
  travel = 16,
  work = 17,
  weather = 18,
}
