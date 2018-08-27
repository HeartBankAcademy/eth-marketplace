pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "../store/ProductStoreV1.sol";

/**
* @title MockProductStore
* @dev Mock contract used for ProductStoreV1 tests
*/
contract MockProductStoreV1 is ProductStoreV1 {

  /**
  * @dev Constructor function
  * @param _aclAddress Address of ACL contract
  */
  constructor(address _aclAddress) ProductStoreV1(_aclAddress) public { }

  /**
  * @dev DepositedFunds is emited every time a deposit is made
  * @param _sender Address of sender that performed the deposit
  * @param _amount Amount deposited
  */
  event DepositedFunds(address _sender, uint256 _amount);

  /**
  * @dev Accepts a value deposit and emits an event
  */
  function deposit() public payable {
    emit DepositedFunds(msg.sender, msg.value);
  }

}