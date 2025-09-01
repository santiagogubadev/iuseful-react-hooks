export const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(() => 1),
  clearWatch: vi.fn(),
}

export const mockPosition: GeolocationPosition = {
  coords: {
    latitude: 40.7128,
    longitude: -74.006,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON: vi.fn(),
  },
  timestamp: Date.now(),
  toJSON: vi.fn(),
}

export const mockPositionError: GeolocationPositionError = {
  code: 1,
  message: 'User denied the request for Geolocation.',
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}
