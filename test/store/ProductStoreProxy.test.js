const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const ACL = artifacts.require('ACLV1')
const ProductStoreProxy = artifacts.require('ProductStoreProxy')
const ProductStore = artifacts.require('ProductStoreV1')
const MockContract = artifacts.require('MockContract')

contract('ProductStoreProxy', async accounts => {
  let acl, proxy, store, mockContract

  before(async () => {
    acl = await ACL.new()
    proxy = await ProductStoreProxy.new(acl.address)
    store = await ProductStore.new()
    mockContract = await MockContract.new()
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

  context('when delegating calls to the implementation', async () => {
    let acl,
      proxy,
      store,
      proxyStore,
      owner = accounts[0]

    beforeEach(async () => {
      acl = await ACL.new()
      proxy = await ProductStoreProxy.new(acl.address)
      store = await ProductStore.new()
      await proxy.upgradeTo(store.address)
      proxyStore = ProductStore.at(proxy.address)
    })

    it('should conform to ProductStore', async () => {
      const isProductStore = await proxyStore.isProductStore()
      expect(isProductStore).to.equal(true)
    })

    it('should have a version number', async () => {
      const version = (await proxyStore.version()).toNumber()
      expect(version).to.equal(1)
    })

    it('is initialized with an empty name', async () => {
      const name = await proxyStore.name()
      expect(name).to.equal('')
    })

    it('is initialized with an empty logo URI', async () => {
      const logoURI = await proxyStore.logoURI()
      expect(logoURI).to.equal('')
    })

    it('is initialized with a product count of zero', async () => {
      const productCount = (await proxyStore.productCount()).toNumber()
      expect(productCount).to.equal(0)
    })

    context('when updating the store name', async () => {
      context('as the owner', async () => {
        it('should update the stored value for the name', async () => {
          await proxyStore.setName('New Test Store', { from: owner })
          const name = await proxyStore.name()
          expect(name).to.equal('New Test Store')
        })

        it('should emit a NameUpdated event', async () => {
          const tx = await proxyStore.setName('Test Store', { from: owner })
          assertEvent(tx, 'NameUpdated')
        })
      })

      context('as a stranger', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyStore.setName('New Invalid Name', { from: accounts[3] })
          })
        })
      })
    })
  })
})
