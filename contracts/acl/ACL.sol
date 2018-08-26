pragma solidity ^0.4.23;

import "./IACL.sol";

/**
* @title ACL
* @dev Access control list permissioning implementation
* @notice v1
*/
contract ACLV1 is IACL {

  address internal productOwner;
  mapping(address => bool) internal authorizedAccounts;

  /**
  * @dev ProductOwnerUpdated event is emitted every time the product owner address is updated
  * @param _oldAddress Old product owner address
  * @param _newAddress New product owner address
  */
  event ProductOwnerUpdated(address _oldAddress, address _newAddress);

  /**
  * @dev AuthorizedAccount event is emitted every time an address is added or removed to the list of authorized accounts
  * @param _authorizedAddress Address of modified authorization
  * @param _hasAccess Boolean value denoting whether the address has added or removed to the authorized account list
  */
  event AuthorizedAccount(address _authorizedAddress, bool _hasAccess);

  /**
  * @dev Constructor function
  */
  constructor() public {
    productOwner = msg.sender;
    emit ProductOwnerUpdated(address(0), msg.sender);
  }

  /**
  * @dev Modifier returns true if sender is product owner
  */
  modifier onlyProductOwner() {
    require(msg.sender == productOwner);
    _;
  }

  /**
  * @dev Modifier returns true if sender is registered as an authorized account
  */
  modifier onlyAuthorized() {
    require(isAuthorized(msg.sender));
    _;
  }

  /**
  * @dev Returns true if the provided address is registered as a product owner
  * @param _sender Address to check for product owner authorization
  */
  function isProductOwner(address _sender) public view returns(bool) {
    return productOwner == _sender;
  }

  /**
  * @dev Returns true if the provided address is registered as an authorized account
  * @param _sender Address to check for authorization
  */
  function isAuthorized(address _sender) public view returns(bool) {
    return _sender == productOwner || authorizedAccounts[_sender] == true;
  }

  /**
  * @dev Updates the product owner address
  * @param _newAddress Value of the new address to be set as product owner
  */
  function updateProductOwner(address _newAddress) public onlyProductOwner {
    address _oldAddress = productOwner;
    productOwner = _newAddress;
    emit ProductOwnerUpdated(_oldAddress, _newAddress);
  }

  /**
  * @dev Adds an address to the list of authorized accounts
  * @param _authorizedAddress Value of the address to be added as authorized account
  */
  function addAuthorization(address _authorizedAddress) public onlyAuthorized {
    authorizedAccounts[_authorizedAddress] = true;
    emit AuthorizedAccount(_authorizedAddress, true);
  }

  /**
  * @dev Removes an address to the list of authorized accounts
  * @param _authorizedAddress Value of the address to be removed as authorized account
  */
  function removeAuthorization(address _authorizedAddress) public onlyAuthorized {
    authorizedAccounts[_authorizedAddress] = false;
    emit AuthorizedAccount(_authorizedAddress, false);
  }

  /**
  * @dev Returns true for contracts that adhere to the ACL interface
  * @return Always returns true for this contract
  */
  function isACL() public pure returns(bool) {
    return true;
  }

}