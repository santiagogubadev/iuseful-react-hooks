interface Entry {
  /**
   * The BroadcastChannel instance.
   */
  channel: BroadcastChannel
  /**
   * The number of times this channel has been acquired.
   */
  count: number
}

const cache = new Map<string, Entry>()

/**
 *
 * @param name - The name of the BroadcastChannel to acquire.
 * @returns The BroadcastChannel instance if it exists, or creates a new one.
 */
export function acquireChannel(name: string): BroadcastChannel {
  const current = cache.get(name)
  if (current) {
    current.count += 1
    return current.channel
  }
  const channel = new BroadcastChannel(name)
  cache.set(name, { channel, count: 1 })
  return channel
}

/**
 * Releases a BroadcastChannel by name.
 * @param name - The name of the channel to release.
 * @param channel - The channel to release.
 */
export function releaseChannel(name: string, channel: BroadcastChannel) {
  if (!channel) return
  const entry = cache.get(name)
  if (!entry) return

  // only release if the channel matches
  if (entry.channel === channel) {
    entry.count -= 1
    if (entry.count <= 0) {
      entry.channel.close()
      cache.delete(name)
    }
  }
}
