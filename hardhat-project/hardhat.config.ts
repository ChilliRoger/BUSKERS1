import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {

    kadenaTestnet: {
      url:"https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
      chainId:  5920,
      accounts: ["d9099c50c75b214417bdd576014ac55cf3d4270e3e1c31cb37af5a03f345c4d0"],
      gas: 8000000,
      gasPrice: 1000000000, // 1 gwei
      timeout: 60000,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./typechain-types",
    target: "ethers-v6",
  },
};

export default config;
