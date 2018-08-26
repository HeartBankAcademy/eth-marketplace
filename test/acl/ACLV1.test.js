const { assertRevert } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const ACLV1 = artifacts.require('ACLV1')

contract('ACLV1', async accounts => {
  let acl

  before(async () => {
    acl = await ACLV1.new()
    await acl.addAuthorization(accounts[1])
  })

  it('should implement the IACL interface', async () => {
    const isACL = await acl.isACL()
    expect(isACL).to.equal(true)
  })

  it('should have a product owner set to its creator', async () => {
    expect(await acl.isProductOwner(accounts[0])).to.equal(true)
  })

  it('should handle the product owner as an authorized address', async () => {
    expect(await acl.isAuthorized(accounts[0])).to.equal(true)
  })

  context('when acting as an unauthorized user', async () => {
    it('should throw when attempting to update the product owner', async () => {
      await assertRevert(async () => {
        await acl.updateProductOwner(accounts[7], { from: accounts[7] })
      })
    })

    it('should throw when attempting to add an authorized address', async () => {
      await assertRevert(async () => {
        await acl.addAuthorization(accounts[8], { from: accounts[7] })
      })
    })

    it('should throw when attempting to remove an authorized address', async () => {
      await assertRevert(async () => {
        await acl.removeAuthorization(accounts[0], { from: accounts[7] })
      })
    })
  })

  context('when acting as an authorized address', async () => {
    it('should allow me to add another authorized address', async () => {
      const tx = await acl.addAuthorization(accounts[2], { from: accounts[1] })
      assertEvent(tx, 'AuthorizedAccount')

      expect(await acl.isAuthorized(accounts[2])).to.equal(true)
    })

    it('should allow me to remove another authorized user', async () => {
      const tx = await acl.removeAuthorization(accounts[2], { from: accounts[2] })
      assertEvent(tx, 'AuthorizedAccount')

      expect(await acl.isAuthorized(accounts[2])).to.equal(false)
    })
  })

  context('when acting as the product owner', async () => {
    it('should me to add an authorized address', async () => {
      const tx = await acl.addAuthorization(accounts[4])
      assertEvent(tx, 'AuthorizedAccount')

      expect(await acl.isAuthorized(accounts[4])).to.equal(true)
    })

    it('should me to remove an authorized address', async () => {
      const tx = await acl.removeAuthorization(accounts[4])
      assertEvent(tx, 'AuthorizedAccount')

      expect(await acl.isAuthorized(accounts[4])).to.equal(false)
    })

    it('should allow me to update the product owner', async () => {
      const tx = await acl.updateProductOwner(accounts[3])
      assertEvent(tx, 'ProductOwnerUpdated')

      expect(await acl.isProductOwner(accounts[0])).to.equal(false)
      expect(await acl.isProductOwner(accounts[3])).to.equal(true)
    })
  })
})
