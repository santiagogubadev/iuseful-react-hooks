import { mockCookieStore } from '@/__tests__/__mocks__/cookie-store'
import { getCookie } from '@/utils/helpers/cookies'

describe('getCookie', () => {
  vi.stubGlobal('cookieStore', mockCookieStore)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return the cookie if it exists', async () => {
    const mockCookie = { name: 'test', value: 'value' }
    mockCookieStore.get.mockResolvedValue(mockCookie)

    const cookie = await getCookie('test')

    expect(mockCookieStore.get).toHaveBeenCalledWith('test')
    expect(cookie).toEqual(mockCookie)
  })

  it('should return null if cookie does not exist and no default value is provided', async () => {
    mockCookieStore.get.mockResolvedValue(null)

    const cookie = await getCookie('nonexistent')

    expect(mockCookieStore.get).toHaveBeenCalledWith('nonexistent')
    expect(cookie).toBeNull()
  })

  it('should create and return a cookie with default value when cookie does not exist', async () => {
    mockCookieStore.get.mockResolvedValue(null)
    mockCookieStore.set.mockResolvedValue(undefined)

    const defaultValue = {
      value: 'default-value',
      path: '/',
      maxAge: 3600,
    }

    const cookie = await getCookie('newcookie', defaultValue)

    expect(mockCookieStore.get).toHaveBeenCalledWith('newcookie')
    expect(mockCookieStore.set).toHaveBeenCalledWith({
      ...defaultValue,
      name: 'newcookie',
    })
    expect(cookie).toEqual({
      name: 'newcookie',
      value: 'default-value',
    })
  })

  it('should handle complex default values with all properties', async () => {
    mockCookieStore.get.mockResolvedValue(null)
    mockCookieStore.set.mockResolvedValue(undefined)

    const defaultValue = {
      value: 'complex-value',
      domain: '.example.com',
      path: '/app',
      expires: Date.now() + 3600000, // timestamp instead of Date object
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
    }

    const cookie = await getCookie('complex-cookie', defaultValue)

    expect(mockCookieStore.set).toHaveBeenCalledWith({
      ...defaultValue,
      name: 'complex-cookie',
    })
    expect(cookie).toEqual({
      name: 'complex-cookie',
      value: 'complex-value',
    })
  })

  it('should prioritize existing cookie over default value', async () => {
    const existingCookie = { name: 'existing', value: 'existing-value' }
    mockCookieStore.get.mockResolvedValue(existingCookie)

    const defaultValue = {
      value: 'default-value',
      path: '/',
    }

    const cookie = await getCookie('existing', defaultValue)

    expect(mockCookieStore.get).toHaveBeenCalledWith('existing')
    expect(mockCookieStore.set).not.toHaveBeenCalled()
    expect(cookie).toEqual(existingCookie)
  })

  it('should handle cookieStore.set rejection when setting default value', async () => {
    mockCookieStore.get.mockResolvedValue(null)
    const setError = new DOMException('Failed to set cookie')
    mockCookieStore.set.mockRejectedValue(setError)

    const defaultValue = {
      value: 'default-value',
      path: '/',
    }

    await expect(getCookie('failing-cookie', defaultValue)).rejects.toThrow('Failed to set cookie')

    expect(mockCookieStore.get).toHaveBeenCalledWith('failing-cookie')
    expect(mockCookieStore.set).toHaveBeenCalledWith({
      ...defaultValue,
      name: 'failing-cookie',
    })
  })

  it('should handle cookieStore.get rejection', async () => {
    const getError = new DOMException('Failed to get cookie')
    mockCookieStore.get.mockRejectedValue(getError)

    await expect(getCookie('failing-get')).rejects.toThrow('Failed to get cookie')

    expect(mockCookieStore.get).toHaveBeenCalledWith('failing-get')
  })

  it('should work with empty string as cookie name', async () => {
    const mockCookie = { name: '', value: 'empty-name-value' }
    mockCookieStore.get.mockResolvedValue(mockCookie)

    const cookie = await getCookie('')

    expect(mockCookieStore.get).toHaveBeenCalledWith('')
    expect(cookie).toEqual(mockCookie)
  })

  it('should handle undefined cookie value in default', async () => {
    mockCookieStore.get.mockResolvedValue(null)
    mockCookieStore.set.mockResolvedValue(undefined)

    const defaultValue = {
      value: undefined as any,
      path: '/',
    }

    const cookie = await getCookie('undefined-value', defaultValue)

    expect(mockCookieStore.set).toHaveBeenCalledWith({
      ...defaultValue,
      name: 'undefined-value',
    })
    expect(cookie).toEqual({
      name: 'undefined-value',
      value: undefined,
    })
  })
})
