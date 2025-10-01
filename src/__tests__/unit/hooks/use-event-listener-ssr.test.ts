import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useEventListener } from '@/hooks/use-event-listener'
import { renderHook } from '@testing-library/react'

// Mock isClient to be false for SSR testing
vi.mock('@/utils/helpers/is-client', () => ({
  isClient: false,
}))

describe('useEventListener SSR', () => {
  assertHook(useEventListener)

  it('should not add event listener when isClient is false', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => useEventListener('click', () => {}))
    expect(addEventListenerSpy).not.toHaveBeenCalled()
  })
})
