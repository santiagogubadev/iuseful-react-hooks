import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useDarkMode } from '@/hooks'
import { useLocalStorage } from '@/hooks/use-storage'
import { useMediaQuery } from '@/hooks/use-media-query'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/hooks/use-storage', () => ({
  useLocalStorage: vi.fn(),
}))

vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: vi.fn(),
}))

const mockUseLocalStorage = vi.mocked(useLocalStorage)
const mockUseMediaQuery = vi.mocked(useMediaQuery)

describe('useDarkMode', () => {
  const mockSetDarkMode = vi.fn()
  const mockRemoveDarkMode = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = ''
    vi.clearAllMocks()
  })

  assertHook(useDarkMode)

  describe('default behavior', () => {
    it('should use "dark" as default key', () => {
      mockUseLocalStorage.mockReturnValue([null, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode())

      expect(mockUseLocalStorage).toHaveBeenCalledWith('dark')
      expect(mockUseMediaQuery).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })

    it('should use custom key when provided', () => {
      mockUseLocalStorage.mockReturnValue([null, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode('custom-dark'))

      expect(mockUseLocalStorage).toHaveBeenCalledWith('custom-dark')
    })
  })

  describe('dark mode state logic', () => {
    it('should prioritize localStorage value over media query when localStorage has true', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current[0]).toBe(true)
    })

    it('should prioritize localStorage value over media query when localStorage has false', () => {
      mockUseLocalStorage.mockReturnValue([false, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(true)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current[0]).toBe(false)
    })

    it('should fallback to media query when localStorage is null', () => {
      mockUseLocalStorage.mockReturnValue([null, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(true)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current[0]).toBe(true)
    })

    it('should fallback to media query when localStorage is undefined', () => {
      mockUseLocalStorage.mockReturnValue([undefined, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current[0]).toBe(false)
    })
  })

  describe('body class management', () => {
    it('should add dark class to body when dark mode is enabled', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode())

      expect(document.body.classList.contains('dark')).toBe(true)
    })

    it('should not add dark class to body when dark mode is disabled', () => {
      mockUseLocalStorage.mockReturnValue([false, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode())

      expect(document.body.classList.contains('dark')).toBe(false)
    })

    it('should use custom class name when provided', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode('custom-theme'))

      expect(document.body.classList.contains('custom-theme')).toBe(true)
      expect(document.body.classList.contains('dark')).toBe(false)
    })

    it('should toggle class when dark mode state changes', () => {
      let storageValue: boolean | null = false
      mockUseLocalStorage.mockImplementation(() => [
        storageValue,
        mockSetDarkMode,
        mockRemoveDarkMode,
      ])
      mockUseMediaQuery.mockReturnValue(false)

      const { rerender } = renderHook(() => useDarkMode())

      expect(document.body.classList.contains('dark')).toBe(false)

      storageValue = true
      mockUseLocalStorage.mockImplementation(() => [
        storageValue,
        mockSetDarkMode,
        mockRemoveDarkMode,
      ])
      rerender()

      expect(document.body.classList.contains('dark')).toBe(true)
    })
  })

  describe('return value', () => {
    it('should return enabled state and setDarkMode function', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      const { result } = renderHook(() => useDarkMode())

      expect(result.current).toHaveLength(2)
      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toBe(mockSetDarkMode)
    })

    it('should allow setting dark mode through returned setter', () => {
      mockUseLocalStorage.mockReturnValue([false, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      const { result } = renderHook(() => useDarkMode())

      act(() => {
        ;(result.current[1] as any)(true)
      })

      expect(mockSetDarkMode).toHaveBeenCalledWith(true)
    })
  })

  describe('edge cases', () => {
    it('should handle media query changing', () => {
      mockUseLocalStorage.mockReturnValue([null, mockSetDarkMode, mockRemoveDarkMode])
      let mediaQueryValue = false
      mockUseMediaQuery.mockImplementation(() => mediaQueryValue)

      const { result, rerender } = renderHook(() => useDarkMode())

      expect(result.current[0]).toBe(false)
      expect(document.body.classList.contains('dark')).toBe(false)

      mediaQueryValue = true
      mockUseMediaQuery.mockImplementation(() => mediaQueryValue)
      rerender()

      expect(result.current[0]).toBe(true)
      expect(document.body.classList.contains('dark')).toBe(true)
    })

    it('should handle empty string as key', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      renderHook(() => useDarkMode(''))

      expect(mockUseLocalStorage).toHaveBeenCalledWith('')

      expect(document.body.classList.contains('')).toBe(false)
    })

    it('should cleanup body class on unmount', () => {
      mockUseLocalStorage.mockReturnValue([true, mockSetDarkMode, mockRemoveDarkMode])
      mockUseMediaQuery.mockReturnValue(false)

      const { unmount } = renderHook(() => useDarkMode())

      expect(document.body.classList.contains('dark')).toBe(true)

      unmount()

      expect(document.body.classList.contains('dark')).toBe(true)
    })
  })
})
