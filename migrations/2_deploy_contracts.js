const ACLV1 = artifacts.require('ACLV1')

const ProductStoreV1 = artifacts.require('ProductStoreV1')
const ProductStoreProxy = artifacts.require('ProductStoreProxy')

const MarketplaceV1 = artifacts.require('MarketplaceV1')
const MarketplaceProxy = artifacts.require('MarketplaceProxy')

module.exports = deployer => {
  deployer.then(async () => {
    // Deploy contracts
    const acl = await deployer.deploy(ACLV1)

    const marketplaceProxy = await deployer.deploy(MarketplaceProxy, acl.address)
    const marketplace = await deployer.deploy(MarketplaceV1, acl.address)
    await marketplaceProxy.upgradeTo(marketplace.address)

    const storeProxy = await deployer.deploy(ProductStoreProxy, acl.address)
    const store = await deployer.deploy(ProductStoreV1, acl.address)
    await storeProxy.upgradeTo(store.address)
  })
}
