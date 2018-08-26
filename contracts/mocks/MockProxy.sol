pragma solidity ^0.4.23;

import "../proxy/Proxy";

/**
* @title MockProxy
* @dev Mock contract used for Proxy tests
*/
contract MockProxy is Proxy {

  address private proxyImplementation;

  /**
  * @dev Constructor function
  * @param _implementation Address of implementation contract to which calls will be delegated
  **/
  constructor(address _implementation) {
    proxyImplementation = _implementation;
  }

  /**
  * @dev Tells the address of the implementation where every delegate call will be delegated
  * @return Address of the implementation to which contract calls will be delegated
  */
  function implementation() public view returns (address) {
    return proxyImplementation;
  }

}