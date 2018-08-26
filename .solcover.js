const glob = require('glob')

const libFiles = glob.sync('contracts/lib/**/*.sol').map(n => n.replace('contracts/', ''))
const mockFiles = glob.sync('contracts/mocks/**/*.sol').map(n => n.replace('contracts/', ''))

module.exports = {
  copyPackages: ['openzeppelin-solidity'],
  skipFiles: libFiles.concat(mockFiles),
  testCommand: 'truffle test'
}
