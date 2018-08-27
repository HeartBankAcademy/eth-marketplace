pragma solidity ^0.4.23;

import "./IEternalStorage.sol";

/**
* @title EternalStorage
* @dev This contract holds all the necessary state variables to carry out the storage of any contract
*/

contract EternalStorage is IEternalStorage {

  /**
  * @dev Contract properties for raw data storage
  */
  mapping(bytes32 => uint256) internal uintStorage;
  mapping(bytes32 => uint128) internal uint128Storage;
  mapping(bytes32 => uint64) internal uint64Storage;
  mapping(bytes32 => string) internal stringStorage;
  mapping(bytes32 => address) internal addressStorage;
  mapping(bytes32 => bytes) internal bytesStorage;
  mapping(bytes32 => bool) internal boolStorage;
  mapping(bytes32 => int256) internal intStorage;
  mapping(bytes32 => int128) internal int128Storage;
  mapping(bytes32 => int64) internal int64Storage;

  /**
  * @dev Returns true for contracts that adhere to the EternalStorage interface 
  * @return Always returns true for this contract
  */
  function isEternalStorage() public pure returns (bool) {
    return true;
  }

}