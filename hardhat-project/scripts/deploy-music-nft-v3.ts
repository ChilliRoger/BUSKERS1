import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MusicNFTV3 contract...");

  // Get the contract factory
  const MusicNFTV3 = await ethers.getContractFactory("MusicNFTV3");

  // Deploy the contract
  const musicNFT = await MusicNFTV3.deploy(
    "Buskers Music NFT", // name
    "BMNFT",             // symbol
    "https://api.buskers.com/metadata/" // base URI
  );

  // Wait for deployment to complete
  await musicNFT.waitForDeployment();

  const contractAddress = await musicNFT.getAddress();
  
  console.log("✅ MusicNFTV3 deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  
  // Verify contract deployment
  console.log("\n🔍 Verifying deployment...");
  try {
    const name = await musicNFT.name();
    const symbol = await musicNFT.symbol();
    const owner = await musicNFT.owner();
    
    console.log("✅ Contract verification successful:");
    console.log("  Name:", name);
    console.log("  Symbol:", symbol);
    console.log("  Owner:", owner);
  } catch (error) {
    console.error("❌ Contract verification failed:", error);
  }
  
  console.log("\n📋 Next steps:");
  console.log("1. Update config.json with new contract address:", contractAddress);
  console.log("2. Update .env.local with new contract address");
  console.log("3. Test minting functionality");
  console.log("4. Verify on Kadena Explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
