pragma solidity ^0.4.24;

// Adapted from:
// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/0e65947efbffc592cffea8c2ae9d3b8e11659854/contracts/ownership/Ownable.sol

import "./IOwnableDelegate.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

  address public owner;
  address public ownershipDelegate;

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

    if (ownershipDelegate != address(0)) {
      IOwnableDelegate(ownershipDelegate).didUpdateOwner(address(this), owner, address(0));
    }

    owner = address(0);
    ownershipDelegate = address(0);
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

    if (ownershipDelegate != address(0)) {
      IOwnableDelegate(ownershipDelegate).didUpdateOwner(address(this), owner, _newOwner);
    }

    owner = _newOwner;
  }

  /**
  * @dev Sets the ownserhip delegate contract address
  * @param _ownershipDelegate Address of the ownership delegate contract to set
  * @notice The ownership delegate contract must implement the OwnableDelegate interface
  */
  function setOwnershipDelegate(address _ownershipDelegate) onlyOwner public {
    if (_ownershipDelegate != address(0)) {
      require(IOwnableDelegate(_ownershipDelegate).isOwnableDelegate());
    }
    ownershipDelegate = _ownershipDelegate;
  }

}
