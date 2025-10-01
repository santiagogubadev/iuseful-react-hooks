import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useIsOnline } from '@/hooks'
import { renderHook } from '@testing-library/react'

describe('useIsOnline', () => {
  assertHook(useIsOnline)

  it('should return true when online', () => {
    vi.stubGlobal('navigator', {
      onLine: true,
    })
    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(true)
  })

  it('should return false when offline', () => {
    vi.stubGlobal('navigator', {
      onLine: false,
    })
    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(false)
  })

  it('should update state when navigator.onLine changes', async () => {
    vi.stubGlobal('navigator', {
      onLine: true,
    })

    const { result, rerender } = renderHook(() => useIsOnline())
    expect(result.current).toBe(true)

    // Simulate status change
    vi.stubGlobal('navigator', {
      onLine: false,
    })
    window.dispatchEvent(new Event('offline'))

    // Rerender to trigger the hook update
    rerender()

    expect(result.current).toBe(false)
  })
})
