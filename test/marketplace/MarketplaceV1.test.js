const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')
const { makeProductStore } = require('../helpers/ProductStoreProxy')

const ACLV1 = artifacts.require('ACLV1')
const MarketplaceV1 = artifacts.require('MarketplaceV1')
const MockContract = artifacts.require('MockContract')

contract('MarketplaceV1', async accounts => {
  let acl, marketplace, mockContract

  before(async () => {
    acl = await ACLV1.new()
    marketplace = await MarketplaceV1.new(acl.address)
    mockContract = await MockContract.new()
  })

  it('should be initialized with zero stores', async () => {
    const totalStores = (await marketplace.totalStores()).toNumber()
    expect(totalStores).to.equal(0)
  })

  it('should be initialized with zero stores added for current owner', async () => {
    const storeCount = (await marketplace.storeCountFor(accounts[0])).toNumber()
    expect(storeCount).to.equal(0)
  })

  context('when validating stores', async () => {
    context('and using a valid store contract address', async () => {
      it('should pass validation', async () => {
        const contracts = await makeProductStore()
        const isValid = await marketplace.isValidStore(contracts.proxyStore.address)
        expect(isValid).to.equal(true)
      })
    })

    context('and using an invalid address', async () => {
      it('should throw', async () => {
        await assertThrow(async () => {
          await marketplace.isValidStore(accounts[0])
        })

        await assertThrow(async () => {
          await marketplace.isValidStore(mockContract.address)
        })
      })
    })
  })

  context('when adding stores', async () => {
    let acl, marketplace, proxyStore

    beforeEach(async () => {
      acl = await ACLV1.new()
      marketplace = await MarketplaceV1.new(acl.address)
      const contracts = await makeProductStore()
      proxyStore = contracts.proxyStore
    })

    context('as a product owner', async () => {
      context('and using a valid store', async () => {
        it('should add the store to the marketplace', async () => {
          await marketplace.addStore(proxyStore.address)

          const storeCount = (await marketplace.storeCountFor(accounts[0])).toNumber()
          expect(storeCount).to.equal(1)

          const storeAddress = await marketplace.storeAddressForOwnerWithIndex(accounts[0], 0)
          expect(storeAddress).to.equal(proxyStore.address)
        })

        it('should emit the StoreAdded event', async () => {
          const tx = await marketplace.addStore(proxyStore.address)
          assertEvent(tx, 'StoreAdded')
        })

        it('should increase the total number of stores in the marketplace', async () => {
          await marketplace.addStore(proxyStore.address)
          expect((await marketplace.totalStores()).toNumber()).to.equal(1)

          await marketplace.addStore(proxyStore.address)
          expect((await marketplace.totalStores()).toNumber()).to.equal(2)
        })
      })

      context('and using an invalid store', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await marketplace.addStore(mockContract.address)
          })

          await assertThrow(async () => {
            await marketplace.addStore(accounts[7])
          })
        })
      })
    })

    context('as an authorized user', async () => {
      let acl, marketplace, proxyStore

      beforeEach(async () => {
        acl = await ACLV1.new()
        marketplace = await MarketplaceV1.new(acl.address)
        const contracts = await makeProductStore()
        proxyStore = contracts.proxyStore
        await acl.addAuthorization(accounts[5])
      })

      it('should add the store to the marketplace', async () => {
        await marketplace.addStore(proxyStore.address, { from: accounts[5] })

        const storeCount = (await marketplace.storeCountFor(accounts[5])).toNumber()
        expect(storeCount).to.equal(1)

        const storeAddress = await marketplace.storeAddressForOwnerWithIndex(accounts[5], 0)
        expect(storeAddress).to.equal(proxyStore.address)
      })

      it('should emit the StoreAdded event', async () => {
        const tx = await marketplace.addStore(proxyStore.address, { from: accounts[5] })
        assertEvent(tx, 'StoreAdded')
      })

      it('should increase the total number of stores in the marketplace', async () => {
        await marketplace.addStore(proxyStore.address, { from: accounts[5] })
        expect((await marketplace.totalStores()).toNumber()).to.equal(1)

        await marketplace.addStore(proxyStore.address, { from: accounts[5] })
        expect((await marketplace.totalStores()).toNumber()).to.equal(2)
      })
    })

    context('as an unauthorized user', async () => {
      await assertThrow(async () => {
        await marketplace.addStore(proxyStore.address)
      })
    })
  })
})
