import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  // State variables to hold wallet, account, contract, balance, and transaction details
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Contract address and ABI
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }  };

// Function to handle connected account
  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Your Account has been successfully connected", account[0]);
      setAccount(account[0]);
    } else {
      console.log("Account not found");
    } };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet needed in order to continue.");
      return;
    }
    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getATMContract();
  };

  // Function to get the ATM contract instance
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBigNumber = await atm.getBalance();
      const balanceInEther = ethers.utils.formatEther(balanceBigNumber);
      setBalance(balanceInEther);
    }  };

  const getTransactions = async () => {
    if (atm) {
      const transactions = await atm.getTransactions();
      setTransactions(transactions);
    } };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit({ value: ethers.utils.parseEther(depositAmount) });
      await tx.wait();
      getBalance();
      getTransactions();
    } };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      getBalance();
      getTransactions();
    } };

  const withdrawAll = async () => {
    if (atm) {
      let tx = await atm.withdrawAll();
      await tx.wait();
      getBalance();
      getTransactions();
    } };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Metamask required in order to use EthClub</p>;
    }
    if (!account) {
      return <button onClick={connectAccount}>Click here to connect your Metamask wallet</button>;
    }
    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{ position: 'fixed', bottom: '60px', left: '20px' }}>Wallet Address: {account}</p> //for changing its position on webpage 
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
        />
        <button onClick={withdraw}>Withdraw ETH</button>
        <p></p>
        <button onClick={withdrawAll}>Withdraw All ETH</button>
        <p>Wallet Balance: {balance}</p>
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
    if (atm) {
      getTransactions();
     } 
    }, [atm]);

// Rendering the main UI for the webpage
  return (
    <main className="container">
      <header><h1>Welcome To The EthClub Exchange 🪙</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background: 
            linear-gradient(
              rgba(255, 255, 255, 0.5), //for adjusting background image's transparency
              rgba(255, 255, 255, 0.5)
            ),
          url('https://thumbor.forbes.com/thumbor/fit-in/1290x/https://www.forbes.com/advisor/wp-content/uploads/2021/03/ethereum-1.jpeg'); //background image
          background-size: cover;
          background-position: center;
          height: 97vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #4682b4; //works as a fallback incase background image did not load properly
        } 
        header {
          color: #FF7700; //colour for heading
        }
      `}
      </style>
    </main>
  );
}