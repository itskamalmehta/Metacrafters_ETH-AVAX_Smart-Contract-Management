// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

//Importing Hardhat Runtime Environment
const hre = require("hardhat");

async function main() {
  const initBalance = 50; //initial balance
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance); //initiates the deployment of the contract 
  await assessment.deployed();

  console.log(`A smart contract with initial balance of ${initBalance} ETH was deployed to address: ${assessment.address}`);
}
// handling error during execution
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
