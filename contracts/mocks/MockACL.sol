pragma solidity ^0.4.23;

import "../acl/IACL.sol";
import "../acl/ACLV1.sol";

/**
* @title MockACL
* @dev Mock contract used for ACL tests
*/
contract MockACL is IACL, ACLV1 {

  /**
  * @dev Returns true for contracts that adhere to the ACL interface
  * @return Always returns true
  */
  function isACL() public pure returns(bool) {
    return true;
  }

}