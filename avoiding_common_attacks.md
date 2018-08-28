# Avoiding common attacks

The following precautions were taken to prevent common malicious attacks:

* Extensive testing to prevent logic bugs

  * Tests were writing to achieve a 100% code coverage to ensure proper execution of all written contract logic
  * 👉 [See test coverage reports here](https://mseijas.github.io/eth-marketplace/)

* Upgradability pattern

  * By implementing the proxy delegation pattern, contract upgrades are possible which allows to fix undiscovered bugs at the time of deployment

* Interface compliance for upgrades

  * All proxy patterns require that the implementation contracts abide by a specificly defined interface to ensure that implementation contracts won't be swapped for other contracts that could potentially execute malicious logic
  * Additionally, checks are in place to verify that the implementation contract is, in fact a valid contract
  * A valid contract is defined as:
    * Not the 0x0 address
    * Not an account address
    * A contract address complying to the specified interface by the proxy

* Proper validation

  * Proper validation of all contract storage data is effectuated to prevent potential DDoS or Spam

* Contract state reverts
  * All value-transfer transactions are executed using the `transfer` method which will revert the contract state if an exception is thrown
