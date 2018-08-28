require('babel-register')
process.env.NODE_ENV = process.env.NODE_ENV || 'development' // Required by babel-preset-react-app

const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = '## REPLACE FOR DEPLOYMENT ##'

const mochaSettings = () => {
  if (!process.env.GAS_REPORTER) return {}

  return {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD'
    }
  }
}

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, '## REPLACE FOR DEPLOYMENT ##', 0)
      },
      network_id: 4
    }
  },
  mocha: mochaSettings()
}
