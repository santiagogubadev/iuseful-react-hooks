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
})
