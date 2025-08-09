import { IntersectionObserverMock } from '@/__tests__/__mocks__/intersection-observer'
import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useNearScreen } from '@/hooks/use-near-screen'
import { act, renderHook } from '@testing-library/react'
import { useRef } from 'react'

describe('useNearScreen', () => {
  beforeEach(() => {
    IntersectionObserverMock.instances = []
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  assertHook(useNearScreen)

  it('should return isNearScreen and fromRef', () => {
    const { result } = renderHook(() => useNearScreen())
    expect(result.current).toEqual({ isNearScreen: false, fromRef: expect.any(Object) })
  })

  it('should return isNearScreen and fromRef when externalRef is provided', () => {
    const { result: externalRefResult } = renderHook(() => useRef<HTMLDivElement>(null))
    const { result } = renderHook(() => useNearScreen({ externalRef: externalRefResult.current }))
    expect(result.current).toEqual({ isNearScreen: false, fromRef: externalRefResult.current })
  })

  it('should turn isNearScreen to true when the element is in view', async () => {
    const { result } = renderHook(() => useNearScreen())
    const [observer] = IntersectionObserverMock.instances

    await act(async () => observer.observe())
    expect(result.current.isNearScreen).toBe(true)

    // because once = true
    expect(observer.disconnect).toBeCalledTimes(1)
  })
})
