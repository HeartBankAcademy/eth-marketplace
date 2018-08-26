const { address } = require('../helpers/address')
const { assertThrow } = require('../helpers/assertThrow')

const MockProxy = artifacts.require('MockProxy')
const MockContract = artifacts.require('MockContract')

contract('Proxy', async () => {
  let proxy, mockContract

  before(async () => {
    proxy = await MockProxy.new()
    mockContract = await MockContract.new()
  })

  it('should conform to IProxy interface', async () => {
    const isProxy = await proxy.isProxy()
    expect(isProxy).to.equal(true)
  })

  it('should default to an empty address for its implementation contract', async () => {
    const implementation = await proxy.implementation()
    expect(implementation).to.equal(address(0))
  })

  context('when an implementation address is not set', async () => {
    it('should throw when attempting to delegate a function call', async () => {
      await assertThrow(async () => {
        await MockContract.at(proxy.address).isMockContract()
      })
    })
  })

  context('when an implementation address is set', async () => {
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
