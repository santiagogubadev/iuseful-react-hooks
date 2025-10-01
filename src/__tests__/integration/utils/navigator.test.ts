import { copyToClipboard } from '@/utils/helpers/navigator'

const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')

describe('copyToClipboard', () => {
  it('should call navigator.clipboard.writeText with the correct text', async () => {
    const text = 'Hello, world!'
    await copyToClipboard(text)
    expect(writeTextSpy).toHaveBeenCalledWith(text)
  })

  it('should reject when navigator.clipboard is not available', async () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: undefined,
    })

    await expect(copyToClipboard('test')).rejects.toThrow('Clipboard API not available')

    // Restore navigator for other tests
    vi.unstubAllGlobals()
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: writeTextSpy },
    })
  })
})
