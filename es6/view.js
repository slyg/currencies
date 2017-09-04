const ROW_HEIGTH = 30 // px
const ROW_TOPPAD = 50 // px

const tableLayout = `
  <table>
    <thead>
      <tr>
        <th><span>Currency Pair</span></th>
        <th><span>Current Best Bid</span></th>
        <th><span>Last Change Bid Change Amount ↓</span></th>
        <th><span>Current Best Ask</span></th>
        <th><span>Last Best Ask Change Amount</span></th>
        <th><span>Mid Price History</span></th>
      </tr>
    </thead>
    <tbody id="rows-container"></tbody>
  </table>
`

const rowContent = ({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk }) => `
  <td><span>${name}</span></td>
  <td><span>${bestBid}</span></td>
  <td><span>${lastChangeBid}</span></td>
  <td><span>${bestAsk}</span></td>
  <td><span>${lastChangeAsk}</span></td>
  <td><span id="midPriceHistory-${name}"></span></td>
`

const createRow = ({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk }) => {
  const row = document.createElement('tr')
  row.setAttribute('id', `row-${name}`)
  row.innerHTML = rowContent({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk })
  return row
}

const updateRow = (row, { name, bestBid, lastChangeBid, bestAsk, lastChangeAsk }) => {
  row.innerHTML = rowContent({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk })
  return row
}

const compareCurrencyBy = attr => (dataA, dataB) =>
  dataB[attr] - dataA[attr]

const orderFrom = ({ currencyPairs, order }) =>
  Array.from(currencyPairs.values())
    .sort( compareCurrencyBy(order) )
    .map( pair => pair.name )

const renderRows = container =>  {
  
  const domMap = new Map()
  
  return state => {
  
    const { lastUpdatedPair, currencyPairs } = state
    const pair = currencyPairs.get(lastUpdatedPair)
    
    // Update or create a row
    if (domMap.has(lastUpdatedPair)) {
      const existingRow = domMap.get(lastUpdatedPair)
      updateRow(domMap.get(lastUpdatedPair), pair)
    } else {
      const newRow = createRow(pair)
      domMap.set(lastUpdatedPair, newRow)
      container.appendChild(newRow)
    }
    
    // Update vertical positions
    orderFrom(state).forEach( (orderVal, i) => {
      domMap.get(orderVal).style.top = `${(i * ROW_HEIGTH) + ROW_TOPPAD}px`
    })
    
    const { midPriceHistory, name } = pair
    
    const target = document.getElementById(`midPriceHistory-${name}`)
    Sparkline.draw(target, midPriceHistory)
    
    keysOrder.map(key => domMap.get(key))

  }
}

// Assuming the js bundle is injected at the end of <body>.
document.getElementById('currency-pairs-table').innerHTML =
  tableLayout

// Next calls will trigger the rows re-render
export const render = 
  renderRows(document.getElementById('rows-container'))
