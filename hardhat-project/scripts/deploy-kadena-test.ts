import { ethers } from "hardhat";

async function main() {
  console.log("🌐 Testing Kadena EVM Testnet connection...\n");

  try {
    console.log("🚀 Attempting deployment to Kadena EVM Testnet...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
    console.log("Network:", await deployer.provider.getNetwork());
    console.log("");
    
    // Deploy contract
    const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
    const mockPYUSD = await MockPYUSD.deploy(deployer.address);
    await mockPYUSD.waitForDeployment();
    
    const contractAddress = await mockPYUSD.getAddress();
    console.log("✅ Contract deployed successfully!");
    console.log("Contract Address:", contractAddress);
    
    // Test minting
    const mintAmount = ethers.parseUnits("1000", 6);
    const tx = await mockPYUSD.mint(mintAmount);
    await tx.wait();
    
    const balance = await mockPYUSD.balanceOf(deployer.address);
    console.log("Minted 1000 MPYUSD tokens");
    console.log("Balance:", ethers.formatUnits(balance, 6), "MPYUSD");
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    console.log("💡 Recommendation: Use local testing with 'npx hardhat run scripts/deploy-local-test.ts'");
  }
}

main().catch((error) => {
  console.error("❌ Test failed:");
  console.error(error);
  process.exitCode = 1;
});
