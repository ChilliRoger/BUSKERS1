import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🎵 Deploying MusicNFT to Kadena EVM Testnet...\n");

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    const isKadenaTestnet = network.chainId === 5920n;
    
    // Validate environment variables only for Kadena testnet
    if (isKadenaTestnet) {
      const requiredEnvVars = ['KADENA_TESTNET_RPC', 'KADENA_CHAIN_ID', 'PRIVATE_KEY'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
    }

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "KDA");
    console.log("Network:", await deployer.provider.getNetwork());
    console.log("");

    // Contract configuration from environment variables
    const contractName = "MusicNFT";
    const tokenName = process.env.NFT_TOKEN_NAME || "Buskers Music NFT";
    const tokenSymbol = process.env.NFT_TOKEN_SYMBOL || "BMNFT";
    const baseTokenURI = process.env.NFT_BASE_URI || "https://api.buskers.com/metadata/";

    console.log("Contract Configuration:");
    console.log("- Name:", tokenName);
    console.log("- Symbol:", tokenSymbol);
    console.log("- Base URI:", baseTokenURI);
    console.log("- RPC URL:", process.env.KADENA_TESTNET_RPC);
    console.log("- Chain ID:", process.env.KADENA_CHAIN_ID);
    console.log("");

    // Deploy the MusicNFT contract
    console.log("🚀 Deploying MusicNFT contract...");
    const MusicNFT = await ethers.getContractFactory(contractName);
    const musicNFT = await MusicNFT.deploy(tokenName, tokenSymbol, baseTokenURI);
    await musicNFT.waitForDeployment();

    const contractAddress = await musicNFT.getAddress();
    console.log("✅ MusicNFT deployed successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("");

    // Test the contract functionality
    console.log("🧪 Testing contract functionality...");
    
    // Test totalSupply (should be 0 initially)
    const initialSupply = await musicNFT.totalSupply();
    console.log("Initial total supply:", initialSupply.toString());
    
    // Test nextTokenId (should be 0 initially)
    const nextId = await musicNFT.nextTokenId();
    console.log("Next token ID:", nextId.toString());
    
    // Test minting a sample NFT with realistic Tusky/Walrus URI
    console.log("🎨 Testing mint function...");
    const sampleUploadId = `tusky-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sampleTokenURI = `tusky-walrus://${sampleUploadId}`;
    console.log("Sample Token URI:", sampleTokenURI);
    
    const mintTx = await musicNFT.mint(deployer.address, sampleTokenURI);
    await mintTx.wait();
    
    const newSupply = await musicNFT.totalSupply();
    const newNextId = await musicNFT.nextTokenId();
    console.log("After minting - Total supply:", newSupply.toString());
    console.log("After minting - Next token ID:", newNextId.toString());
    
    // Get token URI
    const tokenURI = await musicNFT.tokenURI(0);
    console.log("Minted token URI:", tokenURI);
    
    // Check if token exists
    const tokenExists = await musicNFT.exists(0);
    console.log("Token exists:", tokenExists);
    
    console.log("");
    console.log("🎉 Contract deployment and testing completed successfully!");
    console.log("");
    console.log("📋 Deployment Summary:");
    console.log("=====================");
    console.log("Contract Name:", contractName);
    console.log("Contract Address:", contractAddress);
    console.log("Token Name:", tokenName);
    console.log("Token Symbol:", tokenSymbol);
    console.log("Base URI:", baseTokenURI);
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await deployer.provider.getNetwork()).name);
    console.log("Chain ID:", (await deployer.provider.getNetwork()).chainId);
    console.log("");
    
    // Simulate contract verification
    console.log("🔍 Simulating contract verification...");
    console.log("Contract would be verified on Kadena EVM Explorer");
    console.log("Kadena Explorer URL:", `https://explorer.chainweb.com/testnet/tx/${mintTx.hash}`);
    console.log("Verification command would be:");
    console.log(`npx hardhat verify --network kadenaTestnet ${contractAddress} "${tokenName}" "${tokenSymbol}" "${baseTokenURI}"`);
    console.log("");
    
    // Environment variable setup instructions
    console.log("🔧 Environment Variables for Frontend:");
    console.log("=====================================");
    console.log(`NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx`);
    console.log("");
    
    // Save deployment info to file
    const networkInfo = await deployer.provider.getNetwork();
    const deploymentInfo = {
      contractName,
      contractAddress,
      tokenName,
      tokenSymbol,
      baseTokenURI,
      deployer: deployer.address,
      network: networkInfo.name,
      chainId: networkInfo.chainId.toString(),
      deploymentTime: new Date().toISOString(),
      transactionHash: mintTx.hash
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      'deployment-info.json', 
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("💾 Deployment info saved to deployment-info.json");
    console.log("");
    console.log("🎵 MusicNFT is ready for use with Walrus/Tusky integration!");

  } catch (error) {
    console.log(`❌ Deployment failed: ${error}`);
    console.log("💡 Make sure you have:");
    console.log("   - Sufficient KDA balance for gas fees");
    console.log("   - Correct RPC endpoint in .env");
    console.log("   - Valid private key in .env");
    console.log("   - Network connectivity to Kadena testnet");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("❌ Script failed:");
  console.error(error);
  process.exitCode = 1;
});

