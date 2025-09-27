import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MusicNFTV5 contract (PYUSD integration for sponsor)...");

  // Get the contract factory
  const MusicNFTV5 = await ethers.getContractFactory("MusicNFTV5");

  // Contract parameters
  const name = "Buskers Music NFT";
  const symbol = "BMNFT";
  const baseURI = "https://api.buskers.com/metadata/";
  const pyusdAddress = "0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF"; // TestPYUSD address
  const mintPrice = ethers.parseUnits("10", 6); // 10 PYUSD (6 decimals) - for display only

  // Deploy the contract
  const musicNFT = await MusicNFTV5.deploy(
    name,
    symbol,
    baseURI,
    pyusdAddress,
    mintPrice
  );

  // Wait for deployment to complete
  await musicNFT.waitForDeployment();

  const contractAddress = await musicNFT.getAddress();
  
  console.log("✅ MusicNFTV5 deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("PYUSD Address:", pyusdAddress);
  console.log("Display Mint Price:", ethers.formatUnits(mintPrice, 6), "PYUSD");
  console.log("Note: Free minting for testing, PYUSD integration for sponsor visibility");
  
  // Verify contract deployment
  console.log("\n🔍 Verifying deployment...");
  try {
    const contractName = await musicNFT.name();
    const contractSymbol = await musicNFT.symbol();
    const owner = await musicNFT.owner();
    const pyusdContract = await musicNFT.pyusdAddress();
    const mintPriceFromContract = await musicNFT.mintPrice();
    
    console.log("✅ Contract verification successful:");
    console.log("  Name:", contractName);
    console.log("  Symbol:", contractSymbol);
    console.log("  Owner:", owner);
    console.log("  PYUSD Contract:", pyusdContract);
    console.log("  Display Mint Price:", ethers.formatUnits(mintPriceFromContract, 6), "PYUSD");
  } catch (error) {
    console.error("❌ Contract verification failed:", error);
  }
  
  console.log("\n📋 Next steps:");
  console.log("1. Update config.json with new contract address:", contractAddress);
  console.log("2. Update .env.local with new contract address");
  console.log("3. Test free minting functionality");
  console.log("4. Verify PYUSD integration for sponsor");
  console.log("5. Verify on Kadena Explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
