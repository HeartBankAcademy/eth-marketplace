pragma solidity ^0.4.23;

/**
* @title IProxy
* @dev Interface all Proxy contracts must implement to publically
*      verify it complies with the Proxy contract interface
*/
contract IProxy {

  /**
  * @dev Returns true for contracts that adhere to the Proxy interface
  * @return Boolean value identifying contract as implementing the Proxy interface
  */
  function isProxy() public pure returns (bool);

}