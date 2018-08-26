const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const IACL = artifacts.require('IACL')
const MockACLRequiring = artifacts.require('MockACLRequiring')
const MockACL = artifacts.require('MockACL')
const MockContract = artifacts.require('MockContract')

contract('ACLRequiring', async accounts => {
  let mockAclRequiring, mockACL, mockACL2, mockContract

  before(async () => {
    mockACL = await MockACL.new()
    await mockACL.addAuthorization(accounts[1])

    mockACL2 = await MockACL.new()

    mockAclRequiring = await MockACLRequiring.new(mockACL.address)
    mockContract = await MockContract.new()
  })

  it('should be initialized to the address of an ACL contract', async () => {
    const aclAddress = await mockAclRequiring.acl()
    expect(aclAddress).not.to.equal(address(0))

    const isACL = await IACL.at(aclAddress).isACL()
    expect(isACL).to.equal(true)
  })

  context('when acting as an unauthorized user', async () => {
    it('should throw when accessing functions marked as onlyProductOwner', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.onlyForProductOwner({ from: accounts[2] })
      })
    })

    it('should throw when accessing functions marked as onlyAuthorized', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.onlyForAuthorizedAddress({ from: accounts[2] })
      })
    })
  })

  context('when acting as an authorized user', async () => {
    it('should throw when accessing functions marked as onlyProductOwner', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.onlyForProductOwner({ from: accounts[1] })
      })
    })

    it('should allow me to access functions marked as onlyAuthorized', async () => {
      const result = await mockAclRequiring.onlyForAuthorizedAddress({ from: accounts[1] })
      expect(result).to.equal(true)
    })

    it('should throw when attempting to update the ACL address', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.updateACL(mockACL2.address, { from: accounts[1] })
      })
    })
  })

  context('when acting as the product owner', async () => {
    it('should allow me to access functions marked as onlyProductOwner', async () => {
      const result = await mockAclRequiring.onlyForProductOwner({ from: accounts[0] })
      expect(result).to.equal(true)
    })

    it('should allow me to access functions marked as onlyAuthorized', async () => {
      const result = await mockAclRequiring.onlyForAuthorizedAddress({ from: accounts[0] })
      expect(result).to.equal(true)
    })

    it('it should throw when updating the ACL address with a zero address', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.updateACL(address(0), { from: accounts[0] })
      })
    })

    it('it should throw when updating the ACL address with an account address', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.updateACL(accounts[3], { from: accounts[0] })
      })
    })

    it('it should throw when updating the ACL address to a contract not conforming to IACL', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.updateACL(mockContract.address, { from: accounts[0] })
      })
    })

    it('should throw when updating the ACL address to the same existing ACL address', async () => {
      await assertThrow(async () => {
        await mockAclRequiring.updateACL(mockACL.address, { from: accounts[0] })
      })
    })

    it('it should allow me to update the ACL address', async () => {
      const tx = await mockAclRequiring.updateACL(mockACL2.address, { from: accounts[0] })
      assertEvent(tx, 'ACLUpdated')

      const aclAddress = await mockAclRequiring.acl()
      expect(aclAddress).to.equal(mockACL2.address)
    })
  })
})
