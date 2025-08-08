export class BroadcastChannelMock implements BroadcastChannel {
  name: string
  onmessage: BroadcastChannel['onmessage'] = null
  onmessageerror: BroadcastChannel['onmessageerror'] = null
  constructor (name: string) {
    this.name = name
  }

  close = vi.fn()
  postMessage = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent (): boolean { return true }
}
