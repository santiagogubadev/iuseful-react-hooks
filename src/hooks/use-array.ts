import { useCallback, useState } from 'react'

interface UseArrayReturn<T> {
  /**
   * The current array value.
   */
  array: T[]
  /**
   * Update the array value.
   * @param newArray The new array value.
   * @returns void
   */
  set: (newArray: T[]) => void
  /**
   * Add a new item to the end of the array.
   * @param item The item to add.
   * @returns void
   */
  push: (item: T) => void
  /**
   * Remove the last item from the array.
   * @returns void
   */
  pop: () => void
  /**
   * Remove an item of the provided index
   * @param index The index of the item to remove.
   * @returns void
   */
  remove: (index: number) => void
  /**
   * Clear the array.
   */
  clear: () => void
  /**
   * Update the array in the provided index
   * @param index The index of the item to update.
   * @param value The new value to set.
   * @returns void
   */
  update: (index: number, value: T) => void
  /**
   * Filter with the provided predicate
   * @param predicate The predicate function to filter the array.
   * @returns void
   */
  filter: (predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => void
  /**
   * Concat the provided array to the end of the current array.
   * @param array The array to concat.
   * @returns void
   */
  concat: (array: T[]) => void
  /**
   * Merge the provided arrays into the current array.
   * @param arrays The arrays to merge.
   * @returns void
   */
  merge: (...arrays: T[][]) => void
  /**
   * Shift the first item from the array.
   * @returns void
   */
  shift: () => void
  /**
   * Sort the array.
   * @param compareFn The function to determine the order of the elements.
   * @returns void
   */
  sort: (compareFn?: (a: T, b: T) => number) => void
}

/**
 * A custom hook that provides array manipulation methods.
 * @param initialValue The initial array value.
 * @returns An object containing the array and methods to manipulate it.
 */
export function useArray<T>(initialValue: T[]): UseArrayReturn<T> {
  const [array, setArray] = useState<T[]>(initialValue)

  const set: UseArrayReturn<T>['set'] = useCallback((newArray) => {
    setArray(newArray)
  }, [])

  const push: UseArrayReturn<T>['push'] = useCallback((item) => {
    setArray((prevArray) => [...prevArray, item])
  }, [])

  const pop: UseArrayReturn<T>['pop'] = useCallback(() => {
    setArray((prevArray) => prevArray.slice(0, -1))
  }, [])

  const remove: UseArrayReturn<T>['remove'] = useCallback((index) => {
    setArray((prevArray) => prevArray.filter((_, i) => i !== index))
  }, [])

  const clear: UseArrayReturn<T>['clear'] = useCallback(() => {
    setArray([])
  }, [])

  const update: UseArrayReturn<T>['update'] = useCallback((index, value) => {
    setArray((prevArray) => prevArray.with(index, value))
  }, [])

  const filter: UseArrayReturn<T>['filter'] = useCallback((...args) => {
    setArray((prevArray) => prevArray.filter(...args))
  }, [])

  const concat: UseArrayReturn<T>['concat'] = useCallback((array) => {
    setArray((prevArray) => [...prevArray, ...array])
  }, [])

  const merge: UseArrayReturn<T>['merge'] = useCallback((...arrays) => {
    setArray((prevArray) => [...prevArray, ...arrays.flat()])
  }, [])

  const shift: UseArrayReturn<T>['shift'] = useCallback(() => {
    setArray((prevArray) => prevArray.slice(1))
  }, [])

  const sort: UseArrayReturn<T>['sort'] = useCallback((compareFn) => {
    setArray((prevArray) => prevArray.toSorted(compareFn))
  }, [])

  return { array, set, push, pop, remove, clear, update, filter, concat, merge, shift, sort }
}
