# Marketplace

## What does this project do?

This project implements an online marketplace that operates on the blockchain

## Project Architecture

* The project is implemented with upgradability in mind using:
  * Proxy patterns
  * Delegation
  * EternalStorage data storage pattern
* Permissioning is flexible
  * Each marketplace has an owner and a set of authorized accounts
  * Authorized accounts can create new stores and add them to the marketplace
  * Each new store has its own permissioning system
    * The owner of the store has full permissions over the store contract
    * Authorized accounts can add new products to the store
    * This grants store owners a lot of flexibility in managing their stores
* Execution of all contracts can be paused by their respective owners in case of an attack
* Store owners can withdraw all collected store money to their private accounts
* Reentrancy attacks are prevented in all value-transfering transactions

[See design pattern decisions](design_pattern_decisions.md)
[See avoiding common attacks](avoiding_common_attacks.md)

## User Interace

⚠️ The web user interface of the project is still a work in progress (unfortunately)

To run a local webserver use the following command:

```
npm run dev
```

## Testing

Project features a complete testing suite with 100% code coverage
[See coverage reports here](https://mseijas.github.io/eth-marketplace/)

To run test locally use the following command:

```
npm run test:eth
```

To run the test coverage reporting tool locally run:

```
npm run coverage:eth
```

## Compiling

To compile the project locally use:

```
npm run build:eth
```

And to perform a migration script use:

```
npm run deploy:eth
```
