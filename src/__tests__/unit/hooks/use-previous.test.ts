import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { usePrevious } from '@/hooks/use-previous'
import { renderHook } from '@testing-library/react'

describe('usePrevious', async () => {
  assertHook(usePrevious)

  it('should return the previous value', async () => {
    const { result, rerender } = renderHook(({ count }) => usePrevious(count), {
      initialProps: { count: 0 },
    })

    expect(result.current).toBeNull()

    rerender({ count: 1 })

    expect(result.current).toBe(0)
  })
})
