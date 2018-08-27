
pragma solidity ^0.4.23;

import "./UpgradeablePausableProxy.sol";

/**
* @title ACLUpgradeableProxy
* @dev Upgradeable proxy that uses ACL to determine rights for implementation contract updates
*/
contract ACLUpgradeableProxy is UpgradeablePausableProxy {

  /**
  * @dev Constructor function
  * @param _aclAddress Adress of the ACL contract to be used for permissioning
  */
  constructor(address _aclAddress) UpgradeablePausableProxy(_aclAddress) public { }

  /**
  * @dev Upgrades the contract implementation address
  * @param _newImplementation New contract implementation address
  * @notice Only authorized to the product owner
  */
  function upgradeTo(address _newImplementation) public onlyProductOwner {
    _upgradeTo(_newImplementation);
  }
  
}
