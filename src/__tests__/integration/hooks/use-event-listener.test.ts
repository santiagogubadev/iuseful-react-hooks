import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useEventListener } from '@/hooks/use-event-listener'
import { renderHook } from '@testing-library/react'

describe('useEventListener', () => {
  assertHook(useEventListener)

  it('should add event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => useEventListener('keydown', () => {}))
    expect(addEventListenerSpy).toHaveBeenCalled()
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
  })

  it('should add event listener to provided target', () => {
    const target = document.createElement('div')
    const addEventListenerSpy = vi.spyOn(target, 'addEventListener')
    renderHook(() => useEventListener('click', () => {}, target))
    expect(addEventListenerSpy).toHaveBeenCalled()
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined)
  })

  it('should handle EventListener object with handleEvent method', () => {
    const handleEvent = vi.fn()
    const eventListener = { handleEvent }
    const target = document.createElement('div')

    renderHook(() => useEventListener('click', eventListener, target))

    // Trigger the event
    target.click()

    expect(handleEvent).toHaveBeenCalled()
  })
})
