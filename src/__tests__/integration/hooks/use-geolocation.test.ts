import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useGeolocation } from '@/hooks'
import { renderHook } from '@testing-library/react'
import { mockGeolocation } from '@/__tests__/__mocks__/geolocation'

vi.stubGlobal('navigator', {
  ...navigator,
  geolocation: mockGeolocation,
})

describe('useGeolocation', () => {
  assertHook(useGeolocation)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should connect to the geolocation API', () => {
    renderHook(() => useGeolocation())

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    expect(mockGeolocation.watchPosition).toHaveBeenCalled()
  })

  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBe(null)
  })

  it('should use the provided options in the geolocation API', () => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
    renderHook(() => useGeolocation(options))

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      options,
    )
    expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      options,
    )
  })

  it('should handle successful geolocation response', () => {
    const mockPosition: GeolocationPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toEqual(mockPosition.coords)
  })

  it('should handle geolocation error', () => {
    const mockError: GeolocationPositionError = {
      code: 1,
      message: 'Permission denied',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toEqual(mockError)
    expect(result.current.data).toBe(null)
  })
})
