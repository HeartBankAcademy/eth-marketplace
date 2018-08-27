pragma solidity ^0.4

/**
* @title IOwnableDelegate
* @dev Interface all OwnableDelegate contracts must implement to publically
*      verify it complies with the OwnableDelegate contract interface
*/
contract IOwnableDelegate {

  /**
  * @dev Function called after the implementing Ownership contract updates the owner address
  * @param _contract Address of Ownserhip contract changed
  * @param _previousOwner Address of previous owner
  * @param _newOwner Address of new owner
  */
  function didUpdateOwner(address _contract, address _previousOwner, address _newOwner) external;

  /**
  * @dev Returns true for contracts that adhere to the OwnableDelegate interface
  * @return Boolean value identifying contract as implementing the OwnableDelegate interface
  */
  function isOwnableDelegate() public pure returns (bool);

}