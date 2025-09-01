import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useStateWithValidation } from '@/hooks'
import { act, renderHook } from '@testing-library/react'

describe('useStateWithValidation', () => {
  assertHook(useStateWithValidation)

  it('should return the initial value', () => {
    const { result } = renderHook(() => useStateWithValidation(vi.fn(), 0))
    expect(result.current[0]).toBe(0)
  })

  it('should validate based on the provided validation function', async () => {
    const validationCbMock = vi.fn((v) => v > 0)
    const { result } = renderHook(() => useStateWithValidation(validationCbMock, 0 as number))
    const [, setValue] = result.current

    await act(async () => await setValue(5))
    expect(result.current[0]).toBe(5)
    expect(result.current[2]).toBe(true)
    expect(validationCbMock).toBeCalledWith(5)

    await act(async () => await setValue(-1))
    expect(result.current[0]).toBe(-1)
    expect(result.current[2]).toBe(false)
    expect(validationCbMock).toBeCalledWith(-1)

    expect(validationCbMock).toBeCalledTimes(2)
  })
})
