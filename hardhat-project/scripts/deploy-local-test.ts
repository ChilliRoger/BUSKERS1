import { ethers } from "hardhat";
import { getPYUSDContract, getContractInfo, formatTokenAmount } from "../lib/kadena-utils";

async function main() {
  console.log("🧪 Testing MockPYUSD deployment on local Hardhat network...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployment Details:");
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  console.log("Network:", await deployer.provider.getNetwork());
  console.log("");

  // Deploy MockPYUSD contract
  console.log("📦 Deploying MockPYUSD contract...");
  const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
  
  // Deploy with deployer as initial owner
  const mockPYUSD = await MockPYUSD.deploy(deployer.address);
  await mockPYUSD.waitForDeployment();

  const contractAddress = await mockPYUSD.getAddress();
  console.log("✅ MockPYUSD deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("");

  // Get contract details
  const name = await mockPYUSD.name();
  const symbol = await mockPYUSD.symbol();
  const decimals = await mockPYUSD.decimals();
  const totalSupply = await mockPYUSD.totalSupply();
  const maxSupply = await mockPYUSD.getMaxSupply();

  console.log("📊 Contract Information:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));
  console.log("Max Supply:", ethers.formatUnits(maxSupply, decimals));
  console.log("");

  // Test minting functionality
  console.log("🧪 Testing mint functionality...");
  const mintAmount = ethers.parseUnits("1000", decimals);
  const tx = await mockPYUSD.mint(mintAmount);
  await tx.wait();
  
  const newBalance = await mockPYUSD.balanceOf(deployer.address);
  console.log("Minted 1000 MPYUSD tokens");
  console.log("New balance:", ethers.formatUnits(newBalance, decimals), "MPYUSD");
  console.log("");

  // Test using utility functions
  console.log("🔧 Testing utility functions...");
  
  // Get contract instance using utility function
  const contract = getPYUSDContract(contractAddress);
  
  // Get contract info
  const info = await getContractInfo(contractAddress);
  console.log("📊 Contract Information from utility:");
  console.log(JSON.stringify(info, null, 2));
  console.log("");

  // Test burning
  console.log("🔥 Testing burn functionality...");
  const burnAmount = ethers.parseUnits("100", decimals);
  const burnTx = await contract.burn(burnAmount);
  await burnTx.wait();
  
  const finalBalance = await contract.balanceOf(deployer.address);
  console.log("Burned 100 MPYUSD tokens");
  console.log("Final balance:", ethers.formatUnits(finalBalance, decimals), "MPYUSD");
  console.log("");

  // Simulate contract verification
  console.log("🔍 Simulating Kadena Contract Verification...");
  console.log("================================================");
  console.log("Contract Name: MockPYUSD");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Deployment Transaction:", tx.hash);
  console.log("Block Number:", tx.blockNumber);
  console.log("Gas Used:", tx.gasLimit?.toString());
  console.log("Network: Local Hardhat Network (Simulating Kadena EVM Testnet)");
  console.log("Chain ID: 31337");
  console.log("Compiler Version: 0.8.24");
  console.log("Optimization: Enabled (200 runs)");
  console.log("================================================");
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    contractName: "MockPYUSD",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTx: tx.hash,
    network: "Local Hardhat Network (Simulating Kadena EVM Testnet)",
    chainId: 31337,
    timestamp: new Date().toISOString(),
    compilerVersion: "0.8.24",
    optimization: true,
    optimizationRuns: 200
  };

  console.log("💾 Deployment completed successfully!");
  console.log("Contract is ready for use (simulating Kadena EVM Testnet)");
  console.log("");
  console.log("🔗 Next steps:");
  console.log("1. Add the contract address to your frontend");
  console.log("2. Use the ABI from artifacts/contracts/MockPYUSD.sol/MockPYUSD.json");
  console.log("3. Test the contract functions using the deployed address");
  console.log("");
  console.log("📝 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error("❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});
