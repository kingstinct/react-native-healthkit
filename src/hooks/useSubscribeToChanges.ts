import { useEffect } from 'react'

import subscribeToChanges from '../utils/subscribeToChanges'

import type { HKSampleTypeIdentifier } from '..'

function useSubscribeToChanges<TIdentifier extends HKSampleTypeIdentifier>(
  identifier: TIdentifier,
  onChange: () => void,
): void {
  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined

    const init = async () => {
      cancelSubscription = await subscribeToChanges(identifier, onChange)
    }
    void init()

    return () => {
      void cancelSubscription?.()
    }
  }, [identifier, onChange])
}

export default useSubscribeToChanges
