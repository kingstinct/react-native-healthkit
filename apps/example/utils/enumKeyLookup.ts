export function enumKeyLookup<
  T extends object,
  TKey extends keyof T,
  TValue extends symbol | number | string,
>(e: T): Record<TValue, TKey> {
  const keys = Object.keys(e)
  const retVal = keys

  return retVal.reduce(
    (acc, key) => {
      const newKeey = e[key as keyof T] as TValue
      acc[newKeey] = key as TKey
      return acc
    },
    {} as Record<TValue, TKey>,
  )
}
