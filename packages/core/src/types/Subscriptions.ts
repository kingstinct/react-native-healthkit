export interface EmitterSubscription {
  /** Returns `false` if the subscription was already removed. */
  remove: () => boolean
}
