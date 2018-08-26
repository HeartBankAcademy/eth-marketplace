pragma solidity ^0.4.23;

/**
* @title MockContract
* @dev Generic mock contract used for testing
*/
contract MockContract {
  
  string public someValue = "MockContract.someValue";

  /**
  * @dev Returns a string value
  * @return Always returns the value 'MockContract'
  */
  function someString() public pure returns(string) {
    return "MockContract";
  }

  /**
  * @dev Returns a bool value
  * @return Always returns true
  */
  function isMockContract() public pure returns(bool) {
    return true;
  }

}