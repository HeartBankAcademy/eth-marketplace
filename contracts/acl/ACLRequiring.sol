pragma solidity ^0.4.23;

import "../lib/openzeppelin/AddressUtils.sol";
import "../acl/IACL.sol";

/**
* @title ACLRequiring
* @dev Requires an ACL contract and provides authorization modifiers for subclassing contracts
*/
contract ACLRequiring {

  /**
  * @dev ACLUpdated event is emitted every time the ACL contract address is updated
  * @param _oldAddress Old ACL contract address
  * @param _newAddress New ACL contract address
  */
  event ACLUpdated(address indexed _oldAddress, address indexed _newAddress);

  /**
  * @dev The storage position in the contract storage where the implementation address will be stored
  * @notice The implementation value is stored using the 'key-value' nature of the contract storage and
  *         is thus not affected by the contract's state data layout
  */
  bytes32 private constant aclStorePosition = keccak256("com.marketplace.aclrequiring.acl");

  /**
  * @dev Constructor function
  * @param _aclAddress Address of ACL contract
  */
  constructor(address _aclAddress) public {
    setACL(_aclAddress);
    emit ACLUpdated(address(0), _aclAddress);
  }

  /**
  * @dev Modifier restricts access to product owner
  */
  modifier onlyProductOwner() {
    IACL _acl = IACL(acl());
    require(_acl.isProductOwner(msg.sender));
    _;
  }

  /**
  * @dev Modifier restricts access to authorized accounts
  */
  modifier onlyAuthorized() {
    IACL _acl = IACL(acl());
    require(_acl.isAuthorized(msg.sender));
    _;
  }

  /**
  * @dev Returns the value set for the ACL contract
  * @return Address of the ACL contract
  */
  function acl() public view returns (address _acl) {
    bytes32 position = aclStorePosition;
    assembly {
      _acl := sload(position)
    }
  }

  /**
  * @dev Sets the address of the ACL contract
  * @param _newACL Address of the ACL contract to be set
  * @notice This function only verifies that the new address is a contract and conforms to the IACL interface 
  */
  function setACL(address _newACL) private {
    require(AddressUtils.isContract(_newACL), "New ACL address is not a contract");
    require(IACL(_newACL).isACL(), "New ACL address does not conform to IACL interface");

    bytes32 position = aclStorePosition;
    assembly {
      sstore(position, _newACL)
    }
  } 

  /**
  * @dev Updates the address for the ACL contract
  * @param _newAddress Address of the new ACL contract
  **/
  function updateACL(address _newAddress) public onlyProductOwner {
    require(_newAddress != address(0));
    address oldAddress = acl();
    require(_newAddress != oldAddress);
    setACL(_newAddress);
    emit ACLUpdated(oldAddress, _newAddress);
  }

}