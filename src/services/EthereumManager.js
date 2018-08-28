import { artifacts as _artifactsMarketplaceV1 } from '../../build/contracts/MarketplaceV1.json'
// import { artifacts as _artifactsMarketplaceProxy } from '../../build/contracts/MarketplaceProxy.json'
import { default as contract } from 'truffle-contract'

const _MarketplaceV1 = contract(_artifactsMarketplaceV1)
// const _MarketplaceProxy = contract(_artifactsMarketplaceProxy)

function EthereumManager({ web3: _web3 }) {
  if (!_web3) {
    return new Error('Unable to init EthereumManager without web3 object')
  }

  const web3 = _web3
  const MarketplaceV1 = _MarketplaceV1.setProvider(web3)

  console.log(MarketplaceV1)
}

export default EthereumManager
