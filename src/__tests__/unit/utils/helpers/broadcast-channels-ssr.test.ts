import { assertFunction } from '@/__tests__/__tests-utils__/assertions'

// Mock isClient to be false for SSR testing
vi.mock('@/utils/helpers/is-client', () => ({
  isClient: false,
}))

describe('acquireChannel / releaseChannel SSR', async () => {
  beforeEach(() => {
    vi.resetModules()
  })

  const { acquireChannel, releaseChannel } = await import('@/utils/helpers/broadcast-channels')
  assertFunction(acquireChannel)
  assertFunction(releaseChannel)

  it('should return null when isClient is false', async () => {
    const { acquireChannel } = await import('@/utils/helpers/broadcast-channels')
    const channel = acquireChannel('test-channel')
    expect(channel).toBe(null)
  })

  it('should handle null channel in releaseChannel', async () => {
    const { releaseChannel } = await import('@/utils/helpers/broadcast-channels')
    // Should not throw when releasing null channel
    expect(() => releaseChannel('test-channel', null)).not.toThrow()
  })
})
