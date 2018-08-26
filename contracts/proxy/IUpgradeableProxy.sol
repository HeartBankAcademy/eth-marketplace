pragma solidity ^0.4.23;

/**
* @title IUpgradeableProxy
* @dev Interface all UpgradeableProxy contracts must implement to publically
*      verify it complies with the UpgradeableProxy contract interface
*/
contract IUpgradeableProxy {

  /**
  * @dev Upgrades the implementation contract address
  * @param _newImplementation Address of the new implementation to be set
  */
  function upgradeTo(address _newImplementation) public;

  /**
  * @dev Returns true if the implementing contract complies with the UpgradeableProxy interface
  * @return Boolean value identifying contract as implementing the UpgradeableProxy interface
  */
  function isUpgradeable() public pure returns (bool);

}