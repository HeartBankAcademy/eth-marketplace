pragma solidity ^0.4.23;

/**
* @title IEternalStorage
* @dev Interface all EternalStorage contracts must implement to publically
*      verify it complies with the EternalStorage contract interface
*/
contract IEternalStorage {

  /**
  * @dev Returns true for contracts that adhere to the EternalStorage interface
  * @return Boolean value identifying contract as implementing the EternalStorage interface
  */
  function isEternalStorage() public pure returns (bool);

}