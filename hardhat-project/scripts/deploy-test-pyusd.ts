import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying TestPYUSD token for Kadena EVM testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy TestPYUSD token
  console.log("\n📦 Deploying TestPYUSD token...");
  const TestPYUSD = await ethers.getContractFactory("TestPYUSD");
  const testPyusd = await TestPYUSD.deploy(
    "Test PayPal USD", // name
    "tPYUSD",          // symbol
    6,                  // decimals (like USDC)
    ethers.parseUnits("1000000", 6) // initial supply: 1M tPYUSD
  );
  await testPyusd.waitForDeployment();
  const testPyusdAddress = await testPyusd.getAddress();
  console.log("✅ TestPYUSD deployed to:", testPyusdAddress);

  // Airdrop tPYUSD to some test accounts
  console.log("\n💰 Airdropping tPYUSD to test accounts...");
  const testAccounts = [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", // Example test account
    deployer.address
  ];
  const airdropAmount = ethers.parseUnits("10000", 6); // 10,000 tPYUSD each
  
  for (const account of testAccounts) {
    try {
      await testPyusd.airdrop([account], [airdropAmount]);
      console.log(`✅ Airdropped 10,000 tPYUSD to ${account}`);
    } catch (error) {
      console.log(`⚠️  Could not airdrop to ${account}:`, error.message);
    }
  }

  // Check balances
  console.log("\n🔧 Checking balances...");
  
  const deployerBalance = await testPyusd.balanceOf(deployer.address);
  console.log("Deployer tPYUSD balance:", ethers.formatUnits(deployerBalance, 6), "tPYUSD");
  
  const totalSupply = await testPyusd.totalSupply();
  console.log("Total tPYUSD supply:", ethers.formatUnits(totalSupply, 6), "tPYUSD");

  console.log("\n🎉 TestPYUSD deployment completed successfully!");
  console.log("\n📋 Contract Information:");
  console.log("TestPYUSD Address:", testPyusdAddress);
  console.log("Symbol: tPYUSD");
  console.log("Decimals: 6");
  console.log("Total Supply: 1,000,000 tPYUSD");
  
  console.log("\n🔗 Network Information:");
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "(Chain ID:", network.chainId, ")");
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the TestPYUSD address");
  console.log("2. Update your frontend to use TestPYUSD for testing");
  console.log("3. Test minting and purchasing with tPYUSD");
  console.log("4. Use the faucet function to get more tokens if needed");
  
  // Save addresses to a file for easy reference
  const addresses = {
    network: network.name,
    chainId: network.chainId.toString(),
    testPyusd: testPyusdAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync('test-pyusd-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n💾 Contract addresses saved to test-pyusd-addresses.json");
  
  console.log("\n🎯 Faucet Usage:");
  console.log("Anyone can call the faucet function to get up to 1,000 tPYUSD:");
  console.log(`await testPyusd.faucet(ethers.parseUnits("1000", 6));`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
