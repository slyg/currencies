export const pipe = (f, g) => (...args) =>
  g(f(...args))

export const compose = (...fns) =>
  fns.reduce(pipe)

/**
 * loop :: Function -> Iterator
 *
 * Higher order function returning a generator.
 * 
 * It is used to allow the next set of data and the previous 
 * computed state being used as parameter for the next iteration.
 * 
 * Notice it yields the previous state so that its value can be consumed
 * as well as injecting the next data set from the next iteration.
 *
 *  ...OK once again, perhaps a bit overkill :-p
 */
export const loop = updateFn =>
  function* () {
    let state
    while (true) {
      state = updateFn(state, yield state)
    }
  }