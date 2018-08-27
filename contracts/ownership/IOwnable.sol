pragma solidity ^0.4.23;

/**
* @title IOwnable
* @dev Interface all IOwnable contracts must implement to publically
*      verify it complies with the IOwnable contract interface
*/
contract IOwnable {

  /**
  * @dev Returns the address of the current owner
  * @return _owner Address of the current owner
  */
  function owner() public view returns (address _owner);

  /**
  * @dev Returns true for contracts that adhere to the IOwnable interface
  * @return Boolean value identifying contract as implementing the IOwnable interface
  */
  function isOwnable() public pure returns (bool);

}