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
