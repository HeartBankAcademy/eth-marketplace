import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    let web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      const results = { web3 }

      console.log('Injected web3 detected.')
      resolve(results)
    } else {
      console.warn(Error.noWeb3Found)
      reject(Error.noWeb3Found)
    }
  })
})

export { getWeb3 }
