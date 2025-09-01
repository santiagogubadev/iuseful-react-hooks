import { useCallback, useEffect, useRef, useState } from 'react'
import { useAsync } from './use-async'
import { useEventListener } from './use-event-listener'
import { CookieInitWithoutName } from '@/utils/types/cookies'
import { getCookie } from '@/utils/helpers/cookies'

interface UseCookieInfoAndHandlersReturn {
  /**
   * Updates the cookie with the given value.
   * @param value The new value for the cookie.
   */
  updateCookie: (value: CookieInitWithoutName) => void
  /**
   * Deletes the cookie.
   */
  deleteCookie: () => void
  /**
   * Indicates whether the cookie is being loaded.
   */
  loadingCookie: boolean
  /**
   * Indicates whether there was an error loading the cookie.
   */
  errorLoadingCookie: DOMException | null
  /**
   * Indicates whether the cookie action is being loaded.
   */
  loadingCookieAction: boolean
  /**
   * Indicates whether there was an error performing the cookie action.
   */
  errorOnCookieAction: DOMException | null
}

type UseCookieReturn = [CookieListItem | null, UseCookieInfoAndHandlersReturn]

/**
 * Custom hook to manage a cookie.
 * Internally uses the [CookieStore](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore) async API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CookieStore to know more about the API usage.
 * @param cookieName The name of the cookie.
 * @param defaultValue The default value for the cookie if it doesn't exist.
 * @returns A tuple containing the cookie value and an object with cookie-related information and handlers.
 */
export function useCookie(
  cookieName: string,
  defaultValue?: CookieInitWithoutName,
): UseCookieReturn {
  const {
    value: cookie,
    setValue: setCookie,
    loading: loadingCookie,
    error: errorLoadingCookie,
  } = useAsync<CookieListItem | null, DOMException>(
    async () => await getCookie(cookieName, defaultValue),
  )
  const [loadingCookieAction, setLoadingCookieAction] = useState<boolean>(false)
  const [errorOnCookieAction, setErrorOnCookieAction] = useState<DOMException | null>(null)

  const updateCookie = useCallback(
    (newValue: CookieInitWithoutName) => {
      setLoadingCookieAction(true)
      cookieStore
        .set({ ...newValue, name: cookieName })
        .then(() =>
          setCookie({
            name: cookieName,
            value: newValue.value,
          }),
        )
        .catch((error) => setErrorOnCookieAction(error))
        .finally(() => setLoadingCookieAction(false))
    },
    [cookieName],
  )

  const deleteCookie = useCallback(() => {
    setLoadingCookieAction(true)
    cookieStore
      .delete(cookieName)
      .then(() => setCookie(null))
      .catch((error) => setErrorOnCookieAction(error))
      .finally(() => setLoadingCookieAction(false))
  }, [cookieName])

  return [
    cookie,
    {
      updateCookie,
      deleteCookie,
      loadingCookie,
      errorLoadingCookie,
      loadingCookieAction,
      errorOnCookieAction,
    },
  ]
}

type CookieChanges = Pick<CookieChangeEvent, 'changed' | 'deleted'>

const INITIAL_COOKIE_CHANGES: CookieChanges = {
  changed: [],
  deleted: [],
} as const

/**
 * Custom hook to listen for cookie changes.
 * @param onCookieChanges The callback to invoke when cookie changes are detected.
 * @returns An object containing the current cookie changes.
 */
export function useCookiesChangeListener(
  onCookieChanges: (e: CookieChangeEvent) => void,
): CookieChanges {
  const [cookiesChanges, setCookiesChanges] = useState<CookieChanges>(INITIAL_COOKIE_CHANGES)
  const cbRef = useRef(onCookieChanges)

  useEffect(() => {
    cbRef.current = onCookieChanges
  }, [onCookieChanges])

  useEventListener(
    'change',
    (e) => {
      setCookiesChanges({
        changed: e.changed,
        deleted: e.deleted,
      })
      cbRef.current(e)
    },
    cookieStore,
  )

  return cookiesChanges
}

interface UseGetAllCookiesReturn {
  /**
   * Array with all current cookies
   */
  cookies: CookieList | null
  /**
   * Indicates whether the cookies are being loaded.
   */
  loading: boolean
  /**
   * Indicates whether there was an error loading the cookies.
   */
  error: DOMException | null
}

/**
 * A hook to get all the current cookies using [CookieStore](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore) async API.
 * @param params - parameters of the hook
 * @returns current cookies
 */
export function useGetAllCookies(params?: string | CookieStoreGetOptions): UseGetAllCookiesReturn {
  const {
    value: cookies,
    loading,
    error,
  } = useAsync<CookieList, DOMException>(async () => {
    if (typeof params === 'string') return await cookieStore.getAll(params)

    return await cookieStore.getAll(params)
  })

  return {
    cookies,
    loading,
    error,
  }
}
