import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useTimeout } from '@/hooks'
import { act, renderHook } from '@testing-library/react'

describe('useTimeout', () => {
  assertHook(useTimeout)

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  it('should clear timeout on unmount by default', () => {
    const { result, unmount } = renderHook(() => useTimeout(vi.fn(), 1000))
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')

    expect(result.current[0]).toBe(false)
    unmount()
    expect(clearSpy).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalledTimes(1)
  })

  it('should sets isCleared to true when clear() is called while mounted', () => {
    const { result } = renderHook(() => useTimeout(vi.fn(), 5000, { clearOnUnmount: false }))

    expect(result.current[0]).toBe(false)
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should call onTimeout when the timeout is reached', async () => {
    const onTimeout = vi.fn()
    renderHook(() => useTimeout(onTimeout, 1000))

    vi.runAllTimers()

    expect(onTimeout).toHaveBeenCalled()
    expect(onTimeout).toHaveBeenCalledTimes(1)
  })

  it('should call onTimeout when returns a promise', async () => {
    const onTimeout = vi.fn().mockResolvedValue(undefined)
    renderHook(() => useTimeout(onTimeout, 1000))

    vi.runAllTimers()

    expect(onTimeout).toHaveBeenCalled()
    expect(onTimeout).toHaveBeenCalledTimes(1)
  })

  it('should not call clear when clearOnUnmount is false', () => {
    const { unmount } = renderHook(() => useTimeout(vi.fn(), 1000, { clearOnUnmount: false }))
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')

    unmount()
    expect(clearSpy).not.toHaveBeenCalled()
  })
})
