pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "../models/product/ProductV1.sol";

/**
* @title MockProductV1
* @dev Mock contract used for ProductV1 tests
*/
contract MockProductV1 is ProductV1 {

  /**
  * @dev Performs validation on the given product model
  * @return Boolean value representing the validity status of the product
  */
  function __isValid(
    uint128 _id,
    uint64 _createdAt,
    uint64 _updatedAt,
    address _createdBy,
    address _updatedBy,
    string _name,
    string _description,
    string _imageURI,
    uint128 _price,
    uint128 _inventory
  ) 
    public pure returns(bool)
  {
    ModelV1 memory product = ModelV1({ id: _id,
                                       createdAt: _createdAt,
                                       updatedAt: _updatedAt,
                                       createdBy: _createdBy,
                                       updatedBy: _updatedBy,
                                       name: _name,
                                       description: _description,
                                       imageURI: _imageURI,
                                       price: _price,
                                       inventory: _inventory
                                      });
    return isValid(product);
  }

  /**
  * @dev Key parameters for retrieving data from Eternal Storage
  */
  function __idKey(uint128 _id) public pure returns(bytes32) {
    return idKey(_id);
  }

  function __createdAtKey(uint128 _id) public pure returns(bytes32) {
    return createdAtKey(_id);
  }

  function __updatedAtKey(uint128 _id) public pure returns(bytes32) {
    return updatedAtKey(_id);
  }

  function __createdByKey(uint128 _id) public pure returns(bytes32) {
    return createdByKey(_id);
  }

  function __updatedByKey(uint128 _id) public pure returns(bytes32) {
    return updatedByKey(_id);
  }

  function __nameKey(uint128 _id) public pure returns(bytes32) {
    return nameKey(_id);
  }

  function __descriptionKey(uint128 _id) public pure returns(bytes32) {
    return descriptionKey(_id);
  }

  function __imageURIKey(uint128 _id) public pure returns(bytes32) {
    return imageURIKey(_id);
  }

  function __priceKey(uint128 _id) public pure returns(bytes32) {
    return priceKey(_id);
  }

  function __inventoryKey(uint128 _id) public pure returns(bytes32) {
    return inventoryKey(_id);
  }

  /**
  * @dev ABI encodes the given product
  * @return ABI byte-encoded product model
  */
  function __abiEncode(
    uint128 _id,
    uint64 _createdAt,
    uint64 _updatedAt,
    address _createdBy,
    address _updatedBy,
    string _name,
    string _description,
    string _imageURI,
    uint128 _price,
    uint128 _inventory
  ) public pure returns(bytes)
  {
    ModelV1 memory product = ModelV1({ id: _id,
     createdAt: _createdAt,
     updatedAt: _updatedAt,
     createdBy: _createdBy,
     updatedBy: _updatedBy,
     name: _name,
     description: _description,
     imageURI: _imageURI,
     price: _price,
     inventory: _inventory
    });

    return abiEncode(product);
  }

}