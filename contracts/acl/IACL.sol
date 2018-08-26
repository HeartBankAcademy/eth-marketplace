pragma solidity ^0.4.23;

/**
* @title IACL
* @dev Interface all ACL contracts must implement
*/
contract IACL {

  /**
  * @dev Returns true if the provided address is registered as a product owner
  * @param _sender Address to check for product owner authorization
  */
  function isProductOwner(address _sender) public view returns(bool);

  /**
  * @dev Returns true if the provided address is registered as an authorized account
  * @param _sender Address to check for authorization
  */
  function isAuthorized(address _sender) public view returns(bool);

  /**
  * @dev Returns true for contracts that adhere to the ACL interface
  * @return Boolean value identifying contract as implementing the ACL interface
  */
  function isACL() public pure returns(bool);

}