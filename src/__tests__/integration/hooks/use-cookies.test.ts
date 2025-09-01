import { mockCookieStore } from '@/__tests__/__mocks__/cookie-store'
import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useCookie, useCookiesChangeListener, useGetAllCookies } from '@/hooks'
import { useAsync } from '@/hooks/use-async'
import { useEventListener } from '@/hooks/use-event-listener'
import { renderHook, act, waitFor } from '@testing-library/react'

vi.stubGlobal('cookieStore', mockCookieStore)

vi.mock('@/hooks/use-async', () => ({
  useAsync: vi.fn(),
}))

vi.mock('@/hooks/use-event-listener', () => ({
  useEventListener: vi.fn(),
}))

const mockUseAsync = vi.mocked(useAsync)
const mockUseEventListener = vi.mocked(useEventListener)

describe('Cookie Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('useCookie', () => {
    assertHook(useCookie)

    let mockSetValue: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockSetValue = vi.fn()
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: mockSetValue,
        loading: false,
        error: null,
        refresh: vi.fn(),
      })
    })

    it('should initialize with null cookie', () => {
      const { result } = renderHook(() => useCookie('test-cookie'))

      expect(result.current[0]).toBeNull()
      expect(result.current[1]).toMatchObject({
        updateCookie: expect.any(Function),
        deleteCookie: expect.any(Function),
        loadingCookie: false,
        errorLoadingCookie: null,
        loadingCookieAction: false,
        errorOnCookieAction: null,
      })
    })

    it('should return cookie value from useAsync', () => {
      const mockCookie = { name: 'test-cookie', value: 'test-value' }
      mockUseAsync.mockReturnValue({
        value: mockCookie,
        setValue: mockSetValue,
        loading: false,
        error: null,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useCookie('test-cookie'))

      expect(result.current[0]).toEqual(mockCookie)
    })

    it('should pass loading state from useAsync', () => {
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: mockSetValue,
        loading: true,
        error: null,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useCookie('test-cookie'))

      expect(result.current[1].loadingCookie).toBe(true)
    })

    it('should pass error state from useAsync', () => {
      const mockError = new DOMException('Cookie error')
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: mockSetValue,
        loading: false,
        error: mockError,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useCookie('test-cookie'))

      expect(result.current[1].errorLoadingCookie).toBe(mockError)
    })

    it('should update cookie successfully', async () => {
      mockCookieStore.set.mockResolvedValue(undefined)

      const { result } = renderHook(() => useCookie('test-cookie'))

      act(() => {
        result.current[1].updateCookie({
          value: 'new-value',
          path: '/',
        })
      })

      expect(result.current[1].loadingCookieAction).toBe(true)

      await waitFor(() => {
        expect(mockCookieStore.set).toHaveBeenCalledWith({
          name: 'test-cookie',
          value: 'new-value',
          path: '/',
        })
      })

      await waitFor(() => {
        expect(result.current[1].loadingCookieAction).toBe(false)
      })

      expect(mockSetValue).toHaveBeenCalledWith({
        name: 'test-cookie',
        value: 'new-value',
      })
    })

    it('should handle update cookie error', async () => {
      const setError = new DOMException('Failed to set cookie')
      mockCookieStore.set.mockRejectedValue(setError)

      const { result } = renderHook(() => useCookie('test-cookie'))

      act(() => {
        result.current[1].updateCookie({
          value: 'new-value',
        })
      })

      await waitFor(() => {
        expect(result.current[1].errorOnCookieAction).toBe(setError)
      })

      await waitFor(() => {
        expect(result.current[1].loadingCookieAction).toBe(false)
      })
    })

    it('should delete cookie successfully', async () => {
      mockCookieStore.delete.mockResolvedValue(undefined)

      const { result } = renderHook(() => useCookie('test-cookie'))

      act(() => {
        result.current[1].deleteCookie()
      })

      expect(result.current[1].loadingCookieAction).toBe(true)

      await waitFor(() => {
        expect(mockCookieStore.delete).toHaveBeenCalledWith('test-cookie')
      })

      await waitFor(() => {
        expect(result.current[1].loadingCookieAction).toBe(false)
      })

      expect(mockSetValue).toHaveBeenCalledWith(null)
    })

    it('should handle delete cookie error', async () => {
      const deleteError = new DOMException('Failed to delete cookie')
      mockCookieStore.delete.mockRejectedValue(deleteError)

      const { result } = renderHook(() => useCookie('test-cookie'))

      act(() => {
        result.current[1].deleteCookie()
      })

      await waitFor(() => {
        expect(result.current[1].errorOnCookieAction).toBe(deleteError)
      })

      await waitFor(() => {
        expect(result.current[1].loadingCookieAction).toBe(false)
      })
    })

    it('should call useAsync with correct parameters', () => {
      const defaultValue = { value: 'default', path: '/' }
      renderHook(() => useCookie('test-cookie', defaultValue))

      expect(mockUseAsync).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('useCookiesChangeListener', () => {
    assertHook(useCookiesChangeListener)

    let mockCallback: ReturnType<typeof vi.fn>
    let mockEventListenerCallback: (e: CookieChangeEvent) => void

    beforeEach(() => {
      mockCallback = vi.fn()
      mockUseEventListener.mockImplementation((event, callback) => {
        mockEventListenerCallback = callback as (e: CookieChangeEvent) => void
      })
    })

    it('should initialize with empty changes', () => {
      const { result } = renderHook(() => useCookiesChangeListener(mockCallback))

      expect(result.current).toEqual({
        changed: [],
        deleted: [],
      })
    })

    it('should setup event listener for cookie changes', () => {
      renderHook(() => useCookiesChangeListener(mockCallback))

      expect(mockUseEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
        mockCookieStore,
      )
    })

    it('should update changes and call callback when cookie changes', () => {
      const { result } = renderHook(() => useCookiesChangeListener(mockCallback))

      const changeEvent = {
        changed: [{ name: 'test', value: 'new-value' }],
        deleted: [{ name: 'deleted', value: 'old-value' }],
      } as unknown as CookieChangeEvent

      act(() => {
        mockEventListenerCallback(changeEvent)
      })

      expect(result.current).toEqual({
        changed: [{ name: 'test', value: 'new-value' }],
        deleted: [{ name: 'deleted', value: 'old-value' }],
      })

      expect(mockCallback).toHaveBeenCalledWith(changeEvent)
    })

    it('should update callback ref when callback changes', () => {
      const initialCallback = vi.fn()
      const newCallback = vi.fn()

      const { rerender } = renderHook(({ callback }) => useCookiesChangeListener(callback), {
        initialProps: { callback: initialCallback },
      })

      const changeEvent = {
        changed: [],
        deleted: [],
      } as unknown as CookieChangeEvent

      act(() => {
        mockEventListenerCallback(changeEvent)
      })

      expect(initialCallback).toHaveBeenCalledWith(changeEvent)

      rerender({ callback: newCallback })

      act(() => {
        mockEventListenerCallback(changeEvent)
      })

      expect(newCallback).toHaveBeenCalledWith(changeEvent)
    })
  })

  describe('useGetAllCookies', () => {
    assertHook(useGetAllCookies)

    beforeEach(() => {
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: vi.fn(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      })
    })

    it('should return cookies from useAsync', () => {
      const mockCookies = [
        { name: 'cookie1', value: 'value1' },
        { name: 'cookie2', value: 'value2' },
      ]

      mockUseAsync.mockReturnValue({
        value: mockCookies,
        setValue: vi.fn(),
        loading: false,
        error: null,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useGetAllCookies())

      expect(result.current).toEqual({
        cookies: mockCookies,
        loading: false,
        error: null,
      })
    })

    it('should pass loading state from useAsync', () => {
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: vi.fn(),
        loading: true,
        error: null,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useGetAllCookies())

      expect(result.current.loading).toBe(true)
    })

    it('should pass error state from useAsync', () => {
      const mockError = new DOMException('Failed to get cookies')
      mockUseAsync.mockReturnValue({
        value: null,
        setValue: vi.fn(),
        loading: false,
        error: mockError,
        refresh: vi.fn(),
      })

      const { result } = renderHook(() => useGetAllCookies())

      expect(result.current.error).toBe(mockError)
    })

    it('should call useAsync with correct async function for no params', () => {
      renderHook(() => useGetAllCookies())

      expect(mockUseAsync).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should call useAsync with correct async function for string params', () => {
      renderHook(() => useGetAllCookies('test-cookie'))

      expect(mockUseAsync).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should call useAsync with correct async function for object params', () => {
      const options: CookieStoreGetOptions = { name: 'test-cookie' }
      renderHook(() => useGetAllCookies(options))

      expect(mockUseAsync).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
