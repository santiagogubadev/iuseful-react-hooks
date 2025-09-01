export type DefaultValue<S> = S | (() => S)

export type NewState<S> = S | ((prev: S) => S)
