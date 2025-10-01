import { useState, useEffect } from 'react'
import { isClient } from '@/utils/helpers/is-client'

interface UseGeolocationReturn {
  /**
   * Indicates if the geolocation data is being loaded.
   */
  loading: boolean
  /**
   * Indicates if there was an error retrieving the geolocation data.
   */
  error: GeolocationPositionError | null
  /**
   * The geolocation data retrieved from the browser.
   */
  data: GeolocationCoordinates | null
}

/**
 * A custom hook that retrieves the user's geolocation.
 * @param options Options for the geolocation request.
 * @returns An object containing the loading state, error (if any), and the geolocation data.
 */
export function useGeolocation(options?: PositionOptions): UseGeolocationReturn {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<GeolocationPositionError | null>(null)
  const [data, setData] = useState<GeolocationCoordinates | null>(null)

  useEffect(() => {
    if (!isClient) {
      setLoading(false)
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setLoading(false)
      setError(null)
      setData(position.coords)
    }

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error)
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options)

    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, options)

    return () => navigator.geolocation.clearWatch(watchId)
  }, [options])

  return { loading, error, data }
}
