import { useEffect, useRef } from 'react'
import type {
  CategoryTypeIdentifier,
  OnCategorySamplesCallback,
} from '../types'
import { subscribeToCategorySamples } from '../utils/subscribeToCategorySamples'

export function useSubscribeToCategorySamples<
  TIdentifier extends CategoryTypeIdentifier,
>(
  identifier: TIdentifier,
  onChange: (args: OnCategorySamplesCallback<TIdentifier>) => void,
): void {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const subscription = subscribeToCategorySamples(identifier, (args) => {
      onChangeRef.current(args)
    })

    return () => {
      subscription.remove()
    }
  }, [identifier])
}

export default useSubscribeToCategorySamples
