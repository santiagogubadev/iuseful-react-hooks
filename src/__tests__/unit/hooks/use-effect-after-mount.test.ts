import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useEffectAfterMount, useIsFirstRender } from '@/hooks'
import { renderHook } from '@testing-library/react'
import { Mock } from 'vitest'

vi.mock('@/hooks/use-is-first-render', () => ({
  useIsFirstRender: vi.fn()
}))

describe('useEffectAfterMount', () => {
  assertHook(useEffectAfterMount)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not call effect on first render', () => {
    (useIsFirstRender as Mock).mockReturnValue(true)
    const effectMock = vi.fn()
    renderHook(() => useEffectAfterMount(effectMock, []))

    expect(effectMock).not.toHaveBeenCalled()
  })

  it('should call effect after first render', () => {
    (useIsFirstRender as Mock).mockReturnValue(true)
    const effectMock = vi.fn()
    const { rerender } = renderHook(() => useEffectAfterMount(effectMock))

    ;(useIsFirstRender as Mock).mockReturnValue(false)
    rerender()

    expect(effectMock).toHaveBeenCalled()
  })
})
