pragma solidity ^0.4.23;

import "./IProductStore.sol";
import "../storage/EternalStorage.sol";
import "../proxy/ACLUpgradeableProxy.sol";

/**
* @title ProductStoreProxy
* @dev Proxy contract for ProductStore implementation
*/
contract ProductStoreProxy is EternalStorage, ACLUpgradeableProxy {

  /**
  * @dev Constructor function
  * @param _aclAddress Adress of the ACL contract to be used for permissioning
  */
  constructor(address _aclAddress) ACLUpgradeableProxy(_aclAddress) public { }

  /**
  * @dev Upgrades the contract implementation address
  * @param _newImplementation New contract implementation address
  * @notice New contract implementation must conform to IProductStore
  */
  function upgradeTo(address _newImplementation) public onlyProductOwner {
    require(IProductStore(_newImplementation).isProductStore());
    _upgradeTo(_newImplementation);
  }

}
