import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useIsOnline } from '@/hooks'
import { renderHook } from '@testing-library/react'

// Mock isClient to be false for SSR testing
vi.mock('@/utils/helpers/is-client', () => ({
  isClient: false,
}))

describe('useIsOnline SSR', () => {
  assertHook(useIsOnline)

  it('should return true by default during SSR', () => {
    const { result } = renderHook(() => useIsOnline())

    expect(result.current).toBe(true)
  })
})
