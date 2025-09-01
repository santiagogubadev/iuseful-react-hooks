import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useStateWithHistory } from '@/hooks/use-state-with-history'
import { act, renderHook } from '@testing-library/react'

describe('useStateWithHistory', async () => {
  assertHook(useStateWithHistory)

  it('should initialize with the correct values', () => {
    const { result } = renderHook(() => useStateWithHistory())
    const [, , { history, pointer }] = result.current
    expect(result.current[0]).toBeUndefined()
    expect(history).toEqual([undefined])
    expect(pointer).toBe(0)

    const { result: result2 } = renderHook(() => useStateWithHistory(1))
    const [, , { history: history2, pointer: pointer2 }] = result2.current
    expect(result2.current[0]).toBe(1)
    expect(history2).toEqual([1])
    expect(pointer2).toBe(0)
  })

  it('should update state and maintain history when set value called', async () => {
    const { result } = renderHook(() => useStateWithHistory(1))
    const [, setValue] = result.current

    await act(async () => await setValue(2))
    const [value, , { history, pointer }] = result.current

    expect(value).toBe(2)
    expect(history).toEqual([1, 2])
    expect(pointer).toBe(1)
  })

  it('should reset state and history when add new value in a different index than the last one', async () => {
    const { result } = renderHook(() => useStateWithHistory(1))
    const [, setValue, { go }] = result.current

    await act(async () => await setValue(2))

    await act(async () => await go(0))
    const [value, , { history, pointer }] = result.current
    expect(value).toBe(1)
    expect(history).toEqual([1, 2])
    expect(pointer).toBe(0)

    await act(async () => await setValue(3))
    const [value2, , { history: history2, pointer: pointer2 }] = result.current
    expect(value2).toBe(3)
    expect(history2).toEqual([1, 3])
    expect(pointer2).toBe(1)
  })

  it('should go back or forward when called', async () => {
    const { result } = renderHook(() => useStateWithHistory(1))
    const [, setValue, { forward, back }] = result.current

    await act(async () => await setValue(2))
    await act(async () => await setValue(3))

    await act(async () => await back())
    const [value, , { history, pointer }] = result.current
    expect(value).toBe(2)
    expect(history).toEqual([1, 2, 3])
    expect(pointer).toBe(1)

    await act(async () => await forward())
    const [value2, , { history: history2, pointer: pointer2 }] = result.current
    expect(value2).toBe(3)
    expect(history2).toEqual([1, 2, 3])
    expect(pointer2).toBe(2)
  })
})
