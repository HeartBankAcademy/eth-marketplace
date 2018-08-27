const abi = require('web3-eth-abi')

const ProductABI = {
  ModelV1: {
    id: 'uint128',
    createdAt: 'uint64',
    updatedAt: 'uint64',
    createdBy: 'address',
    updatedBy: 'address',
    name: 'string',
    description: 'string',
    imageURI: 'string',
    price: 'uint128',
    inventory: 'uint128'
  }
}

const encodeProduct = properties => {
  return abi.encodeParameter(ProductABI, properties)
}

module.exports = {
  encodeProduct
}
