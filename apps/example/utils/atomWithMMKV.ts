import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

function getItem(key: string): string | null {
  const value = storage.getString(key)
  return value ? value : null
}

function setItem(key: string, value: string): void {
  storage.set(key, value)
}

function removeItem(key: string): void {
  storage.delete(key)
}

function subscribe(
  key: string,
  callback: (value: string | null) => void,
): () => void {
  const listener = (changedKey: string) => {
    if (changedKey === key) {
      callback(getItem(key))
    }
  }

  const { remove } = storage.addOnValueChangedListener(listener)

  return () => {
    remove()
  }
}

export const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      subscribe,
    })),
    { getOnInit: true },
  )
