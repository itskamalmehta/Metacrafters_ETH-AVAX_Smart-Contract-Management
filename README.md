# Metacrafters_Eth-Avax_Smart-Contract-Management

The project Smart Contract Management is a DApp that allows users to connect their Ethereum wallet, view their balance, and perform deposit and withdrawal transactions.

## Description

This project "EthClub Exchange" provides users with a interface to manage their Ethereum funds directly from their MetaMask wallet. The core functionality includes connecting to a user's Ethereum wallet, displaying the wallet's address and balance, and enabling deposit and withdrawal transactions.

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

![image](https://github.com/itskamalmehta/Metacrafters_ETH-AVAX_Smart-Contract-Management/assets/112396717/100cbe7a-a8c9-4049-9ec3-5a5f1991d891)

2. Click on 'Click here to connect your Metamask wallet' and connect your Metamask with EthClub Exchange.

3. Now you can Transfer ETH, Withdraw ETH, Withdraw All ETH, check Wallet balance, see Transaction history and wallet address. t
   They all function as their name suggests.

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

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

    function getBalance() public view returns(uint256){
        return address(this).balance; 
    }

    function deposit() public payable {
        // Ensure only the owner can deposit
        require(msg.sender == owner, "You are not the owner of this account");
        // Update balance
        balance += msg.value;

        transactions.push(Transaction(msg.value, "Deposit", block.timestamp));
        // Emit the deposit event
        emit Deposit(msg.value);
    }

    // error defined to handle insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        // Check if the contract has enough balance
        if (address(this).balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: address(this).balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Update balance
        balance -= _withdrawAmount;
        // Transfer the Ether to the owner
        owner.transfer(_withdrawAmount);

        transactions.push(Transaction(_withdrawAmount, "Withdraw", block.timestamp));
        // Emit the withdraw event
        emit Withdraw(_withdrawAmount);
    }

    function withdrawAll() public { 
        require(msg.sender == owner, "You are not the owner of this account");

        uint _balance = address(this).balance;
        // Update balance
        balance = 0;
        // Transfer all Ether to the owner
        owner.transfer(_balance);

        transactions.push(Transaction(_balance, "WithdrawAll", block.timestamp));

        // Emit the withdrawAll event
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
