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