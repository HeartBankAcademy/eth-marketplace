/* Errors */

Error.requiredParam = function(paramName, funcName) {
  return new Error(`Required parameter missing: ${paramName}${funcName ? ` - ${funcName}` : ``}`)
}

Error.conditionNotMet = function(conditionName, funcName) {
  return new Error(`Required condition not met: ${conditionName}${funcName ? ` - ${funcName}` : ``}`)
}

Error.noWeb3Found = new Error('No web3 instance found.')
Error.noActiveAccount = new Error(`No active account found. Please, make sure you're logged in to MetaMask.`)
Error.insufficientEther = new Error(
  'Insufficient balance. Please make sure you have enough ether to complete the transaction.'
)

/* Extensions */

Error.prototype.isEqual = function(error) {
  return this.message === error.message
}

Error.prototype.isMetaMaskError = function() {
  if (!this.message) return false
  if (this.message.indexOf('MetaMask') >= 0) return true
  return false
}

Error.prototype.isMetaMaskUserAborted = function() {
  if (!this.isMetaMaskError) return false
  if (this.message.indexOf('User denied transaction signature') >= 0) return true
  return false
}
