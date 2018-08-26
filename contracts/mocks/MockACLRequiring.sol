pragma solidity ^0.4.23;

import "../acl/ACLRequiring.sol";

/**
* @title MockACLRequiring
* @dev Mock contract used for ACLRequiring tests
*/
contract MockACLRequiring is ACLRequiring {

  /**
  * @dev Constructor function
  * @param _aclAddress Address of the ACL contract to be used
  */
  constructor(address _aclAddress) ACLRequiring(_aclAddress) public { }

  /**
  * @dev Returns true if the sender is the product owner, otherwise it throws
  * @return Returns true if sender is the product owner
  */
  function onlyForProductOwner() onlyProductOwner public view returns(bool) {
    return true;
  }

  /**
  * @dev Returns true if the sender is an authorized account, otherwise it throws
  * @return Returns true if sender is an authorized account
  */
  function onlyForAuthorizedAddress() onlyAuthorized public view returns(bool) {
    return true;
  }

}