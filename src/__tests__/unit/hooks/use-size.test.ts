import { ResizeObserverMock } from '@/__tests__/__mocks__/resize-observer'
import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useSize } from '@/hooks'
import { renderHook } from '@testing-library/react'
import { useRef } from 'react'

describe('useSize', () => {
  beforeEach(() => {
    ResizeObserverMock.instances = []
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  assertHook(useSize)

  it('should return an empty DOMRect initially', () => {
    const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
    const { result } = renderHook(() => useSize(refResult.current))

    expect(result.current.size).toEqual({})
  })

  it('should create a ResizeObserver when ref has a current element', async () => {
    const { result: refResult } = renderHook(() =>
      useRef<HTMLDivElement>(document.createElement('div')),
    )

    renderHook(() => useSize(refResult.current))

    expect(ResizeObserverMock.instances).toHaveLength(1)
    const [observer] = ResizeObserverMock.instances
    expect(observer.observe).toHaveBeenCalledWith(refResult.current.current)
  })

  it('should update size when ResizeObserver triggers', async () => {
    const { result: refResult } = renderHook(() =>
      useRef<HTMLDivElement>(document.createElement('div')),
    )

    const { result } = renderHook(() => useSize(refResult.current))

    expect(result.current.size).toEqual({
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: expect.any(Function),
    })
  })

  it('should disconnect observer on cleanup', () => {
    const { result: refResult } = renderHook(() =>
      useRef<HTMLDivElement>(document.createElement('div')),
    )

    const { unmount } = renderHook(() => useSize(refResult.current))
    const [observer] = ResizeObserverMock.instances

    expect(observer.disconnect).not.toHaveBeenCalled()

    unmount()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should not create observer when ref.current is null', () => {
    const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
    renderHook(() => useSize(refResult.current))

    expect(ResizeObserverMock.instances).toHaveLength(0)
  })

  it('should recreate observer when ref changes', async () => {
    const { result: refResult } = renderHook(() =>
      useRef<HTMLDivElement>(document.createElement('div')),
    )
    const { rerender } = renderHook(({ ref }) => useSize(ref.current), {
      initialProps: { ref: refResult },
    })
    expect(ResizeObserverMock.instances).toHaveLength(1)

    // new ref
    const { result: refResult2 } = renderHook(() =>
      useRef<HTMLDivElement>(document.createElement('div')),
    )
    rerender({ ref: refResult2 })

    expect(ResizeObserverMock.instances).toHaveLength(2)

    const [firstObserver] = ResizeObserverMock.instances
    expect(firstObserver.disconnect).toHaveBeenCalledTimes(1)
  })
})
