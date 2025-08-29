import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useScript, useAsync } from '@/hooks'
import { renderHook } from '@testing-library/react'

vi.mock('@/hooks/use-async.ts', { spy: true })

describe('useScript', async () => {
  assertHook(useScript)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return the values and call use', async () => {
    const { result } = renderHook(() => useScript('https://example.com/script.js'))
    expect(useAsync).toHaveBeenCalled()
    expect(useAsync).toHaveBeenCalledTimes(1)
    expect(result.current).toBeDefined()
  })

  it('should create the <script> tag', async () => {
    const documentCreateElementSpy = vi.spyOn(document, 'createElement')
    renderHook(() => useScript('https://example.com/script.js'))
    expect(documentCreateElementSpy).toHaveBeenCalled()
  })
})
