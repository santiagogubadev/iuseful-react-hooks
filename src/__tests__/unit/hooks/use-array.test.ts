import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useArray } from '@/hooks'
import { act, renderHook } from '@testing-library/react'

describe('useArray', () => {
  assertHook(useArray)

  it('should return the initial array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    expect(result.current.array).toEqual([1, 2, 3])
    expect(result.current.array.length).toBe(3)
  })

  it('should add an item to the array when push', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.push(4))
    expect(result.current.array).toEqual([1, 2, 3, 4])
    expect(result.current.array.length).toBe(4)
  })

  it('should set to the provided array', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.set([4, 5, 6]))
    expect(result.current.array).toEqual([4, 5, 6])
    expect(result.current.array.length).toBe(3)
  })

  it('should remove an item from the array when pop', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.pop())
    expect(result.current.array).toEqual([1, 2])
    expect(result.current.array.length).toBe(2)
  })

  it('should remove an item from the array when shift', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.shift())
    expect(result.current.array).toEqual([2, 3])
    expect(result.current.array.length).toBe(2)
  })

  it('should remove the value in the provided index', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.remove(1))
    expect(result.current.array).toEqual([1, 3])
    expect(result.current.array.length).toBe(2)
  })

  it('should merge the provided arrays', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.merge([4, 5], [6, 7]))
    expect(result.current.array).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(result.current.array.length).toBe(7)
  })

  it('should concat the provided array', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.concat([4, 5, 6]))
    expect(result.current.array).toEqual([1, 2, 3, 4, 5, 6])
    expect(result.current.array.length).toBe(6)
  })

  it('should filter the array with the provided predicate', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]))
    await act(async () => result.current.filter((value) => value > 2))
    expect(result.current.array).toEqual([3, 4, 5])
    expect(result.current.array.length).toBe(3)
  })

  it('should update the array with the index and value', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.update(1, 4))
    expect(result.current.array).toEqual([1, 4, 3])
    expect(result.current.array.length).toBe(3)
  })

  it('should pop the last item from the array', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.pop())
    expect(result.current.array).toEqual([1, 2])
    expect(result.current.array.length).toBe(2)
  })

  it('should clear the array', async () => {
    const { result } = renderHook(() => useArray([1, 2, 3]))
    await act(async () => result.current.clear())
    expect(result.current.array).toEqual([])
    expect(result.current.array.length).toBe(0)
  })
})
