import { useEffect, useRef } from 'react'
import type { ClinicalTypeIdentifier } from '../types/ClinicalTypeIdentifier'
import type { OnChangeCallbackArgs } from '../types/Subscriptions'
import { subscribeToClinicalRecordChanges } from '../utils/subscribeToClinicalRecordChanges'

export function useSubscribeToClinicalRecordChanges(
  clinicalType: ClinicalTypeIdentifier,
  onChange: (args: OnChangeCallbackArgs) => void,
): void {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const subscription = subscribeToClinicalRecordChanges(
      clinicalType,
      (args) => {
        onChangeRef.current(args)
      },
    )

    return () => {
      subscription.remove()
    }
  }, [clinicalType])
}

export default useSubscribeToClinicalRecordChanges
