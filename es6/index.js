import { update } from './state'
import { render } from './view'
import { compose } from './utils'
import { SUBSCRIPTION } from './cmd'

const WSS_URL = "ws://localhost:8011/stomp"
const TOPIC = "/fx/prices"

const parse = raw => ({
  type: SUBSCRIPTION,
  payload: JSON.parse(raw.body)
})

const subscription = 
  compose(parse, update, render)

const init = client => () =>
  client.subscribe(TOPIC, subscription)

const main = () => {
  const client = Stomp.client(WSS_URL)
  client.debug = () => {}
  client.connect({}, init(client), err => {
    alert(err.headers.message)
  })
}

export default main
