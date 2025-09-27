import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🔧 Testing Hardhat Configuration...\n");
  
  console.log("Environment Variables:");
  console.log("- KADENA_TESTNET_RPC:", process.env.KADENA_TESTNET_RPC || "NOT SET");
  console.log("- KADENA_CHAIN_ID:", process.env.KADENA_CHAIN_ID || "NOT SET");
  console.log("- PRIVATE_KEY:", process.env.PRIVATE_KEY ? "SET (length: " + process.env.PRIVATE_KEY.length + ")" : "NOT SET");
  console.log("- NFT_TOKEN_NAME:", process.env.NFT_TOKEN_NAME || "NOT SET");
  console.log("- NFT_TOKEN_SYMBOL:", process.env.NFT_TOKEN_SYMBOL || "NOT SET");
  console.log("- NFT_BASE_URI:", process.env.NFT_BASE_URI || "NOT SET");
  console.log("");

  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer Account:", deployer.address);
    console.log("Account Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "KDA");
    
    const network = await deployer.provider.getNetwork();
    console.log("Network Name:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("");
    
    console.log("✅ Configuration test successful!");
    
  } catch (error) {
    console.log("❌ Configuration test failed:", error);
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
