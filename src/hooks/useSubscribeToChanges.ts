import { useEffect, useRef } from 'react'

import subscribeToChanges from '../utils/subscribeToChanges'

import type { HKSampleTypeIdentifier } from '..'

function useSubscribeToChanges<TIdentifier extends HKSampleTypeIdentifier>(
  identifier: TIdentifier,
  onChange: () => void,
): void {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    let cancelSubscription: (() => Promise<boolean>) | undefined

    const init = async () => {
      cancelSubscription = await subscribeToChanges(identifier, onChangeRef.current)
    }
    void init()

    return () => {
      void cancelSubscription?.()
    }
  }, [identifier])
}

export default useSubscribeToChanges
