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
const rowView = ({ name, bestBid, lastChangeBid, bestAsk, lastChangeAsk }) => {
  const rowContainer = document.createElement('tr');
  rowContainer.setAttribute('id', `currencyPair-${name}`)
  rowContainer.setAttribute('class', `row`)
  rowContainer.innerHTML = `
    <td><span>${name}</span></td>
    <td><span>${bestBid}</span></td>
    <td><span>${lastChangeBid}</span></td>
    <td><span>${bestAsk}</span></td>
    <td><span>${lastChangeAsk}</span></td>
    <td><span class="midPriceHistory"></span></td>
  `
  return rowContainer
}

// updateSparkline :: Void
const updateSparkline = (rowElm, midPriceHistory) => {
  const target = rowElm.querySelector('.midPriceHistory')
  Sparkline.draw(target, midPriceHistory)
}

// appendInside :: HTMLElement
const appendInside = container => row => {
  const newRowElm = rowView(row)
  
  container.appendChild(newRowElm)
  updateSparkline(newRowElm, row.midPriceHistory)
  
  setTimeout(() => {
    newRowElm.setAttribute('class', `row here`)
  }, 0)
  
  return newRowElm
}

// updateInside :: HTMLElement
const updateInside = container => (previousRowElm, row) => {
  const newRowElm = rowView(row)
  
  container.replaceChild(newRowElm, previousRowElm)
  updateSparkline(newRowElm, row.midPriceHistory)
  
  setTimeout(() => {
    newRowElm.setAttribute('class', `row here`)
  }, 0)
  
  return newRowElm
}

// sortRowsFrom :: (HTMLElement, HTMLElement) -> Array String -> Void
const sortRowsFrom = (container, domStateRef) => namesOrder => {
  namesOrder.forEach(name => 
    container.appendChild( domStateRef.get(name) )
  )
}

// compareCurrencyBy :: String -> (RowViewModel, RowViewModel) -> Number
const compareCurrencyBy = attr => (dataA, dataB) =>
  dataB[attr] - dataA[attr]

// selector :: Model -> ViewModel
const selector = ({ currencyPairs, order, lastUpdatedPair }) => ({
  lastUpdatedPair,
  
  namesOrder:
    Array.from(currencyPairs.values())
      .sort( compareCurrencyBy(order) )
      .map( pair => pair.name ),
    
  lastUpdatedPairRowData:
    currencyPairs.get(lastUpdatedPair)
})

// renderRows :: HTMLElement -> Function
const renderRows = function(container) {
  
  let domState = new Map()
  
  const append = appendInside(container)
  const update = updateInside(container)
  const sortRows = sortRowsFrom(container, domState)
  
  // :: Void
  return state => {
    
    const viewModel = selector(state)
    
    const { lastUpdatedPair, lastUpdatedPairRowData } = viewModel

    if (domState.has(lastUpdatedPair)) {
      const elm = update(domState.get(lastUpdatedPair), lastUpdatedPairRowData)
      domState.set(lastUpdatedPair, elm)
    } else {
      const elm = append(lastUpdatedPairRowData)
      domState.set(lastUpdatedPair, elm)
    }
    
    sortRows(viewModel.namesOrder)
  }
}

// Assuming the js bundle is injected at the end of <body>.
document.getElementById('currency-pairs-table').innerHTML =
  tableLayout

export const render = 
  renderRows(document.getElementById('rows-container'))
