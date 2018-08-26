const MockContract = artifacts.require('MockContract')

contract('MockContract', async () => {
  let mockContract

  before(async () => {
    mockContract = await MockContract.new()
  })

  it('should return a value when calling the someString() function', async () => {
    const someString = await mockContract.someString()
    expect(someString).to.equal('MockContract')
  })

  it('should return a value when calling the isMockContract() function', async () => {
    const isMockContract = await mockContract.isMockContract()
    expect(isMockContract).to.equal(true)
  })
})
