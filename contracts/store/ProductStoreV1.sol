pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "../ownership/OwnableManager.sol";
import "../storage/EternalStorage.sol";
import "./IProductStore.sol";
import "../models/product/ProductV1.sol";

/**
* @title ProductStore
* @dev Store contract implementation
* @notice v1
*/
contract ProductStoreV1 is OwnableManager, EternalStorage, IProductStore, ProductV1 { 
  
  string internal _name;
  string internal _logoURI;
  uint128 internal _productCount;
  
  /**
  * @dev ArticleUpdated is emited when a product is added or modified from storage
  * @param _id The product id
  * @param _updatedAt The timestamp when the update was processed
  * @param _updatedBy Address of the account that performed the update
  * @param _modelVersion The product model version for the struct
  * @param _data The abi-encoded product model
  */
  event ArticleUpdated(
    uint128 indexed _id,
    uint64 indexed _updatedAt,
    address indexed _updatedBy,
    uint16 _modelVersion,
    bytes _data
  );

  /**
  * @dev NameUpdated is emited when the store name is updated
  * @param _oldName Old store name
  * @param _newName New store name
  */
  event NameUpdated(string _oldName, string _newName);

  /**
  * @dev LogoUpdated is emited when the store logo URI is updated
  * @param _oldLogoURI Old store logo URI
  * @param _newLogoURI New store logo URI
  */
  event LogoUpdated(string _oldLogoURI, string _newLogoURI);

  /**
  * @dev Constructor function
  * @param __name Name of the store
  */
  constructor(string __name) public {
    _name = __name;
  }

  /**
  * @dev Modifier to check if the provided id parameter is valid
  * @param _id Id pertaining to an Product model
  */
  modifier requiresValidId(uint128 _id) {
    require(_id > 0, "Invalid Id");
    require(_id <= productCount(), "Invalid Id");
    _;
  }

  //-- Contract Getters

  /**
  * @dev Returns the store name
  * @return Store name
  */
  function name() public view returns(string) {
    return _name;
  }

  /**
  * @dev Returns a URI for the store logo
  * @return URI for the store logo
  * @notice This is an optional value and thus might return an empty string
  */
  function logoURI() public view returns(string) {
    return _logoURI;
  }

  /**
  * @dev Returns the total number of products stored
  * @return Total number of products stored
  */
  function productCount() public view returns(uint) {
    return _productCount;
  }

  //-- Contract Setters

  /**
  * @dev Sets the store name
  * @param __name Name of the store
  */
  function setName(string __name) public onlyOwner {
    emit NameUpdated(_name, __name);
    _name = __name;
  }

  /**
  * @dev Sets the store logo
  * @param __logoURI URI for the store logo
  */
  function setLogoURI(string __logoURI) public onlyOwner {
    emit LogoUpdated(_logoURI, __logoURI);
    _logoURI = __logoURI;
  }

  /**
  * @dev Adds an product to storage if valid
  * @param __name Name of the product
  * @param __description Description of the product
  * @param __imageURI Optional image URI
  * @param __price Price for the product in wei
  * @param __inventory Available inventory to be sold for the product
  * @return Id of the stored product
  */
  function addProduct(
    string __name,
    string __description,
    string __imageURI,
    uint128 __price,
    uint128 __inventory
  )
    public onlyOwner returns(uint128)
  {
    uint128 id = _productCount + 1;

    // solium-disable-next-line security/no-block-members
    uint64 timestamp = uint64(block.timestamp);

    ModelV1 memory product = ModelV1({ id: id,
                                       createdAt: timestamp,
                                       updatedAt: timestamp,
                                       createdBy: msg.sender,
                                       updatedBy: msg.sender,
                                       name: __name,
                                       description: __description,
                                       imageURI: __imageURI,
                                       price: __price,
                                       inventory: __inventory
                                      });
    
    storeProduct(product);
    _productCount++;

    emit ArticleUpdated(product.id,
                        product.updatedAt,
                        product.updatedBy,
                        ProductV1(this).version(),
                        abiEncode(product));
  }

  /**
  * @dev Validates the given product and stores it in Eternal Storage
  * @param _product Product model struct to store
  */
  function storeProduct(ModelV1 _product) internal {
    require(isValid(_product), "Product model is invalid");
    uint128Storage[idKey(_product.id)] = _product.id;
    uint64Storage[createdAtKey(_product.id)] = _product.createdAt;
    uint64Storage[updatedAtKey(_product.id)] = _product.updatedAt;
    addressStorage[createdByKey(_product.id)] = _product.createdBy;
    addressStorage[updatedByKey(_product.id)] = _product.updatedBy;
    stringStorage[nameKey(_product.id)] = _product.name;
    stringStorage[descriptionKey(_product.id)] = _product.description;
    stringStorage[imageURIKey(_product.id)] = _product.imageURI;
    uint128Storage[priceKey(_product.id)] = _product.price;
    uint128Storage[inventoryKey(_product.id)] = _product.inventory;
  }

  //-- Utility functions for retrieving data from Eternal Storage for a Product

  /**
  * @dev Returns the createdAt value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getCreatedAt(uint128 _id) public view requiresValidId(_id) returns(uint64) {
    return uint64Storage[createdAtKey(_id)];
  } 

  /**
  * @dev Returns the updatedAt value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getUpdatedAt(uint128 _id) public view requiresValidId(_id) returns(uint64) {
    return uint64Storage[updatedAtKey(_id)];
  } 

  /**
  * @dev Returns the createdBy value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getCreatedBy(uint128 _id) public view requiresValidId(_id) returns(address) {
    return addressStorage[createdByKey(_id)];
  } 

  /**
  * @dev Returns the updatedBy value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getUpdatedBy(uint128 _id) public view requiresValidId(_id) returns(address) {
    return addressStorage[updatedByKey(_id)];
  } 

  /**
  * @dev Returns the name value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getName(uint128 _id) public view requiresValidId(_id) returns(string) {
    return stringStorage[nameKey(_id)];
  } 

  /**
  * @dev Returns the description value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getDescription(uint128 _id) public view requiresValidId(_id) returns(string) {
    return stringStorage[descriptionKey(_id)];
  }

  /**
  * @dev Returns the image URI value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getImageURI(uint128 _id) public view requiresValidId(_id) returns(string) {
    return stringStorage[imageURIKey(_id)];
  }

  /**
  * @dev Returns the price value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getPrice(uint128 _id) public view requiresValidId(_id) returns(uint128) {
    return uint128Storage[priceKey(_id)];
  } 

  /**
  * @dev Returns the inventory value for a given product id
  * @param _id Product id to be used for lookup
  */
  function getInventory(uint128 _id) public view requiresValidId(_id) returns(uint128) {
    return uint128Storage[inventoryKey(_id)];
  } 

  /**
  * @dev Returns true for contracts that adhere to the ProductStore interface
  * @return Always returns true for this contract
  */
  function isProductStore() public pure returns (bool) {
    return true;
  }

  /**
  * @dev Returns the version of the ProductStore contract interface
  * @return Version of the contract interface
  */
  function version() public pure returns (uint16) { 
    return 1;
  }

}
