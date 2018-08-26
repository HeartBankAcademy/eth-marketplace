pragma solidity ^0.4.23;

import "./IProxy.sol";
import "../lifecycle/Pausable.sol";

/**
* @title PausableProxy
* @dev Gives the possibility to delegate any call to a foreign implementation and pause contract execution
*/
contract PausableProxy is IProxy, Pausable {

  /**
  * @dev Constructor function
  * @param _aclAddress Address of the ACL contract to be used for pausing/unpausing authorization
  */
  constructor(address _aclAddress) Pausable(_aclAddress) public { }

  /**
  * @dev Tells the address of the implementation where every delegate call will be delegated
  * @return Address of the implementation to which contract calls will be delegated
  */
  function implementation() public view returns (address);

  /**
  * @dev Fallback function that performs a delegatecall to the given implementation
  * @return This function will return whatever the implementation call returns
  */
  function () payable whenNotPaused public {
    address _implementation = implementation();
    require(_implementation != address(0), "Implementation address not set");

    assembly {
      let ptr := mload(0x40)
      calldatacopy(ptr, 0, calldatasize)
      let result := delegatecall(gas, _implementation, ptr, calldatasize, 0, 0)
      let size := returndatasize
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }

  /**
  * @dev Returns true for contracts that adhere to the Proxy interface 
  * @return Always returns true for this contract
  */
  function isProxy() public pure returns (bool) {
    return true;
  }

}