import { copyToClipboard } from '@/utils/helpers/navigator'

const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')

describe('copyToClipboard', () => {
  it('should call navigator.clipboard.writeText with the correct text', async () => {
    const text = 'Hello, world!'
    await copyToClipboard(text)
    expect(writeTextSpy).toHaveBeenCalledWith(text)
  })
})
