pragma solidity ^0.4.23;

// Adapted from:
// https://github.com/zeppelinos/labs/blob/39d86204ac57a4a24d5b1e6e39e05fcb796efd84/upgradeability_using_unstructured_storage/contracts/Proxy.sol

import "./IProxy.sol";

/**
* @title Proxy
* @dev Gives the possibility to delegate any call to a foreign implementation
*/
contract Proxy is IProxy {

  /**
  * @dev Tells the address of the implementation where every delegate call will be delegated
  * @return Address of the implementation to which contract calls will be delegated
  */
  function implementation() public view returns (address);

  /**
  * @dev Fallback function that performs a delegatecall to the given implementation
  * @return This function will return whatever the implementation call returns
  */
  function () payable public {
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