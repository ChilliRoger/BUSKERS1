import { ethers } from "ethers";

async function main() {
  console.log("🔑 Getting wallet information for Kadena EVM testnet...\n");

  const privateKey = "d9099c50c75b214417bdd576014ac55cf3d4270e3e1c31cb37af5a03f345c4d0";
  const wallet = new ethers.Wallet(privateKey);

  console.log("📋 Wallet Information:");
  console.log("Private Key:", privateKey);
  console.log("Wallet Address:", wallet.address);
  console.log("");

  console.log("💰 Next Steps:");
  console.log("1. Visit: https://tools.kadena.io/faucet/evm");
  console.log("2. Enter your wallet address:", wallet.address);
  console.log("3. Request testnet KDA tokens");
  console.log("4. Wait for tokens to arrive (usually instant)");
  console.log("5. Run deployment: npx hardhat run scripts/deploy-pyusd.ts --network kadena");
  console.log("");

  console.log("🌐 Kadena EVM Testnet Details:");
  console.log("RPC URL: https://api.testnet.chainweb.com/evm");
  console.log("Chain ID: 1");
  console.log("Currency: KDA");
  console.log("Block Explorer: https://evm.kadena.io/");
  console.log("");

  console.log("🏆 ETH Delhi Hackathon - Kadena Track");
  console.log("Your contract will be deployed to Kadena's high-performance EVM testnet!");
}

main().catch((error) => {
  console.error("❌ Error:");
  console.error(error);
  process.exitCode = 1;
});
