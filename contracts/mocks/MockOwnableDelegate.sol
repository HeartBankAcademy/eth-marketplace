pragma solidity ^0.4.23;

import "../ownership/IOwnableDelegate.sol";

/**
* @title MockOwnableDelegate
* @dev Mock contract used for Ownable tests
*/
contract MockOwnableDelegate is IOwnableDelegate {

    address public lastContractModified;
    address public previousOwner;
    address public newOwner;

    /**
    * @dev Updates the contract storage to reflect these values
    * @param _contract Address of Ownserhip contract changed
    * @param _previousOwner Address of previous owner
    * @param _newOwner Address of new owner
    */
    function didUpdateOwner(address _contract, address _previousOwner, address _newOwner) external {
      lastContractModified = _contract;
      previousOwner = _previousOwner;
      newOwner = _newOwner;  
    }

    /**
    * @dev Returns true for contracts that adhere to the OwnableDelegate interface 
    * @return Always returns true for this contract
    */
    function isOwnableDelegate() public pure returns (bool) {
      return true;
    }

}