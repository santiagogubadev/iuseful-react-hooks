import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useDebouncedValue } from '@/hooks'
import { act, renderHook } from '@testing-library/react'

describe('useDebouncedValue', () => {
  assertHook(useDebouncedValue)

  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return the initial value immediately', () => {
    const initialValue = 'test'
    const { result } = renderHook(() => useDebouncedValue(initialValue))
    expect(result.current).toBe(initialValue)
  })

  it('should update the debounced value after the specified delay', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), {
      initialProps: { value: 'test' },
    })

    rerender({ value: 'test2' })
    await act(async () => vi.runAllTimers())
    expect(result.current).toBe('test2')
  })

  it('should clear when unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderHook(() => useDebouncedValue('test'))
    unmount()
    expect(clearSpy).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalledTimes(1)
  })
  it('should not update to provided first value if new value is provided', async () => {
    const values = {
      first: 'test-1',
      second: 'test-2',
      third: 'test-3',
    }
    const delayInMs = 1000
    const { result, rerender } = renderHook(
      ({ value, delayInMs }) => useDebouncedValue(value, { delayInMs }),
      {
        initialProps: { value: values.first, delayInMs },
      },
    )

    rerender({ value: values.second, delayInMs })
    await act(async () => vi.advanceTimersByTime(delayInMs / 2))
    rerender({ value: values.third, delayInMs })
    await act(async () => vi.advanceTimersByTime(delayInMs - 1))

    expect(result.current).toBe(values.first)

    await act(async () => vi.advanceTimersByTime(1))
    expect(result.current).toBe(values.third)
  })
})
