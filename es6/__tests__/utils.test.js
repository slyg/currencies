import { pipe, compose, loop } from '../utils'

describe('utils', () => {
  
  describe('pipe()', () => {
    it('pipes two functions passing arguments along', () => {
      function func1() { return Array.from(arguments) }
      function func2(strArr) { return strArr.join('') }
      const piped = pipe(func1, func2)
      expect(piped('a', 'b', 'c')).toEqual('abc')
    })
  })
  
  describe('compose()', () => {
    it('left combines two or more functions', () => {
      function func1() { return Array.from(arguments) }
      const func2 = strArr => strArr.join('')
      const func3 = str => str.toUpperCase()
      expect(compose(func1, func2)('a', 'b', 'c')).toEqual('abc')
      expect(compose(func1, func2, func3)('a', 'b', 'c')).toEqual('ABC')
    })
  })
  
  describe('loop()', () => {
    it('is a higher order function returning an Iterator', () => {
      const gen = loop(() => {})
      expect(gen().next()).toEqual({done: false, value: undefined})
    })
  })

  describe('a generator build with loop()', () => {
    it('applies the passed reducer function at each iteration', () => {

      const initialValue = 0
      
      const reduceFn = (state = initialValue, data) =>
        data ? (state + data) : state

      const gen = loop(reduceFn)()
      gen.next('DUMMY MESSAGE')
      
      const sequence = [1, 1, 1].map( num => gen.next(num).value )
      
      expect(sequence).toEqual([1, 2, 3])
    })
  })
})
