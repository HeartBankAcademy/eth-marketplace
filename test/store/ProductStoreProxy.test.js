const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')
const dateUtils = require('../helpers/dateUtils')
const web3Utils = require('web3-utils')

const ACL = artifacts.require('ACLV1')
const ProductStoreProxy = artifacts.require('ProductStoreProxy')
const ProductStore = artifacts.require('ProductStoreV1')
const MockContract = artifacts.require('MockContract')
const MockProductStore = artifacts.require('MockProductStoreV1')

contract('ProductStoreProxy', async accounts => {
  let acl, proxy, store, mockContract

  before(async () => {
    acl = await ACL.new()
    proxy = await ProductStoreProxy.new(acl.address)
    store = await ProductStore.new(acl.address)
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
      store = await ProductStore.new(acl.address)
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

    context('when updating the logo URI', async () => {
      context('as the owner', async () => {
        it('should update the stored value for the logo URI', async () => {
          await proxyStore.setLogoURI('https://my.logo.png', { from: owner })
          const logoURI = await proxyStore.logoURI()
          expect(logoURI).to.equal('https://my.logo.png')
        })

        it('should emit a LogoUpdated event', async () => {
          const tx = await proxyStore.setLogoURI('https://my.other.logo.png', { from: owner })
          assertEvent(tx, 'LogoUpdated')
        })
      })

      context('as a stranger', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyStore.setLogoURI('https://invalid.logo.png', { from: accounts[3] })
          })
        })
      })
    })

    context('when withdrawing funds', async () => {
      let acl, proxy, store, proxyStore, availableFunds

      beforeEach(async () => {
        acl = await ACL.new()
        proxy = await ProductStoreProxy.new(acl.address)
        store = await MockProductStore.new(acl.address)
        await proxy.upgradeTo(store.address)
        proxyStore = MockProductStore.at(proxy.address)
        availableFunds = Number(web3Utils.toWei('12', 'ether'))
      })

      context('as the owner', async () => {
        context('when funds are available', async () => {
          beforeEach(async () => {
            await proxyStore.deposit({ value: availableFunds })
            const storeFunds = (await web3.eth.getBalance(proxyStore.address)).toNumber()
            expect(storeFunds).to.equal(availableFunds)
          })

          it('should transfer funds to owner account', async () => {
            const ownerInitialBalance = (await web3.eth.getBalance(accounts[0])).toNumber()

            await proxyStore.withdrawFunds()

            const ownerFinalBalance = (await web3.eth.getBalance(accounts[0])).toNumber()
            const storeFinalBalance = (await web3.eth.getBalance(proxyStore.address)).toNumber()

            expect(ownerFinalBalance - ownerInitialBalance).to.be.within(1000, availableFunds)
            expect(storeFinalBalance).to.equal(0)
          })

          it('should emit a FundsWithdrawn event', async () => {
            const tx = await proxyStore.withdrawFunds()
            assertEvent(tx, 'FundsWithdrawn')
          })
        })

        context('when no funds are available', async () => {
          it('should throw', async () => {
            await assertThrow(async () => {
              await proxyStore.withdrawFunds()
            })
          })
        })
      })

      context('as a stranger', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyStore.withdrawFunds({ from: accounts[3] })
          })
        })
      })
    })

    context('when adding a new product', async () => {
      context('as the owner', async () => {
        context('and using valid data', async () => {
          let acl, proxy, store, proxyStore

          beforeEach(async () => {
            acl = await ACL.new()
            proxy = await ProductStoreProxy.new(acl.address)
            store = await ProductStore.new(acl.address)
            await proxy.upgradeTo(store.address)
            proxyStore = ProductStore.at(proxy.address)
          })

          it('should increase the product count', async () => {
            await proxyStore.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
              from: owner
            })
            const productCount = (await proxyStore.productCount()).toNumber()
            expect(productCount).to.equal(1)
          })

          it('should emit an ArticleUpdated event', async () => {
            const tx = await proxyStore.addProduct(
              'Test Product',
              'Test Description',
              'https://test.image.uri',
              599,
              4,
              {
                from: owner
              }
            )
            assertEvent(tx, 'ArticleUpdated')
          })

          it('should store the product in storage', async () => {
            await proxyStore.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
              from: owner
            })

            const createdAt = (await proxyStore.getCreatedAt(1)).toNumber()
            const updatedAt = (await proxyStore.getUpdatedAt(1)).toNumber()
            const createdBy = await proxyStore.getCreatedBy(1)
            const updatedBy = await proxyStore.getUpdatedBy(1)
            const name = await proxyStore.getName(1)
            const description = await proxyStore.getDescription(1)
            const imageURI = await proxyStore.getImageURI(1)
            const price = (await proxyStore.getPrice(1)).toNumber()
            const inventory = (await proxyStore.getInventory(1)).toNumber()

            expect(createdAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
            expect(updatedAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
            expect(createdBy).to.equal(accounts[0])
            expect(updatedBy).to.equal(accounts[0])
            expect(name).to.equal('Test Product')
            expect(description).to.equal('Test Description')
            expect(imageURI).to.equal('https://test.image.uri')
            expect(price).to.equal(599)
            expect(inventory).to.equal(4)
          })
        })

        context('and using invalid data', async () => {
          it('should throw', async () => {
            await assertThrow(async () => {
              await proxyStore.addProduct('', 'Test Description', 'https://test.image.uri', 599, 4, {
                from: owner
              })
            })
          })
        })
      })

      context('as a stranger', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyStore.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
              from: accounts[3]
            })
          })
        })
      })
    })

    context('when retrieving product data', async () => {
      let acl, proxy, store, proxyStore

      before(async () => {
        acl = await ACL.new()
        proxy = await ProductStoreProxy.new(acl.address)
        store = await ProductStore.new(acl.address)
        await proxy.upgradeTo(store.address)
        proxyStore = ProductStore.at(proxy.address)
        await proxyStore.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
          from: owner
        })
      })

      context('and using a valid id', async () => {
        it('should return the correct createdAt value', async () => {
          const createdAt = (await proxyStore.getCreatedAt(1)).toNumber()
          expect(createdAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
        })

        it('should return the correct updatedAt value', async () => {
          const updatedAt = (await proxyStore.getUpdatedAt(1)).toNumber()
          expect(updatedAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
        })

        it('should return the correct createdBy value', async () => {
          const createdBy = await proxyStore.getCreatedBy(1)
          expect(createdBy).to.equal(accounts[0])
        })

        it('should return the correct updatedBy value', async () => {
          const updatedBy = await proxyStore.getUpdatedBy(1)
          expect(updatedBy).to.equal(accounts[0])
        })

        it('should return the correct name value', async () => {
          const name = await proxyStore.getName(1)
          expect(name).to.equal('Test Product')
        })

        it('should return the correct description value', async () => {
          const description = await proxyStore.getDescription(1)
          expect(description).to.equal('Test Description')
        })

        it('should return the correct image URI value', async () => {
          const imageURI = await proxyStore.getImageURI(1)
          expect(imageURI).to.equal('https://test.image.uri')
        })

        it('should return the correct price value', async () => {
          const price = (await proxyStore.getPrice(1)).toNumber()
          expect(price).to.equal(599)
        })

        it('should return the correct inventory value', async () => {
          const inventory = (await proxyStore.getInventory(1)).toNumber()
          expect(inventory).to.equal(4)
        })
      })

      context('and using an ivalid id', async () => {
        it('should throw', async () => {
          await assertThrow(async () => {
            await proxyStore.getName(-0.5)
          })

          await assertThrow(async () => {
            await proxyStore.getName(0)
          })

          await assertThrow(async () => {
            await proxyStore.getName(200)
          })
        })
      })
    })
  })
})
