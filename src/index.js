import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './extensions'
import 'normalize.css'

import { DrizzleProvider } from 'drizzle-react'
import ACLV1 from '../build/contracts/ACLV1.json'

const options = {
  contracts: [ACLV1],
  events: {
    ACLV1: ['ProductOwnerUpdated', 'AuthorizedAccount']
  },
  syncAlways: true,
  polls: {
    accounts: 1500
  }
}

ReactDOM.render(
  <DrizzleProvider options={options}>
    <App />
  </DrizzleProvider>,
  document.getElementById('root')
)
