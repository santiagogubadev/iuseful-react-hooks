import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useGeolocation } from '@/hooks'
import { renderHook } from '@testing-library/react'

// Mock isClient to be false for SSR testing
vi.mock('@/utils/helpers/is-client', () => ({
  isClient: false,
}))

describe('useGeolocation SSR', () => {
  assertHook(useGeolocation)

  it('should handle SSR case when isClient is false', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBe(null)
  })
})
