import { CookieInitWithoutName } from '../types/cookies'

/**
 * Retrieves a cookie by its name.
 * @param cookieName The name of the cookie to retrieve.
 * @param defaultValue The default value to use if the cookie is not found.
 * @returns The cookie value or the default value if not found.
 */
export const getCookie = async (cookieName: string, defaultValue?: CookieInitWithoutName) => {
  const cookie = await cookieStore.get(cookieName)
  if (cookie) return cookie
  if (defaultValue) {
    await cookieStore.set({ ...defaultValue, name: cookieName })
    return { name: cookieName, value: defaultValue.value }
  }
  return null
}
