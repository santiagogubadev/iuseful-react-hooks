import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useDebouncedEffect } from '@/hooks/use-debounced-effect'
import { renderHook } from '@testing-library/react'

describe('useDebouncedEffect', () => {
  assertHook(useDebouncedEffect)

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  it('should debounce at first render if immediate is true', () => {
    const cb = vi.fn()
    renderHook(() => useDebouncedEffect(cb))

    expect(cb).toHaveBeenCalled()
    expect(cb).toBeCalledTimes(1)
  })

  it('should not debounce at first render if immediate is false', () => {
    const cb = vi.fn()
    renderHook(() => useDebouncedEffect(cb, 150, [], { immediate: false }))

    expect(cb).not.toHaveBeenCalled()
  })

  it('should call the callback after the specified delay', () => {
    const cb = vi.fn()
    let deps = [0]
    const { rerender } = renderHook(() => useDebouncedEffect(cb, 150, deps, { immediate: false }))

    expect(cb).not.toHaveBeenCalled()

    deps = [1]
    rerender()

    vi.runAllTimers()

    expect(cb).toHaveBeenCalled()
  })

  it('should call two times the callback if dependencies change and immediate true', () => {
    const cb = vi.fn()
    let deps = [0]
    const { rerender } = renderHook(() => useDebouncedEffect(cb, 150, deps))

    expect(cb).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(1)

    deps = [1]
    rerender()

    // to check that the callback only called after the delay
    expect(cb).toHaveBeenCalledTimes(1)

    vi.runAllTimers()

    expect(cb).toHaveBeenCalledTimes(2)
  })
})
