const { address } = require('../helpers/address')
const { assertThrow, assertRevert } = require('../helpers/assertThrow')

const UpgradeablePausableProxy = artifacts.require('UpgradeablePausableProxy')
const ACLV1 = artifacts.require('ACLV1')
const MockContract = artifacts.require('MockContract')
const MockUpgradeablePausableProxy = artifacts.require('MockUpgradeablePausableProxy')

contract('UpgradeablePausableProxy', async accounts => {
  let proxy, mockProxy, acl, mockContract, mockContract2

  before(async () => {
    acl = await ACLV1.new()
    proxy = await UpgradeablePausableProxy.new(acl.address)
    mockProxy = await MockUpgradeablePausableProxy.new(acl.address)
    mockContract = await MockContract.new()
    mockContract2 = await MockContract.new()
  })

  it('should conform to IProxy', async () => {
    const isProxy = await proxy.isProxy()
    expect(isProxy).to.equal(true)
  })

  it('should conform to IUpgradeableProxy', async () => {
    const isUpgradeable = await proxy.isUpgradeable()
    expect(isUpgradeable).to.equal(true)
  })

  it('should have its ACL contract address set', async () => {
    const aclAddress = await proxy.acl()
    expect(aclAddress).to.equal(acl.address)
  })

  it('should default to an empty address for its implementation contract', async () => {
    const implementation = await proxy.implementation()
    expect(implementation).to.equal(address(0))
  })

  context('when not subclassed', async () => {
    it('should throw when upgrading the implementation address', async () => {
      await assertRevert(async () => {
        await proxy.upgradeTo(mockContract.address)
      })
    })
  })

  context('when subclassed', async () => {
    context('and unpaused', async () => {
      before(async () => {
        expect(await mockProxy.isPaused()).to.not.equal(true)
        expect(await mockProxy.implementation()).to.equal(address(0))
      })

      it('should upgrade the implementation address when calling upgradeTo', async () => {
        await mockProxy.upgradeTo(mockContract.address)
        const implementation = await mockProxy.implementation()
        expect(implementation).to.equal(mockContract.address)
      })

      it('should throw when upgrading the implementation to the currently defined address', async () => {
        const oldImplementation = await mockProxy.implementation()
        expect(oldImplementation).to.equal(mockContract.address)
        await assertThrow(async () => {
          await mockProxy.upgradeTo(oldImplementation)
        })
      })

      it('should throw when upgrading the implementation to an empty address', async () => {
        await assertThrow(async () => {
          await mockProxy.upgradeTo(address(0))
        })
      })

      it('should throw when upgrading the implementation to a non-contract address', async () => {
        await assertThrow(async () => {
          await mockProxy.upgradeTo(accounts[0])
        })
      })
    })

    context('and paused', async () => {
      before(async () => {
        await mockProxy.pause()
        expect(await mockProxy.isPaused()).to.equal(true)
        expect(await mockProxy.implementation()).to.equal(mockContract.address)
      })

      it('should throw when atteming to upgrade the implementation address', async () => {
        await assertThrow(async () => {
          await mockProxy.upgradeTo(mockContract2.address)
        })
      })

      it('it should throw when attempting to delegate calls to implementing address', async () => {
        await assertThrow(async () => {
          await MockContract.at(mockProxy.address).isMockContract()
        })
      })
    })
  })
})
