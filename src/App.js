/* eslint-disable */

import React from 'react'
// import * as utils from './utils'
// import EthereumManager from './services/EthereumManager'
import './App.scss'

class App extends React.Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
  }

  render() {
    // let storedData = this.props.drizzleStatus.initialized ? this.props.ACLV1.methods.isACL.send() : 'Loading...'
    let storedData = 'working on it...'
    return (
      <div>
        <h1>Marketplace</h1>
        <p>Got that ACL? {storedData}</p>
      </div>
    )
  }
}

import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    ACLV1: state.contracts.ACLV1
  }
}

const AppContainer = drizzleConnect(App, mapStateToProps)

export default AppContainer
