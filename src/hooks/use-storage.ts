import { DefaultValue } from '@/utils/types/react'
import { useCallback, useState, useEffect } from 'react'
import { isClient } from '@/utils/helpers/is-client'

type StorageValue<T> = T | undefined

type UseStorageReturn<T> = [
  /**
   * The current stored value.
   */
  value: StorageValue<T>,
  /**
   * A function to update the stored value.
   */
  setValue: (value: T | ((prev: StorageValue<T>) => T)) => void,
  /**
   * A function to remove the stored value.
   */
  remove: () => void,
]

/**
 * A custom hook that manages localStorage with React state synchronization.
 * @param key - The localStorage key to store the value under.
 * @param defaultValue - The default value to use if no stored value exists.
 * @returns A tuple containing the current value, setter function, and remove function.
 */
export function useLocalStorage<T = unknown>(
  key: string,
  defaultValue?: DefaultValue<T>,
): UseStorageReturn<T> {
  return useStorage(key, defaultValue, isClient ? window.localStorage : null)
}

/**
 * A custom hook that manages sessionStorage with React state synchronization.
 * @param key - The sessionStorage key to store the value under.
 * @param defaultValue - The default value to use if no stored value exists.
 * @returns A tuple containing the current value, setter function, and remove function.
 */
export function useSessionStorage<T = unknown>(
  key: string,
  defaultValue?: DefaultValue<T>,
): UseStorageReturn<T> {
  return useStorage(key, defaultValue, isClient ? window.sessionStorage : null)
}

/**
 * Internal hook that handles storage operations for both localStorage and sessionStorage.
 */
function useStorage<T>(
  key: string,
  defaultValue: DefaultValue<T> | undefined,
  storageObject: Storage | null,
): UseStorageReturn<T> {
  const [value, setValue] = useState<StorageValue<T>>(() => {
    if (!storageObject) {
      return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
    }

    const jsonValue = storageObject.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue) as T

    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
  })

  useEffect(() => {
    if (!storageObject) return

    if (value === undefined) return storageObject.removeItem(key)

    storageObject.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject])

  const remove = useCallback(() => {
    setValue(undefined)
  }, [])

  return [value, setValue, remove]
}
