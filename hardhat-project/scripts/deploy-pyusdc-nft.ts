import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MusicNFTV2 with PYUSD integration...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Use the actual PYUSD contract address from Ethereum
  const pyusdAddress = "0x6c3ea9036406852006290770bedfcaba0e23a0e8";
  console.log("\n📦 Using existing PYUSD contract:", pyusdAddress);

  // Deploy MusicNFTV2
  console.log("\n🎵 Deploying MusicNFTV2...");
  const MusicNFTV2 = await ethers.getContractFactory("MusicNFTV2");
  const musicNFT = await MusicNFTV2.deploy(
    "Buskers Music NFT", // name
    "BMNFT",             // symbol
    "https://api.buskers.com/metadata/", // base URI
    pyusdAddress,        // PYUSD token address
    ethers.parseUnits("10", 6) // mint price: 10 PYUSD
  );
  await musicNFT.waitForDeployment();
  const musicNFTAddress = await musicNFT.getAddress();
  console.log("✅ MusicNFTV2 deployed to:", musicNFTAddress);

  // Note: PYUSD is already deployed on Ethereum, so we can't airdrop
  // Users will need to get PYUSD from exchanges or bridges
  console.log("\n💰 PYUSD Integration Note:");
  console.log("PYUSD is already deployed on Ethereum mainnet");
  console.log("Users need to bridge PYUSD to Kadena EVM testnet or get it from exchanges");

  // Set up some test data
  console.log("\n🔧 Setting up test data...");
  
  // Check PYUSD balance (if available on Kadena)
  try {
    const pyusdContract = await ethers.getContractAt("IERC20", pyusdAddress);
    const deployerBalance = await pyusdContract.balanceOf(deployer.address);
    console.log("Deployer PYUSD balance:", ethers.formatUnits(deployerBalance, 6), "PYUSD");
  } catch (error) {
    console.log("⚠️  Could not check PYUSD balance (contract may not be available on Kadena)");
  }
  
  // Check contract PYUSD balance
  const contractBalance = await musicNFT.getContractBalance();
  console.log("Contract PYUSD balance:", ethers.formatUnits(contractBalance, 6), "PYUSD");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("PYUSD Token:", pyusdAddress, "(Ethereum mainnet)");
  console.log("MusicNFTV2:", musicNFTAddress);
  
  console.log("\n🔗 Network Information:");
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "(Chain ID:", network.chainId, ")");
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the new contract addresses");
  console.log("2. Update your frontend configuration");
  console.log("3. Get PYUSD tokens (bridge from Ethereum or buy from exchanges)");
  console.log("4. Test minting with PYUSD payment");
  
  // Save addresses to a file for easy reference
  const addresses = {
    network: network.name,
    chainId: network.chainId.toString(),
    pyusd: pyusdAddress,
    musicNFT: musicNFTAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n💾 Contract addresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
