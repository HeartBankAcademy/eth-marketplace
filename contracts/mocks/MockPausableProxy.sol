pragma solidity ^0.4.23;

import "../proxy/PausableProxy.sol";

/**
* @title MockProxy
* @dev Mock contract used for Proxy tests
*/
contract MockPausableProxy is PausableProxy {

  address private proxyImplementation;

  /**
  * @dev Constructor function
  * @param _aclAddress Address of the ACL contract to be used for pausing/unpausing authorization
  */
  constructor(address _aclAddress) PausableProxy(_aclAddress) public { }

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