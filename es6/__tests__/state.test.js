import stateMod from '../state'
import { SUBSCRIPTION, INIT_MSG } from '../cmd'

describe('State', () => {
  
  const initialState = stateMod.__get__('initialState')
  const foldState = stateMod.__get__('foldState')
  const updateCurrencyPairs = stateMod.__get__('updateCurrencyPairs')
  const updateLastUpdatedPair = stateMod.__get__('updateLastUpdatedPair')
  
  describe('updateCurrencyPairs()', () => {
    
    it('returns an updated CurrencyPairs Map', () => {
      
      const model = { currencyPairs: new Map(), historyLen: 5, }
      
      const data = {
        bestBid: '1.2',
        bestAsk: '0.01',
        name: 'EURETH',
      }
      
      const nextPairs = updateCurrencyPairs(model, data)
      
      expect(nextPairs.get('EURETH')).toEqual(Object.assign({}, data, {midPriceHistory: [0.605]}))
    })
    
    it('aggregates the last midPrice values history', () => {
      
      const HISTORY_LEN = 5
      
      let model = { currencyPairs: new Map(), historyLen: HISTORY_LEN, }
      
      const data = {
        bestBid: '1.2',
        bestAsk: '0.01',
        name: 'EURETH',
      }
      
      let nextPairs = updateCurrencyPairs(model, data)
      
      let i = 10
      while (i > 0) {
        model.currencyPairs = nextPairs
        updateCurrencyPairs(model, data)
        i--
      }
      
      const history = nextPairs.get('EURETH')['midPriceHistory']
      
      expect(history.length).toEqual(HISTORY_LEN)
      
    })
    
    it('computes midPrice averarging bestBid and bestAsk numerical values', () => {
      
      const HISTORY_LEN = 5
      
      let model = { currencyPairs: new Map(), historyLen: HISTORY_LEN, }
      
      const dataSet = [{
        bestBid: '1',
        bestAsk: '1',
        name: 'EURETH',
      }, {
        bestBid: '0',
        bestAsk: '1',
        name: 'EURETH',
      }, {
        bestBid: '1',
        bestAsk: '0',
        name: 'EURETH',
      }]
      
      const expectedHistory = [1, 0.5, 0.5]
      
      const history = dataSet
        .reduce((acc, val) => {
          return Object.assign({}, acc, {
            currencyPairs: updateCurrencyPairs(model, val)
          })
        }, {})['currencyPairs'].get('EURETH')['midPriceHistory']
      
      expect(history).toEqual(expectedHistory)
      
    })
    
  })
  
  describe('foldState()', () => {
    
    it('returns the initial state if a dummy message is passed', () => {
      const dummyMsg = { type: 'DUMMY' }
      expect(foldState(undefined, dummyMsg)).toEqual(initialState)
    })
    
    it('returns the initial state if the init message is passed', () => {
      const dummyMsg = { type: INIT_MSG }
      expect(foldState(undefined, dummyMsg)).toEqual(initialState)
    })
    
    it('triggers a currencyPairs update when a SUBSCRIPTION message is passed', () => {
      
      // Reference to a given Map
      const probeMap = new Map()
      
      stateMod.__Rewire__('updateCurrencyPairs', () => probeMap)
      
      const message = {
        type: SUBSCRIPTION,
        payload: {
          bestBid: '1.2',
          bestAsk: '0.01',
          name: 'EURETH',
        }
      }
      
      const state = { currencyPairs: new Map(), historyLen: 5, }
      const nextCurrencyPairs = foldState(state, message)['currencyPairs']
      
      expect(nextCurrencyPairs).toBe(probeMap)
      
      stateMod.__ResetDependency__('updateCurrencyPairs')
      
    })
    
    describe('updateLastUpdatedPair()', () => {
      it('returns the passed pair name value', () => {
        const result = updateLastUpdatedPair(undefined, { name: 'whatever' })
        expect(result).toEqual('whatever')
      })
    })
    
  })
  
  
})
