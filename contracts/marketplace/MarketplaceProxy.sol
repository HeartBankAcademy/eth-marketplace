pragma solidity ^0.4.23;

import "./IMarketplace.sol";
import "../proxy/ACLUpgradeableProxy.sol";

/**
* @title MarketplaceProxy
* @dev Proxy contract for Marketplaec implementation
*/
contract MarketplaceProxy is ACLUpgradeableProxy {

  /**
  * @dev Constructor function
  * @param _aclAddress Adress of the ACL contract to be used for permissioning
  */
  constructor(address _aclAddress) ACLUpgradeableProxy(_aclAddress) public { }

  /**
  * @dev Upgrades the contract implementation address
  * @param _newImplementation New contract implementation address
  * @notice New contract implementation must conform to IMarketplace
  */
  function upgradeTo(address _newImplementation) public onlyProductOwner {
    require(IMarketplace(_newImplementation).isMarketplace());
    _upgradeTo(_newImplementation);
  }

}
