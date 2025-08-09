import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { UseSingletonBroadcastChannelParams } from '@/hooks/use-singleton-broadcast-channel'
import { BroadcastChannelMock } from '@/__tests__/__mocks__/broadcast-channel'
import { useBroadcastChannelSender } from '@/hooks'
import { renderHook } from '@testing-library/react'

let lastChannel: BroadcastChannelMock

vi.mock('@/hooks/use-singleton-broadcast-channel', () => ({
  useSingletonBroadcastChannel: vi.fn(({ name }: UseSingletonBroadcastChannelParams) => {
    lastChannel = new BroadcastChannelMock(name)
    return { channel: lastChannel }
  }),
}))

describe('useBroadcastChannelSender', () => {
  assertHook(useBroadcastChannelSender)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should send a message through the BroadcastChannel', () => {
    const { result } = renderHook(() => useBroadcastChannelSender({ channelName: 'test-channel' }))

    expect(lastChannel).toBeTruthy()
    expect(lastChannel!.postMessage).not.toHaveBeenCalled()

    const sendParams = { test: 'data' }

    result.current.send(sendParams)

    expect(lastChannel!.postMessage).toHaveBeenCalledWith(sendParams)
  })
})
