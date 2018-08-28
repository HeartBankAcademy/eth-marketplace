pragma solidity ^0.4.23;

import "./IMarketplace.sol";
import "../acl/ACLRequiring.sol";
import "../lifecycle/Pausable.sol";
import "../store/IProductStore.sol";

/**
* @title MarketplaceV1
* @dev Marketplace management contract
* @notice v1
*/
contract MarketplaceV1 is ACLRequiring, Pausable, IMarketplace {

  mapping(address => address[]) public stores;
  uint256 public totalStores;

  /**
  * @dev StoreAdded event is emitted every time a store is added to the marketplace
  * @param _owner Store owner address
  * @param _storeAddress Store contract address
  */
  event StoreAdded(address indexed _owner, address indexed _storeAddress);

  /**
  * @dev Constructor function
  * @param _aclAddress Address of ACL contract
  */
  constructor(address _aclAddress) Pausable(_aclAddress) public { }

  /**
  * @dev Performs validation on the given store contract address
  * @param _storeAddress Address of the store contract to validate
  * @return Boolean value representing the validity status of the store
  */
  function isValidStore(address _storeAddress) public pure returns (bool) {
    return IProductStore(_storeAddress).isProductStore();
  }

  /**
  * @dev Adds a store to the marketplace
  * @param _storeAddress Address of the store contract to add
  */
  function addStore(address _storeAddress) public onlyAuthorized whenNotPaused {
    require(isValidStore(_storeAddress));
    stores[msg.sender].push(_storeAddress);
    totalStores++;
    emit StoreAdded(msg.sender, _storeAddress);
  }

  /**
  * @dev Returns the number of stores added to the marketplace by a particular owner
  * @param _owner Owner address to look up
  * @return Number of stores added by the owner to the marketplace
  */
  function storeCountFor(address _owner) public view returns (uint256) {
    return stores[_owner].length;
  }

  /**
  * @dev Returns the store address for a particular owner and index
  * @param _owner Owner address to look up
  * @param _index Index of store address to look up
  * @return Store contract address
  */
  function storeAddressForOwnerWithIndex(address _owner, uint256 _index) public view returns (address) {
    return stores[_owner][_index];
  }

  /**
  * @dev Returns true for contracts that adhere to the Marketplace interface
  * @return Always returns true
  */
  function isMarketplace() public pure returns (bool) { 
    return true;
  }
  
  /**
  * @dev Returns the version of the Marketplace contract interface
  * @return Always returns 1
  */
  function version() public pure returns (uint16) {
    return 1;
  }
  
}