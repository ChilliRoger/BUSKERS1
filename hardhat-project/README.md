# MockPYUSD Hardhat Project

A Hardhat project for deploying MockPYUSD ERC-20 token to Kadena's EVM testnet.

## Features

- **MockPYUSD Contract**: ERC-20 token with mint functionality for testing
- **Kadena EVM Testnet**: Configured for Kadena's EVM testnet deployment
- **TypeScript Support**: Full TypeScript integration with type safety
- **Dynamic ABI**: Contract ABI generated dynamically for frontend integration
- **Contract Verification**: Simulated verification process with detailed logging

## Contract Details

### MockPYUSD.sol
- **Name**: MockPYUSD
- **Symbol**: MPYUSD
- **Decimals**: 6 (same as PYUSD)
- **Initial Supply**: 1,000,000 MPYUSD
- **Max Supply**: 10,000,000 MPYUSD

### Functions
- `mint(uint256 amount)`: Anyone can mint tokens (for testing)
- `mintTo(address to, uint256 amount)`: Owner-only minting
- `burn(uint256 amount)`: Burn tokens from caller's balance
- `getMaxSupply()`: Get maximum supply limit

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with:
   ```env
   # Kadena EVM Testnet Configuration
   KADENA_TESTNET_RPC=https://api.testnet.chainweb.com/evm
   KADENA_CHAIN_ID=1
   
   # Private key for deployment (without 0x prefix)
   PRIVATE_KEY=your_private_key_here
   ```

3. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

4. **Deploy to Kadena Testnet**
   ```bash
   npx hardhat run scripts/deploy-pyusd.ts --network kadenaTestnet
   ```

## Usage

### Deploy Contract
```bash
npx hardhat run scripts/deploy-pyusd.ts --network kadenaTestnet
```

### Using the Contract in Frontend
```typescript
import { getPYUSDContract, getContractInfo } from './lib/kadena-utils';

// Get contract instance
const contract = getPYUSDContract('0x...');

// Get contract information
const info = await getContractInfo('0x...');
console.log(info);

// Mint tokens
const tx = await contract.mint(ethers.parseUnits('1000', 6));
await tx.wait();
```

### Contract Verification Simulation
The deployment script includes simulated contract verification with:
- Contract details logging
- Network information
- Deployment transaction details
- Gas usage information
- Compiler settings

## Project Structure

```
hardhat-project/
├── contracts/
│   └── MockPYUSD.sol          # ERC-20 token contract
├── scripts/
│   └── deploy-pyusd.ts        # Deployment script
├── lib/
│   └── kadena-utils.ts        # Utility functions
├── test/                       # Test files
├── hardhat.config.ts          # Hardhat configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Network Configuration

### Kadena EVM Testnet
- **RPC URL**: https://api.testnet.chainweb.com/evm
- **Chain ID**: 1
- **Currency**: KDA
- **Block Explorer**: https://explorer.chainweb.com/testnet

## Scripts

- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat run scripts/deploy-pyusd.ts --network kadenaTestnet` - Deploy to Kadena
- `npx hardhat clean` - Clean artifacts and cache

## Security Notes

- This is a **MOCK** token for testing purposes only
- The `mint` function allows anyone to mint tokens
- Do not use in production without proper access controls
- Always verify contract addresses before use

## License

MIT
