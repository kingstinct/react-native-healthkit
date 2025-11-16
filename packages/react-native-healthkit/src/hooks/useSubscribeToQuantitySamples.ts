import { useEffect, useRef } from 'react'
import type {
  OnQuantitySamplesCallback,
  QuantityTypeIdentifier,
} from '../types'
import { subscribeToQuantitySamples } from '../utils/subscribeToQuantitySamples'

export function useSubscribeToQuantitySamples<
  TIdentifier extends QuantityTypeIdentifier,
>(
  identifier: TIdentifier,
  onChange: (args: OnQuantitySamplesCallback) => void,
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
