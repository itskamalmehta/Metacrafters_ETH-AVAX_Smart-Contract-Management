# Metacrafters_Eth-Avax_Smart-Contract-Management

This project "EthClub Exchange" provides users with a interface to manage their Ethereum funds directly from their MetaMask wallet.

## Description

EthClub Exchange is a decentralized platform designed for secure Ethereum transactions. Users can deposit, withdraw, and track their transaction history effortlessly. The platform imposes a daily withdrawal limit of 1000 ETH to ensure controlled usage and prevent excessive withdrawals. Integrated with MetaMask, it provides a seamless experience for connecting and managing Ethereum wallets.

It is designed with the help of React.js and uses the ethers.js library to interact with the smart contracts. the frontend interface is simple and user-friendly.

## Getting Started

To get started with the EthClub Exchange project, follow these steps:

Prerequisites
Before you begin, ensure you have the following installed on your machine(Particularly when using visual studio code):

1. Node.js, you can Download and install it from nodejs.org.
2. MetaMask: A browser extension to manage your Ethereum wallet. Install from metamask.io.
3. Git: Version control system to clone the repository. Install from git-scm.com.

### Installing

After cloning the github in your VS Code,

1. Inside the project directory, in the terminal tab type: npm i and then enter.
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node and enter
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js and enter
5. Go back to the first terminal, type: npm run dev to launch the front-end.

After all these steps, the project will be running on your localhost. Most probably at http://localhost:3000/ (which is present at the end of the first terminal). 

### Executing program

Setting up Metamask:
1. Open Metamask extension, go to settings > Network > Add Network.
2. A new webpage will open at the bottom choose the option add network manually.
3. Set Network name of your choice, Enter RPC URL - http://127.0.0.1:8545/ (present on 2nd terminal) 
4. choose Chain ID- 31337 and Currency symbol anything for ex. ETH.
5. Then save it and go back to metamask and select the account at top which you made in above steps click on add account or hardware wallet.
6. Then click on import account then enter this in private key - 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 (present in 2nd terminal Account #0)

And you are ready to go for the next process

Using the Interface:

1. Click on http://localhost:3000/ (present on Termial 1st end) and it will redirect to your browser and open the project's interface.

![1](https://github.com/user-attachments/assets/8fb21a94-1888-44af-8b22-32b8c1fdc6fe)


2. Click on 'Click here to connect your Metamask wallet' and connect your Metamask with EthClub Exchange.

![2](https://github.com/user-attachments/assets/c3aee21b-d10b-4c03-b4a7-a9c9576bf359)


3. Now you can Transfer ETH, Withdraw ETH, Withdraw All ETH, check Wallet balance, see Transaction history and wallet address, no. of transaction etc.

![3](https://github.com/user-attachments/assets/fa875997-5cc2-4a6d-84de-e8fe2fcc14c3)
                                  fig.3- User Interface when the 1000 ETH Withdrawl limit is reached.

## Code for ETHCLUB.sol

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ETHCLUB {
    address payable public owner;
    uint256 public balance;
    uint256 public transactionCount;
    uint256 public dailyWithdrawn;
    uint256 public lastWithdrawTime;
    uint256 constant DAILY_LIMIT = 1000 ether;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event WithdrawAll(uint256 amount);

    struct Transaction {
        uint256 amount;
        string transactionType;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += msg.value;
        transactions.push(Transaction(msg.value, "Deposit", block.timestamp));
        transactionCount++;
        emit Deposit(msg.value);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
    error DailyLimitExceeded(uint256 limit, uint256 attemptedWithdraw, uint256 remainingLimit);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        if (block.timestamp > lastWithdrawTime + 1 days) {
            dailyWithdrawn = 0;
            lastWithdrawTime = block.timestamp;
        }

        if (dailyWithdrawn + _withdrawAmount > DAILY_LIMIT) {
            revert DailyLimitExceeded({
                limit: DAILY_LIMIT,
                attemptedWithdraw: _withdrawAmount,
                remainingLimit: DAILY_LIMIT - dailyWithdrawn
            });
        }

        if (address(this).balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: address(this).balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;
        dailyWithdrawn += _withdrawAmount;
        owner.transfer(_withdrawAmount);
        transactions.push(Transaction(_withdrawAmount, "Withdraw", block.timestamp));
        transactionCount++;
        emit Withdraw(_withdrawAmount);
    }

    function withdrawAll() public {
        require(msg.sender == owner, "You are not the owner of this account");

        if (block.timestamp > lastWithdrawTime + 1 days) {
            dailyWithdrawn = 0;
            lastWithdrawTime = block.timestamp;
        }

        uint256 _balance = address(this).balance;

        if (dailyWithdrawn + _balance > DAILY_LIMIT) {
            revert DailyLimitExceeded({
                limit: DAILY_LIMIT,
                attemptedWithdraw: _balance,
                remainingLimit: DAILY_LIMIT - dailyWithdrawn
            });
        }

        balance = 0;
        dailyWithdrawn += _balance;
        owner.transfer(_balance);
        transactions.push(Transaction(_balance, "WithdrawAll", block.timestamp));
        transactionCount++;
        emit WithdrawAll(_balance);
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}

```



## Troubleshooting:

1. MetaMask Connection Issues: Ensure MetaMask is installed and the correct network is selected.
2. Transaction Errors: Verify you have sufficient ETH in your wallet and that the smart contract is properly deployed and configured.
3. Ensure Js.node version 20.15.0(LTS) is installed for avoiding any problems. 



## Authors
Kamal Mehta
Itskamlmehta@gmail.com

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
