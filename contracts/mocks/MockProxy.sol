pragma solidity ^0.4.23;

import "../proxy/Proxy.sol";

/**
* @title MockProxy
* @dev Mock contract used for Proxy tests
*/
contract MockProxy is Proxy {

  address private proxyImplementation;

  /**
  * @dev Sets implementation address to where every delegate call will be delegated
  * @param _proxyImplementation Address of implementation contract to which calls will be delegated
  **/
  function setImplementation(address _proxyImplementation) public {
    proxyImplementation = _proxyImplementation;
  }

  /**
  * @dev Tells the address of the implementation where every delegate call will be delegated
  * @return Address of the implementation to which contract calls will be delegated
  */
  function implementation() public view returns (address) {
    return proxyImplementation;
  }

}