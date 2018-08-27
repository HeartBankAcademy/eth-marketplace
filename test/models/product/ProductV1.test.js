const web3utils = require('web3-utils')
const dateUtils = require('../../helpers/dateUtils')
const { address } = require('../../helpers/address')
const { encodeProduct } = require('../../helpers/ProductV1')

const MockProductV1 = artifacts.require('MockProductV1')

contract('ProductV1', async accounts => {
  let product

  before(async () => {
    product = await MockProductV1.new()
  })

  it('should have a version number', async () => {
    const version = (await product.version()).toNumber()
    expect(version).to.equal(1)
  })

  context('when validating a product', async () => {
    it('should pass if all properties are valid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        dateUtils.today(),
        accounts[0],
        accounts[0],
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(true)
    })

    it('should fail if the id is invalid', async () => {
      const isValid = await product.__isValid(
        -0.5,
        dateUtils.today(),
        dateUtils.today(),
        accounts[0],
        accounts[0],
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the createdAt date is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        -0.5,
        dateUtils.today(),
        accounts[0],
        accounts[0],
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the updatedAt date is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        -0.5,
        accounts[0],
        accounts[0],
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the createdBy address is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        dateUtils.today(),
        address(0),
        accounts[0],
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the updatedBy address is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        dateUtils.today(),
        accounts[0],
        address(0),
        'Product name',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the name is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        dateUtils.today(),
        accounts[0],
        accounts[0],
        '',
        'Product description',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })

    it('should fail if the description is invalid', async () => {
      const isValid = await product.__isValid(
        1,
        dateUtils.today(),
        dateUtils.today(),
        accounts[0],
        accounts[0],
        'Product name',
        '',
        'Image URI',
        5999,
        3
      )
      expect(isValid).to.equal(false)
    })
  })

  context('when looking up storage keys by product id', async () => {
    const id = 36

    it('should return a valid id key', async () => {
      const idKey = await product.__idKey(id)
      expect(idKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'id' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid createdAt key', async () => {
      const createdAtKey = await product.__createdAtKey(id)
      expect(createdAtKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'createdAt' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid updatedAt key', async () => {
      const updatedAtKey = await product.__updatedAtKey(id)
      expect(updatedAtKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'updatedAt' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid createdBy key', async () => {
      const createdByKey = await product.__createdByKey(id)
      expect(createdByKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'createdBy' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid updatedBy key', async () => {
      const updatedByKey = await product.__updatedByKey(id)
      expect(updatedByKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'updatedBy' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid name key', async () => {
      const nameKey = await product.__nameKey(id)
      expect(nameKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'name' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid description key', async () => {
      const descriptionKey = await product.__descriptionKey(id)
      expect(descriptionKey).to.equal(
        web3utils.soliditySha3(
          { t: 'string', v: 'product' },
          { t: 'string', v: 'description' },
          { t: 'uint128', v: id }
        )
      )
    })

    it('should return a valid imageURI key', async () => {
      const imageURIKey = await product.__imageURIKey(id)
      expect(imageURIKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'imageURI' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid price key', async () => {
      const priceKey = await product.__priceKey(id)
      expect(priceKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'price' }, { t: 'uint128', v: id })
      )
    })

    it('should return a valid inventory key', async () => {
      const inventoryKey = await product.__inventoryKey(id)
      expect(inventoryKey).to.equal(
        web3utils.soliditySha3({ t: 'string', v: 'product' }, { t: 'string', v: 'inventory' }, { t: 'uint128', v: id })
      )
    })
  })

  it('should properly return the ABI encoding for a product', async () => {
    const abiResponse = await product.__abiEncode(
      1,
      dateUtils.today(),
      dateUtils.today(),
      accounts[0],
      accounts[0],
      'Product name',
      'Product description',
      'Image URI',
      5999,
      3
    )

    expect(abiResponse).to.equal(
      encodeProduct({
        id: 1,
        createdAt: dateUtils.today(),
        updatedAt: dateUtils.today(),
        createdBy: accounts[0],
        updatedBy: accounts[0],
        name: 'Product name',
        description: 'Product description',
        imageURI: 'Image URI',
        price: 5999,
        inventory: 3
      })
    )
  })
})
