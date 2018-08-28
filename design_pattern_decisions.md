# Design Pattern Decisions

The following design patterns where used in this project:

* ACL pattern

  * This pattern allows for permisioning flexibility while mainitng it simple to manage
  * The pattern uses a product owner, and a list of authorized users
  * This pattern was chosen because it allows more than one authorized account to be able to make changes to the contract, which is important while working on a team, or in the event that the owner account private key is lost

* Proxy delegation pattern

  * This pattern allows to delegate the logic execution to another contract
  * The pattern was chosen because it enables contract logic to be modified and updated after deployment, which is a great benefit to fix bugs or introduce new execution to prevent unforseen attacks

* EternalStorage pattern

  * This pattern was chosen because it allows for great flexibility to contract data storage
  * It also makes it possible to upgrade data models stored in the contracts:
    * For example, say that a new color property would liked to be added to the products store. This pattern makes this change trivial, and allows for backwards-compatibility of encoding of previously stored data.

* Pausable pattern
  * All contracts implement a Pausable pattern which allows all contract execution to be stopped by the contract owner
  * This can help stop malicious attacks in such an event, preventing attackers to continuously issue malicious transactions
