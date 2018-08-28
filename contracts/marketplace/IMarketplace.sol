pragma solidity ^0.4.23;

/**
* @title IMarketplace
* @dev Interface all Marketplace contracts must implement to publically
*      verify it complies with the Marketplace contract interface
*/
contract IMarketplace {

  /**
  * @dev Adds a store to the marketplace
  * @param _storeAddress Address of the store contract to add
  */
  function addStore(address _storeAddress) public;

  /**
  * @dev Returns the number of stores added to the marketplace by a particular owner
  * @param _owner Owner address to look up
  * @return Number of stores added by the owner to the marketplace
  */
  function storeCountFor(address _owner) public view returns (uint256);

  /**
  * @dev Returns the store address for a particular owner and index
  * @param _owner Owner address to look up
  * @param _index Index of store address to look up
  * @return Store contract address
  */
  function storeAddressForOwnerWithIndex(address _owner, uint256 _index) public view returns (address);
  
  /**
  * @dev Returns true for contracts that adhere to the Marketplace interface
  * @return Boolean value identifying contract as implementing the Marketplace interface
  */
  function isMarketplace() public pure returns (bool);

  /**
  * @dev Returns the version of the Marketplace contract interface
  * @return Version of the contract interface
  */
  function version() public pure returns (uint16);

}