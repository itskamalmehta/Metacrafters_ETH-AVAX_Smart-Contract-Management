import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/ETHCLUB.sol/ETHCLUB.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [dailyWithdrawLimitReached, setDailyWithdrawLimitReached] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with your contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      alert("MetaMask is required to use EthClub");
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getATMContract(accounts[0]);
    } else {
      console.log("No accounts found");
    }
  };

  const connectAccount = async () => {
    try {
      if (!ethWallet) {
        alert("MetaMask wallet needed to continue.");
        return;
      }
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  const getATMContract = (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBigNumber = await atm.getBalance();
      const balanceInEther = ethers.utils.formatEther(balanceBigNumber);
      setBalance(balanceInEther);
    }
  };

  const getTransactions = async () => {
    if (atm) {
      const transactions = await atm.getTransactions();
      setTransactions(transactions);
      setTransactionCount(transactions.length);

      let dailyWithdrawn = 0;
      const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);

      transactions.forEach(tx => {
        if (tx.transactionType === "Withdraw" && tx.timestamp > oneDayAgo) {
          dailyWithdrawn += parseFloat(ethers.utils.formatEther(tx.amount));
        }
      });

      if (dailyWithdrawn >= 1000) {
        setDailyWithdrawLimitReached(true);
      } else {
        setDailyWithdrawLimitReached(false);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit({ value: ethers.utils.parseEther(depositAmount) });
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const withdraw = async () => {
    if (atm && !dailyWithdrawLimitReached) {
      const tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const withdrawAll = async () => {
    if (atm && !dailyWithdrawLimitReached) {
      const tx = await atm.withdrawAll();
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>MetaMask required to use EthClub</p>;
    }
    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask</button>;
    }
    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{ position: 'fixed', bottom: '20px', left: '20px' }}>Wallet Address: {account}</p>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter amount to deposit in ETH"
        />
        <button onClick={deposit}>Transfer ETH</button>
        <p></p>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter amount to withdraw in ETH"
          disabled={dailyWithdrawLimitReached}
        />
        <button onClick={withdraw} disabled={dailyWithdrawLimitReached}>Withdraw ETH</button>
        <p></p>
        <button onClick={withdrawAll} disabled={dailyWithdrawLimitReached}>Withdraw All ETH</button>
        <p>Wallet Balance: {balance}</p>
        <p style={{ position: 'fixed', bottom: '20px', right: '40px' }}>Number of Transactions: {transactionCount}</p>
        <h3>Transaction History</h3>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.transactionType} of {ethers.utils.formatEther(tx.amount)} ETH at {new Date(tx.timestamp * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet) {
      ethWallet.request({ method: "eth_accounts" }).then(handleAccount);
    }
  }, [ethWallet]);

  useEffect(() => {
    if (atm) {
      getTransactions();
    }
  }, [atm]);

  return (
    <main className="container">
      <header><h1>Welcome To The EthClub Exchange 🪙</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background: 
            linear-gradient(
              rgba(255, 255, 255, 0.5), 
              rgba(255, 255, 255, 0.5)
            ),
          url('https://thumbor.forbes.com/thumbor/fit-in/1290x/https://www.forbes.com/advisor/wp-content/uploads/2021/03/ethereum-1.jpeg'); 
          background-size: cover;
          background-position: center;
          height: 97vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #4682b4; 
        } 
        header {
          color: #FF7700; 
        }
      `}
      </style>
    </main>
  );
}