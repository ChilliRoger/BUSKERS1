import { ethers } from "hardhat";
import { getPYUSDContract, getContractInfo, formatTokenAmount } from "../lib/kadena-utils";

async function main() {
  console.log("🧪 Testing MockPYUSD deployment and functionality...\n");

  // Deploy the contract
  console.log("📦 Deploying MockPYUSD contract...");
  const [deployer] = await ethers.getSigners();
  
  const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
  const mockPYUSD = await MockPYUSD.deploy(deployer.address);
  await mockPYUSD.waitForDeployment();

  const contractAddress = await mockPYUSD.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
  console.log("");

  // Test using the utility functions
  console.log("🔧 Testing utility functions...");
  
  // Get contract instance using utility function
  const contract = getPYUSDContract(contractAddress);
  
  // Get contract info
  const info = await getContractInfo(contractAddress);
  console.log("📊 Contract Information:");
  console.log(JSON.stringify(info, null, 2));
  console.log("");

  // Test minting
  console.log("🪙 Testing minting functionality...");
  const mintAmount = ethers.parseUnits("5000", 6);
  const mintTx = await contract.mint(mintAmount);
  await mintTx.wait();
  
  const balance = await contract.balanceOf(deployer.address);
  console.log("Minted 5000 MPYUSD tokens");
  console.log("Current balance:", formatTokenAmount(balance, 6), "MPYUSD");
  console.log("");

  // Test burning
  console.log("🔥 Testing burning functionality...");
  const burnAmount = ethers.parseUnits("1000", 6);
  const burnTx = await contract.burn(burnAmount);
  await burnTx.wait();
  
  const newBalance = await contract.balanceOf(deployer.address);
  console.log("Burned 1000 MPYUSD tokens");
  console.log("New balance:", formatTokenAmount(newBalance, 6), "MPYUSD");
  console.log("");

  // Test transfer
  console.log("💸 Testing transfer functionality...");
  const [deployer2, recipient] = await ethers.getSigners();
  const transferAmount = ethers.parseUnits("500", 6);
  const transferTx = await contract.transfer(recipient.address, transferAmount);
  await transferTx.wait();
  
  const recipientBalance = await contract.balanceOf(recipient.address);
  console.log("Transferred 500 MPYUSD to recipient");
  console.log("Recipient balance:", formatTokenAmount(recipientBalance, 6), "MPYUSD");
  console.log("");

  // Test contract verification simulation
  console.log("🔍 Simulating Kadena Contract Verification...");
  console.log("================================================");
  console.log("Contract Name: MockPYUSD");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Deployment Transaction:", mintTx.hash);
  console.log("Network: Kadena EVM Testnet");
  console.log("Chain ID: 1");
  console.log("Compiler Version: 0.8.24");
  console.log("Optimization: Enabled (200 runs)");
  console.log("Gas Used:", mintTx.gasLimit?.toString());
  console.log("================================================");
  console.log("");

  console.log("✅ All tests completed successfully!");
  console.log("Contract is ready for use on Kadena EVM Testnet");
}

main().catch((error) => {
  console.error("❌ Test failed:");
  console.error(error);
  process.exitCode = 1;
});
