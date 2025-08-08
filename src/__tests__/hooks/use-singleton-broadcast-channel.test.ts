import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useSingletonBroadcastChannel } from '@/hooks/use-singleton-broadcast-channel'
import { renderHook } from '@testing-library/react'
import { BroadcastChannelMock } from '@/__tests__/__mocks__/broadcast-channel'
import { acquireChannel, releaseChannel } from '@/utils/helpers/broadcast-channels'

vi.mock('@/utils/helpers/broadcast-channels.ts', () => ({
  acquireChannel: vi.fn((name: string) => new BroadcastChannelMock(name)),
  releaseChannel: vi.fn()
}))

vi.stubGlobal('BroadcastChannel', BroadcastChannelMock)

describe('useSingletonBroadcastChannel', () => {
  assertHook(useSingletonBroadcastChannel)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a BroadcastChannel instance', () => {
    const { result } = renderHook(() => useSingletonBroadcastChannel({ name: 'test-channel' }))

    expect(acquireChannel).toHaveBeenCalledWith('test-channel')
    expect(acquireChannel).toHaveBeenCalledTimes(1)
    expect(result.current.channel).toBeInstanceOf(BroadcastChannelMock)
  })

  it('should release channel on unmount', async () => {
    const { unmount } = renderHook(() => useSingletonBroadcastChannel({ name: 'test-channel' }))

    unmount()

    expect(releaseChannel).toHaveBeenCalledTimes(1)
  })

  it('should change channel when name changes', () => {
    const { result, rerender } = renderHook(({ name }) => useSingletonBroadcastChannel({ name }), {
      initialProps: { name: 'test-channel' }
    })

    const initialChannel = result.current.channel

    rerender({ name: 'new-channel' })

    expect(result.current.channel).not.toBe(initialChannel)
    expect(releaseChannel).toHaveBeenCalledTimes(1)
  })
})
