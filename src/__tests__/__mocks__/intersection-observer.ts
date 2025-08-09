type OnChangeIntersection = (
  params: [{ isIntersecting: boolean }],
  observer: IntersectionObserverMock,
) => void

export class IntersectionObserverMock {
  public connected: boolean
  public fn: OnChangeIntersection
  static instances: IntersectionObserverMock[] = []

  constructor(fn: OnChangeIntersection) {
    this.connected = true
    this.fn = fn

    IntersectionObserverMock.instances.push(this)
  }

  observe = vi.fn(() => {
    if (!this.connected) return

    this.fn([{ isIntersecting: true }], this)
  })

  disconnect = vi.fn(() => {
    this.connected = false
  })
}
