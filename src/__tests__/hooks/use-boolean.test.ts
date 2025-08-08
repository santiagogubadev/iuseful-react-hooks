import { useBoolean } from '@/hooks/use-boolean'
import { act, renderHook } from '@testing-library/react'
import { assertHook } from '../__tests-utils__/assertions'

describe('useBoolean', () => {
  assertHook(useBoolean)

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current.value).toBe(false)
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current.value).toBe(true)
  })

  it('should toggle value', async () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current.value).toBe(false)

    await act(async () => {
      result.current.toggle()
    })

    expect(result.current.value).toBe(true)

    await act(async () => {
      result.current.toggle()
    })

    expect(result.current.value).toBe(false)
  })

  it('should set value directly', async () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current.value).toBe(false)

    await act(async () => {
      result.current.set(true)
    })

    expect(result.current.value).toBe(true)

    await act(async () => {
      result.current.set(false)
    })

    expect(result.current.value).toBe(false)
  })
})
