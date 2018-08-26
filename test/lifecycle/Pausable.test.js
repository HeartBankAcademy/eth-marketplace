const { assertRevert, assertThrow } = require('../helpers/assertThrow')
const { assertEvent } = require('../helpers/assertEvent')

const ACLV1 = artifacts.require('ACLV1')
const MockPausable = artifacts.require('MockPausable')

contract('Pausable', async accounts => {
  let pausable, acl

  before(async () => {
    acl = await ACLV1.new()
    pausable = await MockPausable.new(acl.address)
  })

  it('should not not paused upon creation', async () => {
    expect(await pausable.isPaused()).to.equal(false)
  })

  it('should throw when set to paused publically', async () => {
    await assertThrow(async () => {
      await pausable.setIsPaused(false)
    })
  })

  it('should not be set to paused by someone else other than the product owner', async () => {
    await assertRevert(async () => {
      await pausable.pause({ from: accounts[2] })
    })
  })

  it('should not be set to be unpaused by someone else other than the product owner', async () => {
    await assertRevert(async () => {
      await pausable.unpause({ from: accounts[2] })
    })
  })

  context('when unpaused', async () => {
    before(async () => {
      expect(await pausable.isPaused()).to.equal(false)
    })

    it('should only call functions marked as whenNotPaused', async () => {
      expect(await pausable.onlyWhenNotPaused()).to.equal(true)
    })

    it('should not call functions marked as whenPaused', async () => {
      await assertRevert(async () => {
        await pausable.onlyWhenPaused()
      })
    })

    context('when acting as the product owner', async () => {
      it('should throw when attempting to unpause the contract', async () => {
        await assertThrow(async () => {
          await pausable.unpause({ from: accounts[0] })
        })
      })

      it('should allow me to set the contract to paused', async () => {
        const tx = await pausable.pause({ from: accounts[0] })
        assertEvent(tx, 'Paused')
      })
    })
  })

  context('when paused', async () => {
    before(async () => {
      expect(await pausable.isPaused()).to.equal(true)
    })

    it('should only call functions marked as whenPaused', async () => {
      expect(await pausable.onlyWhenPaused()).to.equal(true)
    })

    it('should not call functions marked as whenNotPaused', async () => {
      expect(await pausable.isPaused()).to.equal(true)
      await assertRevert(async () => {
        await pausable.onlyWhenNotPaused()
      })
    })

    context('when acting as the product owner', async () => {
      it('should throw when attempting to pause the contract', async () => {
        await assertThrow(async () => {
          await pausable.pause({ from: accounts[0] })
        })
      })

      it('should allow me to set the contract to unpaused', async () => {
        const tx = await pausable.unpause({ from: accounts[0] })
        assertEvent(tx, 'Unpaused')
      })
    })
  })
})
