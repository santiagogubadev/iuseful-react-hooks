import { copyToClipboard } from '@/utils/helpers/navigator'

// Mock isClient to be false for SSR testing
vi.mock('@/utils/helpers/is-client', () => ({
  isClient: false,
}))

describe('copyToClipboard SSR', () => {
  it('should reject when clipboard API is not available during SSR', async () => {
    await expect(copyToClipboard('test')).rejects.toThrow('Clipboard API not available')
  })
})
