export const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  addEventListener: vi.fn(),
}

export const mockPositionError: GeolocationPositionError = {
  code: 1,
  message: 'User denied the request for Geolocation.',
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}
