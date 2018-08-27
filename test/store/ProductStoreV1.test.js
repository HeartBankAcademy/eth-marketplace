const { assertEvent } = require('../helpers/assertEvent')
const { assertThrow } = require('../helpers/assertThrow')
const dateUtils = require('../helpers/dateUtils')
const ProductStoreV1 = artifacts.require('ProductStoreV1')

contract('ProductStoreV1', async accounts => {
  let store, owner

  before(async () => {
    store = await ProductStoreV1.new('Test Store')
    owner = accounts[0]
  })

  it('should conform to ProductStore', async () => {
    const isProductStore = await store.isProductStore()
    expect(isProductStore).to.equal(true)
  })

  it('should have a version number', async () => {
    const version = (await store.version()).toNumber()
    expect(version).to.equal(1)
  })

  it('is properly initialized to the correct name', async () => {
    const name = await store.name()
    expect(name).to.equal('Test Store')
  })

  it('is initialized with an empty logo URI', async () => {
    const logoURI = await store.logoURI()
    expect(logoURI).to.equal('')
  })

  it('is initialized with a product count of zero', async () => {
    const productCount = (await store.productCount()).toNumber()
    expect(productCount).to.equal(0)
  })

  context('when updating the store name', async () => {
    context('as the owner', async () => {
      it('should update the stored value for the name', async () => {
        await store.setName('New Test Store', { from: owner })
        const name = await store.name()
        expect(name).to.equal('New Test Store')
      })

      it('should emit a NameUpdated event', async () => {
        const tx = await store.setName('Test Store', { from: owner })
        assertEvent(tx, 'NameUpdated')
      })
    })

    context('as a stranger', async () => {
      it('should throw', async () => {
        await assertThrow(async () => {
          await store.setName('New Invalid Name', { from: accounts[3] })
        })
      })
    })
  })

  context('when updating the logo URI', async () => {
    context('as the owner', async () => {
      it('should update the stored value for the logo URI', async () => {
        await store.setLogoURI('https://my.logo.png', { from: owner })
        const logoURI = await store.logoURI()
        expect(logoURI).to.equal('https://my.logo.png')
      })

      it('should emit a LogoUpdated event', async () => {
        const tx = await store.setLogoURI('https://my.other.logo.png', { from: owner })
        assertEvent(tx, 'LogoUpdated')
      })
    })

    context('as a stranger', async () => {
      it('should throw', async () => {
        await assertThrow(async () => {
          await store.setLogoURI('https://invalid.logo.png', { from: accounts[3] })
        })
      })
    })
  })

  context('when adding a new product', async () => {
    context('as the owner', async () => {
      context('and using valid data', async () => {
        let store

        beforeEach(async () => {
          store = await ProductStoreV1.new('Test Store')
        })

        it('should increase the product count', async () => {
          await store.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, { from: owner })
          const productCount = (await store.productCount()).toNumber()
          expect(productCount).to.equal(1)
        })

        it('should emit an ArticleUpdated event', async () => {
          const tx = await store.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
            from: owner
          })
          assertEvent(tx, 'ArticleUpdated')
        })

        it('should store the product in storage', async () => {
          await store.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, { from: owner })

          const createdAt = (await store.getCreatedAt(1)).toNumber()
          const updatedAt = (await store.getUpdatedAt(1)).toNumber()
          const createdBy = await store.getCreatedBy(1)
          const updatedBy = await store.getUpdatedBy(1)
          const name = await store.getName(1)
          const description = await store.getDescription(1)
          const imageURI = await store.getImageURI(1)
          const price = (await store.getPrice(1)).toNumber()
          const inventory = (await store.getInventory(1)).toNumber()

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
            await store.addProduct('', 'Test Description', 'https://test.image.uri', 599, 4, {
              from: owner
            })
          })
        })
      })
    })

    context('as a stranger', async () => {
      it('should throw', async () => {
        await assertThrow(async () => {
          await store.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, {
            from: accounts[3]
          })
        })
      })
    })
  })

  context('when retrieving product data', async () => {
    let store

    before(async () => {
      store = await ProductStoreV1.new('Test Store')
      await store.addProduct('Test Product', 'Test Description', 'https://test.image.uri', 599, 4, { from: owner })
    })

    context('and using a valid id', async () => {
      it('should return the correct createdAt value', async () => {
        const createdAt = (await store.getCreatedAt(1)).toNumber()
        expect(createdAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
      })

      it('should return the correct updatedAt value', async () => {
        const updatedAt = (await store.getUpdatedAt(1)).toNumber()
        expect(updatedAt).to.be.within(dateUtils.minutesAgo(4), dateUtils.now())
      })

      it('should return the correct createdBy value', async () => {
        const createdBy = await store.getCreatedBy(1)
        expect(createdBy).to.equal(accounts[0])
      })

      it('should return the correct updatedBy value', async () => {
        const updatedBy = await store.getUpdatedBy(1)
        expect(updatedBy).to.equal(accounts[0])
      })

      it('should return the correct name value', async () => {
        const name = await store.getName(1)
        expect(name).to.equal('Test Product')
      })

      it('should return the correct description value', async () => {
        const description = await store.getDescription(1)
        expect(description).to.equal('Test Description')
      })

      it('should return the correct image URI value', async () => {
        const imageURI = await store.getImageURI(1)
        expect(imageURI).to.equal('https://test.image.uri')
      })

      it('should return the correct price value', async () => {
        const price = (await store.getPrice(1)).toNumber()
        expect(price).to.equal(599)
      })

      it('should return the correct inventory value', async () => {
        const inventory = (await store.getInventory(1)).toNumber()
        expect(inventory).to.equal(4)
      })
    })

    context('and using an ivalid id', async () => {
      it('should throw', async () => {
        await assertThrow(async () => {
          await store.getName(-0.5)
        })

        await assertThrow(async () => {
          await store.getName(0)
        })

        await assertThrow(async () => {
          await store.getName(200)
        })
      })
    })
  })
})
