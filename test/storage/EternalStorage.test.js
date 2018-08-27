const { address } = require('../helpers/address')

const EternalStorage = artifacts.require('EternalStorage')
const MockEternalStorage = artifacts.require('MockEternalStorage')

contract('EternalStorage', async () => {
  let eternalStorage, mockEternalStorage

  before(async () => {
    eternalStorage = await EternalStorage.new()
    mockEternalStorage = await MockEternalStorage.new()
  })

  it('should conform to IEternalStorage', async () => {
    const isEternalStorage = await eternalStorage.isEternalStorage()
    expect(isEternalStorage).to.equal(true)
  })

  context('when subclassed', async () => {
    it('should store a UInt', async () => {
      await mockEternalStorage.storeUInt('test', 11111111)
      const value = await mockEternalStorage.getUInt('test')
      expect(value.toNumber()).to.equal(11111111)
    })

    it('should store a UInt128', async () => {
      await mockEternalStorage.storeUInt128('test', 22222222)
      const value = await mockEternalStorage.getUInt128('test')
      expect(value.toNumber()).to.equal(22222222)
    })

    it('should store a UInt64', async () => {
      await mockEternalStorage.storeUInt64('test', 333333333)
      const value = await mockEternalStorage.getUInt64('test')
      expect(value.toNumber()).to.equal(333333333)
    })

    it('should store a String', async () => {
      await mockEternalStorage.storeString('test', 'This is a Test')
      const value = await mockEternalStorage.getString('test')
      expect(value).to.equal('This is a Test')
    })

    it('should store an Address', async () => {
      await mockEternalStorage.storeAddress('test', address(1234))
      const value = await mockEternalStorage.getAddress('test')
      expect(value).to.equal(address(1234))
    })

    it('should store a Bytes value', async () => {
      const bytes = web3.toHex('A test value')
      await mockEternalStorage.storeBytes('test', bytes)
      const value = await mockEternalStorage.getBytes('test')
      expect(value).to.equal(bytes)
    })

    it('should store a Bool', async () => {
      await mockEternalStorage.storeBool('test', true)
      const value = await mockEternalStorage.getBool('test')
      expect(value).to.equal(true)
    })

    it('should store an Int', async () => {
      await mockEternalStorage.storeInt('test', -55555555)
      const value = await mockEternalStorage.getInt('test')
      expect(value.toNumber()).to.equal(-55555555)
    })

    it('should store an Int128', async () => {
      await mockEternalStorage.storeInt128('test', -666666)
      const value = await mockEternalStorage.getInt128('test')
      expect(value.toNumber()).to.equal(-666666)
    })

    it('should store an Int64', async () => {
      await mockEternalStorage.storeInt64('test', -777777)
      const value = await mockEternalStorage.getInt64('test')
      expect(value.toNumber()).to.equal(-777777)
    })
  })
})
