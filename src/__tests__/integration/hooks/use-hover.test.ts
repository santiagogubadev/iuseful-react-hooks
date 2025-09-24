import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useHover } from '@/hooks/use-hover'
import { fireEvent, renderHook, act } from '@testing-library/react'
import { useRef } from 'react'

describe('useHover', () => {
  assertHook(useHover)

  const onHover = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('without external ref', () => {
    it('should return fromRef and isHovered when no externalRef is provided', () => {
      const { result } = renderHook(() => useHover())

      expect(result.current).toEqual({
        fromRef: expect.any(Object),
        isHovered: false,
      })
      expect(result.current.fromRef.current).toBeNull()
    })

    it('should set isHovered to true when mouse enters the element', async () => {
      const { result, rerender } = renderHook(() => useHover())

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      rerender()

      await act(async () => {
        fireEvent.mouseEnter(div)
      })

      expect(result.current.isHovered).toBe(true)

      document.body.removeChild(div)
    })

    it('should set isHovered to false when mouse leaves the element', async () => {
      const { result, rerender } = renderHook(() => useHover())

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      rerender()

      await act(async () => {
        fireEvent.mouseEnter(div)
      })

      await act(async () => {
        fireEvent.mouseOut(div)
      })

      expect(result.current.isHovered).toBe(false)

      document.body.removeChild(div)
    })

    it('should call onHover callback when mouse enters the element', async () => {
      const { result, rerender } = renderHook(() => useHover({ onHover }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      rerender()

      await act(async () => {
        fireEvent.mouseEnter(div)
      })

      expect(onHover).toHaveBeenCalledTimes(1)
      expect(onHover).toHaveBeenCalledWith(expect.any(MouseEvent))

      document.body.removeChild(div)
    })

    it('should not trigger hover events when element is null', () => {
      const { result } = renderHook(() => useHover({ onHover }))

      act(() => {
        fireEvent.mouseEnter(document.body)
      })

      expect(result.current.isHovered).toBe(false)
      expect(onHover).not.toHaveBeenCalled()
    })
  })

  describe('with external ref', () => {
    it('should return only isHovered when externalRef is provided', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      const { result } = renderHook(() => useHover({ onHover, externalRef: refResult.current }))

      expect(result.current).toEqual({
        isHovered: false,
      })
      expect(result.current).not.toHaveProperty('fromRef')

      document.body.removeChild(div)
    })

    it('should set isHovered to true when mouse enters the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      const { result } = renderHook(() => useHover({ onHover, externalRef: refResult.current }))

      act(() => {
        fireEvent.mouseEnter(div)
      })

      expect(result.current.isHovered).toBe(true)

      document.body.removeChild(div)
    })

    it('should set isHovered to false when mouse leaves the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      const { result } = renderHook(() => useHover({ onHover, externalRef: refResult.current }))

      act(() => {
        fireEvent.mouseEnter(div)
      })
      expect(result.current.isHovered).toBe(true)

      act(() => {
        fireEvent.mouseOut(div)
      })
      expect(result.current.isHovered).toBe(false)

      document.body.removeChild(div)
    })

    it('should call onHover callback when mouse enters the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      renderHook(() => useHover({ onHover, externalRef: refResult.current }))

      act(() => {
        fireEvent.mouseEnter(div)
      })

      expect(onHover).toHaveBeenCalledTimes(1)
      expect(onHover).toHaveBeenCalledWith(expect.any(MouseEvent))

      document.body.removeChild(div)
    })

    it('should work with both onHover callback and externalRef', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      const { result } = renderHook(() => useHover({ onHover, externalRef: refResult.current }))

      act(() => {
        fireEvent.mouseEnter(div)
      })

      expect(result.current.isHovered).toBe(true)
      expect(onHover).toHaveBeenCalledTimes(1)
      expect(onHover).toHaveBeenCalledWith(expect.any(MouseEvent))

      act(() => {
        fireEvent.mouseOut(div)
      })

      expect(result.current.isHovered).toBe(false)

      document.body.removeChild(div)
    })
  })

  describe('hover state transitions', () => {
    it('should maintain hover state correctly during re-renders', async () => {
      let hookProps = { onHover }
      const { result, rerender } = renderHook((props) => useHover(props), {
        initialProps: hookProps,
      })

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      rerender()

      await act(async () => {
        fireEvent.mouseEnter(div)
      })

      expect(result.current.isHovered).toBe(true)

      hookProps = { onHover: vi.fn() }
      rerender(hookProps)

      expect(result.current.isHovered).toBe(true)

      await act(async () => {
        fireEvent.mouseOut(div)
      })
      expect(result.current.isHovered).toBe(false)

      document.body.removeChild(div)
    })
  })

  describe('edge cases', () => {
    it('should handle when externalRef.current is null', () => {
      renderHook(() => useHover({ onHover, externalRef: { current: null } }))

      act(() => {
        fireEvent.mouseEnter(document.body)
      })

      expect(onHover).not.toHaveBeenCalled()
    })

    it('should handle cleanup when component unmounts', async () => {
      const { result, unmount } = renderHook(() => useHover({ onHover }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      unmount()

      await act(async () => {
        fireEvent.mouseOut(div)
        fireEvent.mouseEnter(div)
      })

      expect(onHover).toHaveBeenCalledTimes(0)

      document.body.removeChild(div)
    })
  })
})
