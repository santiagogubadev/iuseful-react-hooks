import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useWindowSize, useEventListener } from '@/hooks'
import { renderHook } from '@testing-library/react'

vi.mock('@/hooks/use-event-listener.ts', { spy: true })

describe('useWindowSize', () => {
  assertHook(useWindowSize)

  it('should return the current window size', () => {
    const { result } = renderHook(() => useWindowSize())
    expect(result.current).toEqual({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  })

  it('should update the window size on resize', () => {
    renderHook(() => useWindowSize())
    expect(useEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
