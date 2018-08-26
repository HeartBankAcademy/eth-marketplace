pragma solidity ^0.4.23;

import "../lifecycle/Pausable.sol";

/**
* @title MockPausable
* @dev Mock contract used for Pausable tests
*/
contract MockPausable is Pausable {

  /**
  * @dev Constructor function
  * @param _aclAddress Address of the ACL contract to be used
  */
  constructor(address _aclAddress) Pausable(_aclAddress) public { }
  
  /**
  * @dev Returns true if the contract is paused, otherwise it throws
  * @return Returns true if contract is paused
  */
  function onlyWhenPaused() public view whenPaused returns(bool) {
    return true;
  }

  /**
  * @dev Returns true if the contract is not paused, otherwise it throws
  * @return Returns true if contract is not paused
  */
  function onlyWhenNotPaused() public view whenNotPaused returns(bool) {
    return true;
  }

}