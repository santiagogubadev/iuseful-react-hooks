import { BroadcastChannelMock } from '@/__tests__/__mocks__/broadcast-channel'
import { assertFunction } from '@/__tests__/__tests-utils__/assertions'

vi.stubGlobal('BroadcastChannel', BroadcastChannelMock)

describe('acquireChannel / releaseChannel', async () => {
  beforeEach(() => {
    vi.resetModules()
  })

  const { acquireChannel, releaseChannel } = await import('@/utils/helpers/broadcast-channels')
  assertFunction(acquireChannel)
  assertFunction(releaseChannel)

  it('acquireChannel should create a new channel first time', async () => {
    const { acquireChannel } = await import('@/utils/helpers/broadcast-channels')
    const channel = acquireChannel('test-channel')
    expect(channel).toBeInstanceOf(BroadcastChannelMock)
    expect(channel.close).not.toHaveBeenCalled()
  })

  it('acquireChannel should return existing channel if it already exists', async () => {
    const { acquireChannel } = await import('@/utils/helpers/broadcast-channels')
    const channel1 = acquireChannel('test-channel')
    const channel2 = acquireChannel('test-channel')
    expect(channel1).toBe(channel2)
  })

  it('releaseChannel should close channel when count reaches zero', async () => {
    const { acquireChannel, releaseChannel } = await import('@/utils/helpers/broadcast-channels')
    const channel = acquireChannel('test-channel')
    releaseChannel('test-channel', channel)
    expect(channel.close).toHaveBeenCalledTimes(1)
  })

  it('releaseChannel should not close channel if count is still greater than zero', async () => {
    const { acquireChannel, releaseChannel } = await import('@/utils/helpers/broadcast-channels')
    const channel = acquireChannel('test-channel')
    releaseChannel('test-channel', channel)
    releaseChannel('test-channel', channel)
    expect(channel.close).toHaveBeenCalledTimes(1)
  })
})
