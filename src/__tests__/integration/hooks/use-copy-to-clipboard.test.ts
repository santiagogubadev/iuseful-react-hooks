import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useCopyToClipboard } from '@/hooks'
import { copyToClipboard } from '@/utils/helpers/navigator'
import { renderHook } from '@testing-library/react'
import { act } from 'react'

vi.mock('@/utils/helpers/navigator', { spy: true })

const copyToClipboardMock = vi.mocked(copyToClipboard)

describe('useCopyToClipboard', () => {
  assertHook(useCopyToClipboard)

  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    const [, state] = result.current

    expect(state).toEqual({
      value: null,
      success: null,
      error: null,
      isCopying: false,
    })
  })

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useCopyToClipboard())
    const [copy] = result.current

    await act(async () => {
      copy('Hello, world!')
    })

    expect(copyToClipboardMock).toHaveBeenCalledWith('Hello, world!')
  })
})
