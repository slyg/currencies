// tableLayout :: String
const tableLayout = `
  <table>
    <thead>
      <tr>
        <th>Currency Pair</th>
        <th>Current Best Bid</th>
        <th>Last Change Bid Change Amount ↓</th>
        <th>Current Best Ask</th>
        <th>Last Best Ask Change Amount</th>
        <th>Mid Price History</th>
      </tr>
    </thead>
    <tbody id="rows-container"></tbody>
  </table>
`

// rowView :: RowViewModel -> String
const rowView = ({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk }) => `
  <tr id="currencyPair-${name}">
    <td>${name}</td>
    <td>${bestBid}</td>
    <td>${lastChangeBid}</td>
    <td>${bestAsk}</td>
    <td>${lastChangeAsk}</td>
    <td><span id="midPriceHistory-${name}"></span></td>
  </tr>
`

// compareCurrencyBy :: String -> (RowViewModel, RowViewModel) -> Number
const compareCurrencyBy = attr => (dataA, dataB) =>
  dataB[attr] - dataA[attr]

// selector :: Model -> ViewModel
const selector = ({ currencyPairs, order }) =>
  Array.from(currencyPairs.values())
    .sort( compareCurrencyBy(order) )

/**
 * renderRows :: HTMLElement -> Model -> void
 *
 * This function will first "brute-force" render the rows
 * and trigger the sparklines update in a second time,
 * assuming innerHTML setter is blocking js execution.
 */
const renderRows = container => state => {
  const viewModel = selector(state)
  
  container.innerHTML = 
    selector(state).map( rowView ).join('')
    
  viewModel.forEach( ({ name, midPriceHistory }) => {
    const target = document.getElementById(`midPriceHistory-${name}`)
    Sparkline.draw(target, midPriceHistory)
  })
}

// Assuming the js bundle is injected at the end of <body>.
document.getElementById('currency-pairs-table').innerHTML =
  tableLayout

// Next calls will trigger the rows re-render
export const render = 
  renderRows(document.getElementById('rows-container'))
