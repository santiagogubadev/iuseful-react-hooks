type OnChangeResize = (entries: ResizeObserverEntry[], observer: ResizeObserverMock) => void

export class ResizeObserverMock {
  public connected: boolean
  public fn: OnChangeResize
  static instances: ResizeObserverMock[] = []

  constructor(fn: OnChangeResize) {
    this.connected = true
    this.fn = fn

    ResizeObserverMock.instances.push(this)
  }

  observe = vi.fn((target?: Element) => {
    if (!this.connected) return

    const mockEntry: ResizeObserverEntry = {
      target: target || ({} as Element),
      contentRect: {
        width: 200,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 200,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      } as DOMRectReadOnly,
      borderBoxSize: [] as any,
      contentBoxSize: [] as any,
      devicePixelContentBoxSize: [] as any,
    }

    this.fn([mockEntry], this)
  })

  disconnect = vi.fn(() => {
    this.connected = false
  })

  unobserve = vi.fn()
}
