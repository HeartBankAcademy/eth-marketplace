pragma solidity ^0.4.23;

// Adapted from:
// https://github.com/zeppelinos/labs/blob/master/upgradeability_using_unstructured_storage/contracts/UpgradeabilityProxy.sol

import "./PausableProxy.sol";
import "./IUpgradeableProxy.sol";
import "../lib/openzeppelin/AddressUtils.sol";

/**
* @title UpgradeablePausableProxy
* @dev A proxy that allows the implementation address to be updated and contract execution to be paused
*/
contract UpgradeablePausableProxy is PausableProxy, IUpgradeableProxy {

  /**
  * @dev Upgraded event is emitted every time the implementation is updated
  * @param _implementation Address of the new implementation contract
  */
  event Upgraded(address indexed _implementation);

  /**
  * @dev The storage position in the contract storage where the implementation address will be stored
  * @notice The implementation value is stored using the 'key-value' nature of the contract storage and
  *         is thus not affected by the contract's state data layout
  */
  bytes32 private constant implementationStorePosition = keccak256("com.marketplace.proxy.implementation");

  /**
  * @dev Constructor function
  */
  constructor(address _aclAddress) PausableProxy(_aclAddress) public { }

  /**
  * @dev Returns the address of the current implementation
  * @return _implementation Address of the current implementation
  */
  function implementation() public view returns (address _implementation) {
    bytes32 position = implementationStorePosition;
    assembly {
      _implementation := sload(position)
    }
  }

  /**
  * @dev Sets the address of the current implementation
  * @param _newImplementation Address of the new implementation to be set
  */
  function setImplementation(address _newImplementation) internal whenNotPaused {
    require(AddressUtils.isContract(_newImplementation), "New implementation address is not a contract");
    
    bytes32 position = implementationStorePosition;
    assembly {
      sstore(position, _newImplementation)
    }
  }

  /**
  * @dev Upgrades the implementation address
  * @param _newImplementation Address of the new implementation to be set
  */
  function _upgradeTo(address _newImplementation) internal whenNotPaused {
    address currentImplementation = implementation();
    require(currentImplementation != _newImplementation, "New implementation address is the same as current address");
    setImplementation(_newImplementation);
    emit Upgraded(_newImplementation);
  }

  /**
  * @dev Upgrades the implementation address
  * @notice Must be overwritten by implemening contracts to report contract version
  */
  function upgradeTo(address /* _newImplementation */) public {
    revert("Function not overwritten by implementing contract");
  }

  /**
  * @dev Returns true for contracts that adhere to the UpgradeableProxy interface 
  * @return Always returns true for this contract
  */
  function isUpgradeable() public pure returns (bool) {
    return true;
  }

}