import { useEffect, useState } from 'react'

import Native from '../native-types'

const useIsHealthDataAvailable = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const init = async () => {
      const res = await Native.isHealthDataAvailable()
      setIsAvailable(res)
    }
    void init()
  }, [])

  return isAvailable
}

export default useIsHealthDataAvailable
