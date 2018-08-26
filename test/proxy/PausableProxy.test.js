const { address } = require('../helpers/address')
const { assertThrow, assertRevert } = require('../helpers/assertThrow')

const MockPausableProxy = artifacts.require('MockPausableProxy')
const ACLV1 = artifacts.require('ACLV1')
const MockContract = artifacts.require('MockContract')

contract('PausableProxy', async () => {
  let proxy, acl, mockContract

  before(async () => {
    acl = await ACLV1.new()
    proxy = await MockPausableProxy.new(acl.address)
    mockContract = await MockContract.new()
  })

  it('should conform to IProxy', async () => {
    const isProxy = await proxy.isProxy()
    expect(isProxy).to.equal(true)
  })

  it('should have its ACL contract address set', async () => {
    const aclAddress = await proxy.acl()
    expect(aclAddress).to.equal(acl.address)
  })

  context('when unpaused', async () => {
    before(async () => {
      expect(await proxy.isPaused()).to.not.equal(true)
    })

    context('and when an implementation address is not set', async () => {
      it('should throw when attempting to delegate a function call', async () => {
        await assertThrow(async () => {
          await MockContract.at(proxy.address).isMockContract()
        })
      })
    })

    context('and when an implementation address is set', async () => {
      before(async () => {
        await proxy.setImplementation(mockContract.address)
      })

      it('should have an implementation address correctly set', async () => {
        const implementation = await proxy.implementation()
        expect(implementation).to.equal(mockContract.address)
      })

      it('should delegate all calls to implementing address', async () => {
        const isMockContract = await MockContract.at(proxy.address).isMockContract()
        expect(isMockContract).to.equal(true)

        const someString = await MockContract.at(proxy.address).someString()
        expect(someString).to.equal('MockContract')
      })
    })
  })

  context('when paused', async () => {
    before(async () => {
      await proxy.pause()
      expect(await proxy.isPaused()).to.equal(true)
    })

    it('should throw on every call delegation attempt', async () => {
      await assertThrow(async () => {
        await MockContract.at(proxy.address).isMockContract()
      })
    })
  })
})
