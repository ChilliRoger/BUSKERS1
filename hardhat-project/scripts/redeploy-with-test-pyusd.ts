import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Redeploying MusicNFTV2 with TestPYUSD integration...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Use the TestPYUSD contract address
  const testPyusdAddress = "0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF";
  console.log("\n📦 Using TestPYUSD contract:", testPyusdAddress);

  // Deploy MusicNFTV2 with TestPYUSD
  console.log("\n🎵 Deploying MusicNFTV2 with TestPYUSD...");
  const MusicNFTV2 = await ethers.getContractFactory("MusicNFTV2");
  const musicNFT = await MusicNFTV2.deploy(
    "Buskers Music NFT", // name
    "BMNFT",             // symbol
    "https://api.buskers.com/metadata/", // base URI
    testPyusdAddress,    // TestPYUSD token address
    ethers.parseUnits("10", 6) // mint price: 10 tPYUSD
  );
  await musicNFT.waitForDeployment();
  const musicNFTAddress = await musicNFT.getAddress();
  console.log("✅ MusicNFTV2 deployed to:", musicNFTAddress);

  // Verify the contract is using the correct token
  console.log("\n🔧 Verifying contract configuration...");
  const pyusdAddress = await musicNFT.pyusd();
  console.log("Contract PYUSD address:", pyusdAddress);
  console.log("Expected TestPYUSD address:", testPyusdAddress);
  console.log("Addresses match:", pyusdAddress.toLowerCase() === testPyusdAddress.toLowerCase());

  const mintPrice = await musicNFT.mintPrice();
  console.log("Mint price:", ethers.formatUnits(mintPrice, 6), "tPYUSD");

  // Test the contract functions
  console.log("\n🧪 Testing contract functions...");
  try {
    const totalSupply = await musicNFT.totalSupply();
    console.log("Total supply:", totalSupply.toString());
    
    const nextTokenId = await musicNFT.nextTokenId();
    console.log("Next token ID:", nextTokenId.toString());
    
    console.log("✅ Contract functions working correctly");
  } catch (error) {
    console.error("❌ Contract function test failed:", error);
  }

  console.log("\n🎉 Redeployment completed successfully!");
  console.log("\n📋 Contract Information:");
  console.log("MusicNFTV2 Address:", musicNFTAddress);
  console.log("TestPYUSD Address:", testPyusdAddress);
  console.log("Mint Price: 10 tPYUSD");
  
  console.log("\n🔗 Network Information:");
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "(Chain ID:", network.chainId, ")");
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the new contract address");
  console.log("2. Update your frontend configuration");
  console.log("3. Test minting with TestPYUSD tokens");
  
  // Save addresses to a file for easy reference
  const addresses = {
    network: network.name,
    chainId: network.chainId.toString(),
    musicNFT: musicNFTAddress,
    testPyusd: testPyusdAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync('redeployment-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n💾 Contract addresses saved to redeployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Redeployment failed:", error);
    process.exit(1);
  });
