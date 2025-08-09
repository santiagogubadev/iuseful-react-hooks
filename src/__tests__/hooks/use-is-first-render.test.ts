import { useIsFirstRender } from '@/hooks'
import { assertHook } from '../__tests-utils__/assertions'
import { renderHook } from '@testing-library/react'

describe('useIsFirstRender', () => {
  assertHook(useIsFirstRender)

  it('should return true on first render', () => {
    const { result } = renderHook(() => useIsFirstRender())
    expect(result.current).toBe(true)
  })

  it('should return false on subsequent renders', () => {
    const { result, rerender } = renderHook(() => useIsFirstRender())

    rerender()
    expect(result.current).toBe(false)
  })
})
