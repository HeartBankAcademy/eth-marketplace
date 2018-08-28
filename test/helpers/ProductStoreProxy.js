const ACLV1 = artifacts.require('ACLV1')
const ProductStoreV1 = artifacts.require('ProductStoreV1')
const ProductStoreProxy = artifacts.require('./ProductStoreProxy')

const makeProductStore = async () => {
  let acl, store, proxy, proxyStore

  acl = await ACLV1.new()
  store = await ProductStoreV1.new(acl.address)
  proxy = await ProductStoreProxy.new(acl.address)
  await proxy.upgradeTo(store.address)
  proxyStore = ProductStoreV1.at(proxy.address)

  return { acl, store, proxy, proxyStore }
}

module.exports = {
  makeProductStore
}
