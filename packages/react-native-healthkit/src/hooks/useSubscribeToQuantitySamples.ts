import { useEffect, useRef } from 'react'
import type { QuantityTypeIdentifier } from '../types'
import type { OnQuantitySamplesCallbackArgs } from '../types/Subscriptions'
import { subscribeToQuantitySamples } from '../utils/subscribeToQuantitySamples'

export function useSubscribeToQuantitySamples<
  TIdentifier extends QuantityTypeIdentifier,
>(
  identifier: TIdentifier,
  onChange: (args: OnQuantitySamplesCallbackArgs) => void,
): void {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const subscription = subscribeToQuantitySamples(identifier, (args) => {
      onChangeRef.current(args)
    })

    return () => {
      subscription.remove()
    }
  }, [identifier])
}

export default useSubscribeToQuantitySamples
