import { loop } from './utils'
import { SUBSCRIPTION, INIT_MSG } from './cmd'

/**
 * initialState :: Model {
 *    currencyPairs   :: Map Pair
 *    historyLen      :: Number
 *    lastUpdatedPair :: String | undefined
 *    order           :: String
 * }
 */
const initialState = {
  currencyPairs: new Map(),
  historyLen: 30, // last 30 sec values <=> assuming update is triggered every second
  lastUpdatedPair: undefined,
  order: 'lastChangeBid',
}

/**
 * updateCurrencyPairs :: (Model, Msg) -> Map Pair
 *
 * Updates the currency pairs map with provided data.
 *
 * This function maps the provided data for a given currency pair
 * but adds also a `midPriceHistory` array containing
 * the computed mid-price history.
 */
const updateCurrencyPairs = ({ currencyPairs, historyLen }, data) => {

  const { bestBid, bestAsk, name } = data
  const midPrice = .5 * (Number(bestBid) + Number(bestAsk))

  const prevPair = currencyPairs.get(name)
  const midPriceHistory = prevPair ?
    [].concat(prevPair.midPriceHistory, midPrice)
      .slice(-1 * historyLen)
    : [midPrice]
  
  return new Map(currencyPairs.set(name, Object.assign({}, data, {
    midPriceHistory
  })))

}

/**
 * updateLastUpdatedPair :: (Model, Msg) -> String
 */
const updateLastUpdatedPair = (_, { name }) =>
  name

/**
 * foldState :: (Model, Msg) -> Model
 *
 * Reduces incoming data into a single object
 * by passing the new data set to each state attribute 
 * as well as the previous state; then returns a new state.
 * Completely inspired by Redux :-/
 */
const foldState = (state = initialState, { type, payload }) => {
  switch (type) {
    
    case INIT_MSG: 
      return state
      
    case SUBSCRIPTION:
      return Object.assign({}, state, {
        currencyPairs: updateCurrencyPairs(state, payload),
        lastUpdatedPair: updateLastUpdatedPair(state, payload),
      })
  }
  return state  
}

/**
 * stateFoldLoop :: Iterator
 *
 * Use a generator to apply the state update function 
 * while keeping a reference to the previous one.
 * ... OK this is perhaps a bit over-engineered :-p
 */
const stateFoldLoop =
  loop(foldState)()

/**
 * Initialize the generator loop
 */
stateFoldLoop.next({type: INIT_MSG})

/**
 * update :: Msg -> Model
 *
 * Each update call passes the message to the next 
 * generator iteration. It returns its value,
 * which corresponds to the latest state,
 * ready to be passed to the view rendering function.
 */
export const update = msg => 
  stateFoldLoop.next(msg).value
  
