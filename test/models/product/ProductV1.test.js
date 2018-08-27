const ProductV1 = artifacts.require('ProductV1')

contract('ProductV1', async () => {
  let product

  before(async () => {
    product = await ProductV1.new()
  })

  it('should have a version number', async () => {
    const version = (await product.version()).toNumber()
    expect(version).to.equal(1)
  })
})
