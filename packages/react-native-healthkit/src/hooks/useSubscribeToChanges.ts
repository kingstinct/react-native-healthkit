import { useEffect, useRef } from 'react'
import type { SampleTypeIdentifier } from '../types/Shared'
import type { OnChangeCallbackArgs } from '../types/Subscriptions'
import { subscribeToChanges } from '../utils/subscribeToChanges'

export function useSubscribeToChanges<TIdentifier extends SampleTypeIdentifier>(
  identifier: TIdentifier,
  onChange: (args: OnChangeCallbackArgs) => void,
): void {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const subscription = subscribeToChanges(identifier, (args) => {
      onChangeRef.current(args)
    })

    return () => {
      subscription.remove()
    }
  }, [identifier])
}

export default useSubscribeToChanges
