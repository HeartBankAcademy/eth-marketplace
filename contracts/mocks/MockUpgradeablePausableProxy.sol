pragma solidity ^0.4.23;

import "../proxy/UpgradeablePausableProxy.sol";

/**
* @title MockUpgradeablePausableProxy
* @dev Mock contract used for UpgradeablePausableProxy tests
*/
contract MockUpgradeablePausableProxy is UpgradeablePausableProxy {

  /**
  * @dev Constructor function
  * @param _aclAddress Address of ACL contract to be used
  */
  constructor(address _aclAddress) UpgradeablePausableProxy(_aclAddress) public { }

  /**
  * @dev Upgrades the implementation address
  * @param _newImplementation Address of the new implementation contract to upgrade to
  */
  function upgradeTo(address _newImplementation) public {
    _upgradeTo(_newImplementation);
  }

}