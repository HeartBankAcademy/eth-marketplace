const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')

const ACL = artifacts.require('ACLV1')
const ProductStoreProxy = artifacts.require('ProductStoreProxy')
const ProductStore = artifacts.require('ProductStoreV1')
const MockContract = artifacts.require('MockContract')
const MockNonProductStore = artifacts.require('MockNonProductStore')

contract('ProductStoreProxy', async accounts => {
  let acl, proxy, store, mockContract, mockNonProductStore

  before(async () => {
    acl = await ACL.new()
    proxy = await ProductStoreProxy.new(acl.address)
    store = await ProductStore.new('Test Store')
    mockContract = await MockContract.new()
    mockNonProductStore = await MockNonProductStore.new()
  })

  it('is initialized to an empty implementation contract', async () => {
    const implementation = await proxy.implementation()
    expect(implementation).to.equal(address(0))
  })

  context('when upgrading the implementation contract', async () => {
    it('should succeed when using a contract conforming to IProductStore', async () => {
      await proxy.upgradeTo(store.address)

      const implementation = await proxy.implementation()
      expect(implementation).to.equal(store.address)
    })

    it('should throw when using a contract not conforming to IProductStore', async () => {
      await assertThrow(async () => {
        await proxy.upgradeTo(mockContract.address)
      })
    })
  })
})
