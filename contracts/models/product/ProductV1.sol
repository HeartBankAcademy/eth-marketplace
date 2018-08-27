pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

/**
* @title Product
* @dev Model for Product data
* @notice v1
*/
contract ProductV1 {

  /**
  * @dev Data model struct
  */
  struct ModelV1 {
    uint128 id; // Must be unique
    uint64 createdAt;
    uint64 updatedAt;
    address createdBy;
    address updatedBy;
    string name;
    string description;
    string imageURI; // Optional
    uint128 price; // Stored in wei
    uint128 inventory;
  }

  /**
  * @dev Performs validation on the given product model
  * @param _product Model struct to be validated
  * @return Boolean value representing the validity status of the product
  */
  function isValid(ModelV1 _product) public pure returns(bool) {
    if (_product.id <= 0) return false;
    if (_product.createdAt <= 0) return false;
    if (_product.updatedAt <= 0) return false;
    if (_product.createdBy == address(0)) return false;
    if (_product.updatedBy == address(0)) return false;
    if (bytes(_product.name).length == 0) return false;
    if (bytes(_product.description).length == 0) return false;
    return true;
  }

  /**
  * @dev Key parameters for retrieving data from Eternal Storage
  */
  function idKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "id", _id));
  }

  function createdAtKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "createdAt", _id));
  }

  function updatedAtKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "updatedAt", _id));
  }

  function createdByKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "createdBy", _id));
  }

  function updatedByKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "updatedBy", _id));
  }

  function nameKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "name", _id));
  }

  function descriptionKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "description", _id));
  }

  function imageURIKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "imageURI", _id));
  }

  function priceKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "price", _id));
  }

  function inventoryKey(uint128 _id) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked("product", "inventory", _id));
  }

  /**
  * @dev ABI encodes the given product
  * @param _product Model struct to be encoded
  * @return ABI byte-encoded product model
  */
  function abiEncode(ModelV1 _product) public pure returns(bytes) {
    return abi.encode(_product);
  }

  /**
  * @dev Returns contract version number
  * @return Returns contract version number
  */
  function version() public pure returns(uint16) {
    return 1;
  }

}
