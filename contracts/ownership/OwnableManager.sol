pragma solidity ^0.4.24;

// Adapted from:
// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/0e65947efbffc592cffea8c2ae9d3b8e11659854/contracts/ownership/Ownable.sol

import "./IOwnableDelegate.sol";

/**
 * @title OwnableManager
 * @dev The OwnableManager contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract OwnableManager {

  address public owner;
  address public ownableDelegate;

  /**
  * @dev OwnershipTransferred is emitted after the ownership of this contract has been renounced
  * @param _previousOwner Old product owner address
  */
  event OwnershipRenounced(address indexed _previousOwner);

  /**
  * @dev OwnershipTransferred event is emitted every time the owner address is updated
  * @param _oldAddress Old owner address
  * @param _newAddress New owner address
  */
  event OwnershipTransferred(
    address indexed _oldAddress,
    address indexed _newAddress
  );

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract
   * @notice Renouncing to ownership will leave the contract without an owner
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    updateOwnableDelegate(owner, address(0));
    owner = address(0);
    ownableDelegate = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner
   * @param _newOwner The address to transfer ownership to
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner
   * @param _newOwner The address to transfer ownership to
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    updateOwnableDelegate(owner, _newOwner);
    owner = _newOwner;
  }

  /**
  * @dev Sets the ownable delegate contract address
  * @param _ownableDelegate Address of the ownable delegate contract to set
  * @notice The ownable delegate contract must implement the OwnableDelegate interface
  */
  function setOwnableDelegate(address _ownableDelegate) onlyOwner public {
    if (_ownableDelegate != address(0)) {
      require(IOwnableDelegate(_ownableDelegate).isOwnableDelegate());
    }
    ownableDelegate = _ownableDelegate;
  }

  /**
  * @dev Calls didUpdateOwner on the ownable delegate contract
  * @param _previousOwner Previous owner address
  * @param _newOwner New owner address
  */
  function updateOwnableDelegate(address _previousOwner, address _newOwner) internal {
    if (ownableDelegate != address(0)) {
      IOwnableDelegate(ownableDelegate).didUpdateOwner(address(this), _previousOwner, _newOwner);
    }
  }
  
}
