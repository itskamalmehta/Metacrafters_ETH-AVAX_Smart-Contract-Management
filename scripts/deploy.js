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