require('babel-register')
process.env.NODE_ENV = process.env.NODE_ENV || 'development' // Required by babel-preset-react-app

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
    }
  },
  mocha: mochaSettings()
}
