// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

//Importing Hardhat Runtime Environment
const { ethers } = require("hardhat");

async function main() {
  const initBalance = ethers.utils.parseEther("0");
  const ETHCLUB = await ethers.getContractFactory("ETHCLUB");
  const ethClub = await ETHCLUB.deploy(initBalance);

  await ethClub.deployed();

  console.log("ETH deployed to:", ethClub.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});