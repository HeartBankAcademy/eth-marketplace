module.exports = (deployer, network) => {
  if (network !== 'development') return

  deployer.then(async () => {
    // Deploy Mock contracts for testing
  })
}
