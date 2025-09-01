import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useLongPress } from '@/hooks'
import { useEventListener } from '@/hooks/use-event-listener'
import { useTimeout } from '@/hooks/use-timeout'
import { renderHook, act } from '@testing-library/react'
import { RefObject } from 'react'

vi.mock('@/hooks/use-event-listener', () => ({
  useEventListener: vi.fn(),
}))

vi.mock('@/hooks/use-timeout', () => ({
  useTimeout: vi.fn(),
}))

const mockUseEventListener = vi.mocked(useEventListener)
const mockUseTimeout = vi.mocked(useTimeout)

describe('useLongPress', () => {
  assertHook(useLongPress)

  let mockReset: ReturnType<typeof vi.fn>
  let mockClear: ReturnType<typeof vi.fn>
  let mockOnLongPress: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockReset = vi.fn()
    mockClear = vi.fn()
    mockOnLongPress = vi.fn()

    mockUseTimeout.mockReturnValue({
      reset: mockReset,
      clear: mockClear,
      isCleared: false,
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('without external ref', () => {
    it('should return a fromRef when no externalRef is provided', () => {
      const { result } = renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      expect(result.current).toHaveProperty('fromRef')
      expect(result.current.fromRef).toHaveProperty('current')
    })

    it('should call useTimeout with correct parameters', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress, delay: 500 }))

      expect(mockUseTimeout).toHaveBeenCalledWith(mockOnLongPress, 500)
    })

    it('should use default delay of 300ms when not provided', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      expect(mockUseTimeout).toHaveBeenCalledWith(mockOnLongPress, 300)
    })

    it('should set up all required event listeners', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      expect(mockUseEventListener).toHaveBeenCalledTimes(5)

      const eventTypes = mockUseEventListener.mock.calls.map((call) => call[0])
      expect(eventTypes).toContain('mousedown')
      expect(eventTypes).toContain('touchstart')
      expect(eventTypes).toContain('mouseup')
      expect(eventTypes).toContain('touchend')
      expect(eventTypes).toContain('mouseleave')
    })

    it('should use reset handler for press start events', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      const mousedownCall = mockUseEventListener.mock.calls.find((call) => call[0] === 'mousedown')
      const touchstartCall = mockUseEventListener.mock.calls.find(
        (call) => call[0] === 'touchstart',
      )

      expect(mousedownCall?.[1]).toBe(mockReset)
      expect(touchstartCall?.[1]).toBe(mockReset)
    })

    it('should use clear handler for press end events', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      const mouseupCall = mockUseEventListener.mock.calls.find((call) => call[0] === 'mouseup')
      const touchendCall = mockUseEventListener.mock.calls.find((call) => call[0] === 'touchend')
      const mouseleaveCall = mockUseEventListener.mock.calls.find(
        (call) => call[0] === 'mouseleave',
      )

      expect(mouseupCall?.[1]).toBe(mockClear)
      expect(touchendCall?.[1]).toBe(mockClear)
      expect(mouseleaveCall?.[1]).toBe(mockClear)
    })
  })

  describe('with external ref', () => {
    let mockElement: HTMLDivElement
    let externalRef: RefObject<HTMLDivElement>

    beforeEach(() => {
      mockElement = document.createElement('div')
      externalRef = { current: mockElement }
    })

    it('should return undefined when externalRef is provided', () => {
      const { result } = renderHook(() =>
        (useLongPress as any)({
          externalRef,
          onLongPress: mockOnLongPress,
        }),
      )

      expect(result.current).toBeUndefined()
    })

    it('should pass externalRef element to event listeners', () => {
      renderHook(() =>
        (useLongPress as any)({
          externalRef,
          onLongPress: mockOnLongPress,
        }),
      )

      mockUseEventListener.mock.calls.forEach((call) => {
        expect(call[2]).toBe(mockElement)
      })
    })

    it('should handle null externalRef current', () => {
      const nullRef = { current: null } as unknown as RefObject<HTMLDivElement>

      renderHook(() =>
        (useLongPress as any)({
          externalRef: nullRef,
          onLongPress: mockOnLongPress,
        }),
      )

      expect(mockUseEventListener).toHaveBeenCalledTimes(5)
    })
  })

  describe('event listener setup', () => {
    it('should call clear effect on mount', () => {
      renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      expect(mockClear).toHaveBeenCalledTimes(1)
    })

    it('should pass the correct element to event listeners without external ref', () => {
      const { result } = renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      mockUseEventListener.mock.calls.forEach((call) => {
        expect(call[2]).toBe(result.current.fromRef.current)
      })
    })

    it('should handle element updates when ref changes', () => {
      const { result, rerender } = renderHook(() => useLongPress({ onLongPress: mockOnLongPress }))

      const mockElement = document.createElement('div')
      act(() => {
        if (result.current && 'fromRef' in result.current) {
          ;(result.current.fromRef as any).current = mockElement
        }
      })

      rerender()

      expect(mockUseEventListener).toHaveBeenCalled()
    })
  })

  describe('different element types', () => {
    it('should work with button elements', () => {
      const buttonRef = { current: document.createElement('button') }

      renderHook(() =>
        (useLongPress as any)({
          externalRef: buttonRef,
          onLongPress: mockOnLongPress,
        }),
      )

      expect(mockUseEventListener).toHaveBeenCalledTimes(5)
      mockUseEventListener.mock.calls.forEach((call) => {
        expect(call[2]).toBe(buttonRef.current)
      })
    })

    it('should work with div elements', () => {
      const divRef = { current: document.createElement('div') }

      renderHook(() =>
        (useLongPress as any)({
          externalRef: divRef,
          onLongPress: mockOnLongPress,
        }),
      )

      expect(mockUseEventListener).toHaveBeenCalledTimes(5)
      mockUseEventListener.mock.calls.forEach((call) => {
        expect(call[2]).toBe(divRef.current)
      })
    })
  })

  describe('callback behavior', () => {
    it('should update timeout when onLongPress callback changes', () => {
      const initialCallback = vi.fn()
      const newCallback = vi.fn()

      const { rerender } = renderHook(({ callback }) => useLongPress({ onLongPress: callback }), {
        initialProps: { callback: initialCallback },
      })

      expect(mockUseTimeout).toHaveBeenCalledWith(initialCallback, 300)

      rerender({ callback: newCallback })

      expect(mockUseTimeout).toHaveBeenCalledWith(newCallback, 300)
    })

    it('should update timeout when delay changes', () => {
      const { rerender } = renderHook(
        ({ delay }) => useLongPress({ onLongPress: mockOnLongPress, delay }),
        { initialProps: { delay: 300 } },
      )

      expect(mockUseTimeout).toHaveBeenCalledWith(mockOnLongPress, 300)

      rerender({ delay: 500 })

      expect(mockUseTimeout).toHaveBeenCalledWith(mockOnLongPress, 500)
    })
  })
})
