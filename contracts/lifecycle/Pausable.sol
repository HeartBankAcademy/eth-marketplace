pragma solidity ^0.4.23;

// Adapted from:
// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/ad12381549c4c0711c2f3310e9fb1f65d51c299c/contracts/lifecycle/Pausable.sol

import "../acl/ACLRequiring.sol";

/**
* @title Pausable
* @dev Allows a contract functionality to be paused
* @notice Uses an ACL contract to check for proper authorization to pause/unpause a contract
*/
contract Pausable is ACLRequiring {

  /**
  * @dev The storage position in the contract storage where the implementation address will be stored
  * @notice The implementation value is stored using the 'key-value' nature of the contract storage and
  *         is thus not affected by the contract's state data layout
  */
  bytes32 private constant isPausedStorePosition = keccak256("com.marketplace.pausable.ispaused");

  /**
  * @dev Paused event is emitted every time the contract is paused
  */
  event Paused();

  /**
  * @dev Unpaused event is emitted every time the contract is unpaused
  */
  event Unpaused();

  /**
  * @dev Constructor function
  * @param _aclAddress Address of the ACL contract to be used for authorization purposes
  */
  constructor(address _aclAddress) ACLRequiring(_aclAddress) public { }

  /**
  * @dev Modifier restricts execution by requiring contract to be in an unpaused state
  */
  modifier whenNotPaused() {
    require(isPaused() == false);
    _;
  }

  /**
  * @dev Modifier restricts execution by requiring contract to be in an paused state
  */
  modifier whenPaused() {
    require(isPaused());
    _;
  }

  /**
  * @dev Returns whether the contract is paused
  * @return _isPaused Returns true if the contract is paused
  */
  function isPaused() public view returns(bool _isPaused) {
    bytes32 position = isPausedStorePosition;
    assembly {
      _isPaused := sload(position)
    }
  }

  /**
  * @dev Sets the paused state of the contract
  * @param _isPaused New value of the paused state
  */
  function setIsPaused(bool _isPaused) private {
    bytes32 position = isPausedStorePosition;
    assembly {
      sstore(position, _isPaused)
    }
  }

  /**
  * @dev Pauses the contract execution
  */
  function pause() onlyProductOwner whenNotPaused public {
    setIsPaused(true);
    emit Paused();
  }

  /**
  * @dev Unpauses the contract execution
  */
  function unpause() onlyProductOwner whenPaused public {
    setIsPaused(false);
    emit Unpaused();
  }

}