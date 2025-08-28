import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useLocalStorage, useSessionStorage } from '@/hooks/use-storage'
import { act, renderHook } from '@testing-library/react'

describe('useLocalStorage', async () => {
  assertHook(useLocalStorage)

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const localStorageGetItemSpy = vi.spyOn(localStorage, 'getItem')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('test-key')
    expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toBe('default')
  })

  it('should remove value when turned to undefined', async () => {
    const localStorageRemoveItemSpy = vi.spyOn(localStorage, 'removeItem')
    const { result } = renderHook(() => useLocalStorage<string | undefined>('test-key', undefined))
    await act(async () => await result.current[2]())
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('test-key')
  })

  it('should set value correctly', async () => {
    const localStorageSetItemSpy = vi.spyOn(localStorage, 'setItem')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    await act(async () => await result.current[1]('new value'))
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('test-key', JSON.stringify('new value'))
    expect(result.current[0]).toBe('new value')
  })
})

describe('useSessionStorage', () => {
  assertHook(useSessionStorage)

  afterEach(() => {
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('should initialize with default value', () => {
    const sessionStorageGetItemSpy = vi.spyOn(sessionStorage, 'getItem')
    const { result } = renderHook(() => useSessionStorage('test-key', 'default'))
    expect(sessionStorageGetItemSpy).toHaveBeenCalledWith('test-key')
    expect(sessionStorageGetItemSpy).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toBe('default')
  })

  it('should remove value when turned to undefined', async () => {
    const sessionStorageRemoveItemSpy = vi.spyOn(sessionStorage, 'removeItem')
    const { result } = renderHook(() =>
      useSessionStorage<string | undefined>('test-key', undefined),
    )
    await act(async () => await result.current[2]())
    expect(sessionStorageRemoveItemSpy).toHaveBeenCalledWith('test-key')
  })

  it('should set value correctly', async () => {
    const sessionStorageSetItemSpy = vi.spyOn(sessionStorage, 'setItem')
    const { result } = renderHook(() => useSessionStorage('test-key', 'default'))
    await act(async () => await result.current[1]('new value'))
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('test-key', JSON.stringify('new value'))
    expect(result.current[0]).toBe('new value')
  })
})
