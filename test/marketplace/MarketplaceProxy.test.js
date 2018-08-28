const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')
const { makeProductStore } = require('../helpers/ProductStoreProxy')

const ACL = artifacts.require('ACLV1')
const MarketplaceProxy = artifacts.require('MarketplaceProxy')
const MarketplaceV1 = artifacts.require('MarketplaceV1')
const MockContract = artifacts.require('MockContract')

contract('MarketplaceProxy', async accounts => {
  let acl, proxy, marketplace, mockContract

  before(async () => {
    acl = await ACL.new()
    proxy = await MarketplaceProxy.new(acl.address)
    marketplace = await MarketplaceV1.new(acl.address)
    mockContract = await MockContract.new()
  })

  it('is initialized to an empty implementation contract', async () => {
    const implementation = await proxy.implementation()
    expect(implementation).to.equal(address(0))
  })

  context('when upgrading the implementation contract', async () => {
    it('should succeed when using a contract conforming to IMarketplace', async () => {
      await proxy.upgradeTo(marketplace.address)

      const implementation = await proxy.implementation()
      expect(implementation).to.equal(marketplace.address)
    })

    it('should throw when using a contract not conforming to IMarketplace', async () => {
      await assertThrow(async () => {
        await proxy.upgradeTo(mockContract.address)
      })
    })
  })

  context('when delegating calls to the implementation', async () => {
    let acl,
      proxy,
      marketplace,
      proxyMarketplace,
      owner = accounts[0]

    beforeEach(async () => {
      acl = await ACL.new()
      proxy = await MarketplaceProxy.new(acl.address)
      marketplace = await MarketplaceV1.new(acl.address)
      await proxy.upgradeTo(marketplace.address)
      proxyMarketplace = MarketplaceV1.at(proxy.address)
    })

    it('should conform to Marketplace', async () => {
      const isMarketplace = await proxyMarketplace.isMarketplace()
      expect(isMarketplace).to.equal(true)
    })

    it('should have a version number', async () => {
      const version = (await proxyMarketplace.version()).toNumber()
      expect(version).to.equal(1)
    })

    it('should be initialized with zero stores', async () => {
      const totalStores = (await proxyMarketplace.totalStores()).toNumber()
      expect(totalStores).to.equal(0)
    })

    it('should be initialized with zero stores added for current owner', async () => {
      const storeCount = (await proxyMarketplace.storeCountFor(accounts[0])).toNumber()
      expect(storeCount).to.equal(0)
    })

    context('when validating stores', async () => {
      context('and using a valid store contract address', async () => {
        it('should pass validation', async () => {
          const contracts = await makeProductStore()
          const isValid = await proxyMarketplace.isValidStore(contracts.proxyStore.address)
          expect(isValid).to.equal(true)
        })
      })

      context('and using an invalid address', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyMarketplace.isValidStore(accounts[0])
          })

          await assertThrow(async () => {
            await proxyMarketplace.isValidStore(mockContract.address)
          })
        })
      })
    })

    context('when adding stores', async () => {
      let acl, marketplace, proxyMarketplace, proxyStore

      beforeEach(async () => {
        acl = await ACL.new()
        proxy = await MarketplaceProxy.new(acl.address)
        marketplace = await MarketplaceV1.new(acl.address)
        await proxy.upgradeTo(marketplace.address)
        const contracts = await makeProductStore()
        proxyStore = contracts.proxyStore
        proxyMarketplace = MarketplaceV1.at(proxy.address)
      })

      context('as a product owner', async () => {
        context('and using a valid store', async () => {
          it('should add the store to the marketplace', async () => {
            await proxyMarketplace.addStore(proxyStore.address)

            const storeCount = (await proxyMarketplace.storeCountFor(accounts[0])).toNumber()
            expect(storeCount).to.equal(1)

            const storeAddress = await proxyMarketplace.storeAddressForOwnerWithIndex(accounts[0], 0)
            expect(storeAddress).to.equal(proxyStore.address)
          })

          it('should emit the StoreAdded event', async () => {
            const tx = await proxyMarketplace.addStore(proxyStore.address)
            assertEvent(tx, 'StoreAdded')
          })

          it('should increase the total number of stores in the marketplace', async () => {
            await proxyMarketplace.addStore(proxyStore.address)
            expect((await proxyMarketplace.totalStores()).toNumber()).to.equal(1)

            await proxyMarketplace.addStore(proxyStore.address)
            expect((await proxyMarketplace.totalStores()).toNumber()).to.equal(2)
          })
        })

        context('and using an invalid store', async () => {
          it('should throw', async () => {
            await assertThrow(async () => {
              await proxyMarketplace.addStore(mockContract.address)
            })

            await assertThrow(async () => {
              await proxyMarketplace.addStore(accounts[7])
            })
          })
        })
      })

      context('as an authorized user', async () => {
        let acl, marketplace, proxyMarketplace, proxyStore

        beforeEach(async () => {
          acl = await ACL.new()
          proxy = await MarketplaceProxy.new(acl.address)
          marketplace = await MarketplaceV1.new(acl.address)
          await proxy.upgradeTo(marketplace.address)
          const contracts = await makeProductStore()
          proxyStore = contracts.proxyStore
          acl.addAuthorization(accounts[5])
          proxyMarketplace = MarketplaceV1.at(proxy.address)
        })

        it('should add the store to the marketplace', async () => {
          await proxyMarketplace.addStore(proxyStore.address, { from: accounts[5] })

          const storeCount = (await proxyMarketplace.storeCountFor(accounts[5])).toNumber()
          expect(storeCount).to.equal(1)

          const storeAddress = await proxyMarketplace.storeAddressForOwnerWithIndex(accounts[5], 0)
          expect(storeAddress).to.equal(proxyStore.address)
        })

        it('should emit the StoreAdded event', async () => {
          const tx = await proxyMarketplace.addStore(proxyStore.address, { from: accounts[5] })
          assertEvent(tx, 'StoreAdded')
        })

        it('should increase the total number of stores in the marketplace', async () => {
          await proxyMarketplace.addStore(proxyStore.address, { from: accounts[5] })
          expect((await proxyMarketplace.totalStores()).toNumber()).to.equal(1)

          await proxyMarketplace.addStore(proxyStore.address, { from: accounts[5] })
          expect((await proxyMarketplace.totalStores()).toNumber()).to.equal(2)
        })
      })

      context('as an unauthorized user', async () => {
        await assertThrow(async () => {
          await proxyMarketplace.addStore(proxyStore.address)
        })
      })
    })
  })
})
