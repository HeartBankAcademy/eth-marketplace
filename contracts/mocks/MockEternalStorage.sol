pragma solidity ^0.4.23;

import "../storage/EternalStorage.sol";

/**
* @title MockEternalStorage
* @dev Mock contract used for EternalStorage tests
*/
contract MockEternalStorage is EternalStorage {

  /**
  * @dev Returns the bytes32 value for the provided key string
  * @param _key Key value to be encoded as bytes32
  * @return bytes32 encoding of the provided string key
  */
  function keyFor(string _key) internal pure returns(bytes32) {
    return keccak256(abi.encodePacked(_key));
  }

  /* UInt Accessors */
  function storeUInt(string _key, uint256 _value) public {
    uintStorage[keyFor(_key)] = _value;
  }

  function getUInt(string _key) public view returns(uint256) {
    return uintStorage[keyFor(_key)];
  }

  /* UInt128 Accessors */
  function storeUInt128(string _key, uint128 _value) public {
    uint128Storage[keyFor(_key)] = _value;
  }

  function getUInt128(string _key) public view returns(uint128) {
    return uint128Storage[keyFor(_key)];
  }

  /* UInt64 Accessors */
  function storeUInt64(string _key, uint64 _value) public {
    uint64Storage[keyFor(_key)] = _value;
  }

  function getUInt64(string _key) public view returns(uint64) {
    return uint64Storage[keyFor(_key)];
  }

  /* String Accessors */
  function storeString(string _key, string _value) public {
    stringStorage[keyFor(_key)] = _value;
  }

  function getString(string _key) public view returns(string) {
    return stringStorage[keyFor(_key)];
  }

  /* Address Accessors */
  function storeAddress(string _key, address _value) public {
    addressStorage[keyFor(_key)] = _value;
  }

  function getAddress(string _key) public view returns(address) {
    return addressStorage[keyFor(_key)];
  }

  /* Bytes Accessors */
  function storeBytes(string _key, bytes _value) public {
    bytesStorage[keyFor(_key)] = _value;
  }

  function getBytes(string _key) public view returns(bytes) {
    return bytesStorage[keyFor(_key)];
  }

  /* Bool Accessors */
  function storeBool(string _key, bool _value) public {
    boolStorage[keyFor(_key)] = _value;
  }

  function getBool(string _key) public view returns(bool) {
    return boolStorage[keyFor(_key)];
  }

  /* Int Accessors */
  function storeInt(string _key, int256 _value) public {
    intStorage[keyFor(_key)] = _value;
  }

  function getInt(string _key) public view returns(int256) {
    return intStorage[keyFor(_key)];
  }

  /* Int128 Accessors */
  function storeInt128(string _key, int128 _value) public {
    int128Storage[keyFor(_key)] = _value;
  }

  function getInt128(string _key) public view returns(int128) {
    return int128Storage[keyFor(_key)];
  }

  /* Int64 Accessors */
  function storeInt64(string _key, int64 _value) public {
    int64Storage[keyFor(_key)] = _value;
  }

  function getInt64(string _key) public view returns(int64) {
    return int64Storage[keyFor(_key)];
  }

}