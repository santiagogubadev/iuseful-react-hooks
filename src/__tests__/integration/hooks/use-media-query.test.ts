import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useMediaQuery } from '@/hooks'
import { renderHook } from '@testing-library/react'
import { useEventListener } from '@/hooks/use-event-listener'

vi.mock('@/hooks/use-event-listener', { spy: true })

describe('useMediaQuery', () => {
  assertHook(useMediaQuery)

  it('should call matchMedia with the correct query', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia')
    const q = '(max-width: 600px)'
    renderHook(() => useMediaQuery(q))
    expect(matchMediaSpy).toHaveBeenCalledWith(q)
  })

  it('should add listener to media query changes', () => {
    renderHook(() => useMediaQuery('(max-width: 600px)'))
    expect(useEventListener).toHaveBeenCalled()
    expect(useEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
      expect.any(Object),
    )
  })
})
