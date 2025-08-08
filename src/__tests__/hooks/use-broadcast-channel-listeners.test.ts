import { useBroadcastChannelListener } from '@/hooks/use-broadcast-channel-listeners'
import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { UseSingletonBroadcastChannelParams } from '@/hooks/use-singleton-broadcast-channel'
import { BroadcastChannelMock } from '../__mocks__/broadcast-channel'
import { renderHook } from '@testing-library/react'

let lastChannel: BroadcastChannelMock

vi.mock('@/hooks/use-singleton-broadcast-channel', () => ({
  useSingletonBroadcastChannel: vi.fn(({ name }: UseSingletonBroadcastChannelParams) => {
    lastChannel = new BroadcastChannelMock(name)
    return { channel: lastChannel }
  })
}))

describe('useBroadcastChannelListeners', () => {
  assertHook(useBroadcastChannelListener)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add listeners to the BroadcastChannel', () => {
    renderHook(() => useBroadcastChannelListener({ channelName: 'test-channel', onMessage: vi.fn(), onError: vi.fn() }))

    expect(lastChannel!.addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
    expect(lastChannel!.addEventListener).toHaveBeenCalledWith('messageerror', expect.any(Function))
  })

  it('should call onMessage when a message is received', () => {
    const onMessage = vi.fn()
    renderHook(() => useBroadcastChannelListener({ channelName: 'test-channel', onMessage }))

    const messageEvent = new MessageEvent('message', { data: { test: 'data' } })
    lastChannel!.addEventListener.mock.calls[0][1](messageEvent)

    expect(onMessage).toHaveBeenCalledWith(messageEvent)
    expect(onMessage).toHaveBeenCalledTimes(1)
    expect(onMessage.mock.calls[0][0].data).toEqual({ test: 'data' })
  })

  it('should call onError when a message error occurs', () => {
    const onError = vi.fn()
    renderHook(() => useBroadcastChannelListener({ channelName: 'test-channel', onMessage: vi.fn(), onError }))

    const errorEvent = new Event('messageerror')
    lastChannel!.addEventListener.mock.calls[1][1](errorEvent)

    expect(onError).toHaveBeenCalledWith(errorEvent)
  })
})
