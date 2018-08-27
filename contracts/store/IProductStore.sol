pragma solidity ^0.4.23;

contract IProductStore {

  /**
  * @dev Returns the name of the store
  * @return Name of the store
  */
  function name() public view returns(string);

  /**
  * @dev Returns the logo URI of the store
  * @return Logo URI of the store
  */
  function logoURI() public view returns(string);

  /**
  * @dev Returns the total number of products stored
  * @return Total number of products stored
  */
  function productCount() public view returns(uint);

  /**
  * @dev Adds an product to storage if valid
  * @param _name Name of the product
  * @param _description Description of the product
  * @param _imageURI Optional image URI
  * @param _price Price for the product in wei
  * @param _inventory Available inventory to be sold for the product
  * @return Id of the stored product
  */
  function addProduct(
    string _name,
    string _description,
    string _imageURI,
    uint128 _price,
    uint128 _inventory
  ) public returns(uint128);

  /**
  * @dev Returns true for contracts that adhere to the ProductStore interface
  * @return Boolean value identifying contract as implementing the ProductStore interface
  */
  function isProductStore() public pure returns (bool);

  /**
  * @dev Returns the version of the ProductStore contract interface
  * @return Version of the contract interface
  */
  function version() public pure returns (uint16);
  
}