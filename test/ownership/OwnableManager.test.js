const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const Ownable = artifacts.require('OwnableManager')
const MockOwnableDelegate = artifacts.require('MockOwnableDelegate')
const MockContract = artifacts.require('MockContract')

contract('OwnableManager', async accounts => {
  let ownable, delegate, mockContract

  const deployContracts = async () => {
    ownable = await Ownable.new()
    delegate = await MockOwnableDelegate.new()
    mockContract = await MockContract.new()
  }

  beforeEach(async () => {
    await deployContracts()
  })

  it('should be initialized with the sender as the contract owner', async () => {
    const owner = accounts[0]
    const _owner = await ownable.owner()
    expect(_owner).to.equal(owner)
  })

  it('should not be initialized with an ownableDelegate by default', async () => {
    const ownableDelegate = await ownable.ownableDelegate()
    expect(ownableDelegate).to.equal(address(0))
  })

  it('should throw when transfering the ownership to an empty address', async () => {
    await assertThrow(async () => {
      await ownable.transferOwnership(address(0))
    })
  })

  context('when acting as the owner', async () => {
    beforeEach(async () => {
      await deployContracts()
    })

    it('should throw when updating the ownableDelegate non implementing IOwnershipDelegate contract', async () => {
      const owner = accounts[0]
      await assertThrow(async () => {
        await ownable.setOwnableDelegate(mockContract.address, { from: owner })
      })
    })

    it('should update the ownableDelegate', async () => {
      await ownable.setOwnableDelegate(delegate.address)
      const ownableDelegate = await ownable.ownableDelegate()
      expect(ownableDelegate).to.equal(delegate.address)
    })

    it('should clear the ownableDelegate', async () => {
      await ownable.setOwnableDelegate(delegate.address)
      expect(await ownable.ownableDelegate()).to.equal(delegate.address)

      await ownable.setOwnableDelegate(address(0))
      const ownableDelegate = await ownable.ownableDelegate()
      expect(ownableDelegate).to.equal(address(0))
    })

    context('when transfering ownership', async () => {
      beforeEach(async () => {
        await deployContracts()
      })

      it('should update the owner', async () => {
        const owner = accounts[0]
        const newOwner = accounts[2]

        await ownable.transferOwnership(newOwner, { from: owner })

        const _owner = await ownable.owner()
        expect(_owner).to.equal(newOwner)
      })

      it('should emit a OwnershipTransfered event', async () => {
        const newOwner = accounts[2]
        const tx = await ownable.transferOwnership(newOwner)
        assertEvent(tx, 'OwnershipTransferred')
      })

      it('should update the delegate', async () => {
        const owner = accounts[0]
        const newOwner = accounts[2]

        await ownable.setOwnableDelegate(delegate.address)
        await ownable.transferOwnership(newOwner)

        const delegateLastContractModified = await delegate.lastContractModified()
        const delegatePreviousOwner = await delegate.previousOwner()
        const delegateNewOwner = await delegate.newOwner()

        expect(delegateLastContractModified).to.equal(ownable.address)
        expect(delegatePreviousOwner).to.equal(owner)
        expect(delegateNewOwner).to.equal(newOwner)
      })
    })

    context('when renoucing ownership', async () => {
      beforeEach(async () => {
        await deployContracts()
      })

      it('should update the owner', async () => {
        await ownable.renounceOwnership()
        const owner = await ownable.owner()
        expect(owner).to.equal(address(0))
      })

      it('should emit a OwnershipRenounced event', async () => {
        const tx = await ownable.renounceOwnership()
        assertEvent(tx, 'OwnershipRenounced')
      })

      it('should update the delegate', async () => {
        const owner = accounts[0]

        await ownable.setOwnableDelegate(delegate.address)
        await ownable.renounceOwnership()

        const delegateLastContractModified = await delegate.lastContractModified()
        const delegatePreviousOwner = await delegate.previousOwner()
        const delegateNewOwner = await delegate.newOwner()

        expect(delegateLastContractModified).to.equal(ownable.address)
        expect(delegatePreviousOwner).to.equal(owner)
        expect(delegateNewOwner).to.equal(address(0))
      })
    })
  })

  context('when acting as a stranger', async () => {
    const stranger = accounts[3]

    beforeEach(async () => {
      await deployContracts()
    })

    it('should throw when updating the owner', async () => {
      await assertThrow(async () => {
        await ownable.transferOwnership(stranger, { from: stranger })
      })
    })

    it('should throw when renouncing ownership', async () => {
      await assertThrow(async () => {
        await ownable.renounceOwnership(stranger, { from: stranger })
      })
    })

    it('should throw when updating the ownableDelegate', async () => {
      await assertThrow(async () => {
        await ownable.setOwnableDelegate(delegate, { from: stranger })
      })
    })
  })
})
