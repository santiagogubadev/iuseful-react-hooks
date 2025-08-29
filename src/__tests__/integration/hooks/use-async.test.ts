import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useAsync } from '@/hooks'
import { act, renderHook } from '@testing-library/react'

describe('useAsync', async () => {
  assertHook(useAsync)

  it('should return the correct initial state', async () => {
    const { result } = renderHook(() => useAsync(async () => {}))
    expect(result.current).toEqual({ value: null, error: null, loading: true })
  })

  it('should return the correct state after the async operation', async () => {
    const cbMock = vi.fn().mockResolvedValue(42)
    const { result } = renderHook(() => useAsync(cbMock))
    await act(async () => {})
    expect(cbMock).toHaveBeenCalledTimes(1)
    expect(result.current).toEqual({ value: 42, error: null, loading: false })
  })
})
