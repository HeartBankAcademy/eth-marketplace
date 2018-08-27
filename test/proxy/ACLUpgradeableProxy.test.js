const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const ACLUpgradeableProxy = artifacts.require('ACLUpgradeableProxy')
const ACLV1 = artifacts.require('ACLV1')
const MockContract = artifacts.require('MockContract')

contract('ACLUpgradeableProxy', async accounts => {
  let proxy, acl, mockContract

  before(async () => {
    acl = await ACLV1.new()
    proxy = await ACLUpgradeableProxy.new(acl.address)
    mockContract = await MockContract.new()
  })

  it('should default to an empty address for its implementation contract', async () => {
    const implementation = await proxy.implementation()
    expect(implementation).to.equal(address(0))
  })

  context('when not paused', async () => {
    before(async () => {
      expect(await proxy.isPaused()).to.equal(false)
    })

    context('when an implementation address is not set', async () => {
      before(async () => {
        expect(await proxy.implementation()).to.equal(address(0))
      })

      it('should throw when attempting to perform a delegatecall', async () => {
        await assertThrow(async () => {
          await MockContract.at(proxy.address).isMockContract()
        })
      })
    })

    context('when acting as an unathorized user', async () => {
      it('should throw when attempting to set an implementation address', async () => {
        await assertThrow(async () => {
          await proxy.upgradeTo(mockContract.address, { from: accounts[1] })
        })
      })
    })

    context('when acting as the product owner', async () => {
      it('should throw when attempting to set an implementation address to a non-contract address', async () => {
        await assertThrow(async () => {
          await proxy.upgradeTo(accounts[2], { from: accounts[0] })
        })
      })

      it('should allow me to set an implementation addres', async () => {
        const tx = await proxy.upgradeTo(mockContract.address, { from: accounts[0] })
        assertEvent(tx, 'Upgraded')

        const implementation = await proxy.implementation()
        expect(implementation).to.equal(mockContract.address)
      })
    })

    context('when an implementation address is set', async () => {
      before(async () => {
        const implementation = await proxy.implementation()
        if (implementation != mockContract.address) await proxy.upgradeTo(mockContract.address, { from: accounts[0] })
      })

      it('should should perform a delegatecall', async () => {
        const isMock = await MockContract.at(proxy.address).isMockContract()
        expect(isMock).to.equal(true)

        const someString = await MockContract.at(proxy.address).someString()
        expect(someString).to.equal('MockContract')
      })

      it('should throw when attempting to upgrade to the same implementation address', async () => {
        await assertThrow(async () => {
          await proxy.upgradeTo(mockContract.address, { from: accounts[0] })
        })
      })
    })
  })

  context('when paused', async () => {
    before(async () => {
      await proxy.pause()
    })

    context('when acting as an unathorized user', async () => {
      it('should throw when attempting to set an implementation address', async () => {
        await assertThrow(async () => {
          await proxy.upgradeTo(mockContract.address, { from: accounts[1] })
        })
      })
    })

    context('when acting as the product owner', async () => {
      it('should throw when attempting to set an implementation address', async () => {
        await assertThrow(async () => {
          await proxy.upgradeTo(mockContract.address, { from: accounts[0] })
        })
      })
    })

    context('when an implementation address is set', async () => {
      before(async () => {
        const implementation = await proxy.implementation()
        if (implementation != mockContract.address) await proxy.upgradeTo(mockContract.address, { from: accounts[0] })
      })

      it('should throw when attempting to perform a delegatecall', async () => {
        await assertThrow(async () => {
          await MockContract.at(proxy.address).isMockContract()
        })
      })
    })
  })
})
