/**
 * Utility functions for testing hooks and functions in React.
 * @param hook - The hook to assert.
 */
export const assertHook = (hook: Function) => {
  assertFunction(hook)
  it(`${hook.name || 'hook'} should starts with "use"`, () => {
    expect(hook.name.substring(0, 3)).toBe('use')
  })
}

/**
 * Utility function to assert that a function is defined and is a function.
 * @param fn - The function to assert.
 */
export const assertFunction = (fn: Function) => {
  it(`${fn.name || 'function'} should be a function`, () => {
    expect(fn).to.be.a('function')
  })
}
