import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// MockPYUSD Contract ABI - dynamically generated from contract
const MOCK_PYUSD_ABI = [
  // ERC20 Standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // MockPYUSD specific functions
  "function mint(uint256 amount)",
  "function mintTo(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function getMaxSupply() view returns (uint256)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Mint(address indexed to, uint256 amount)",
  "event Burn(address indexed from, uint256 amount)"
];

/**
 * Interface for MockPYUSD contract
 */
export interface MockPYUSDContract extends ethers.Contract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<bigint>;
  balanceOf(owner: string): Promise<bigint>;
  allowance(owner: string, spender: string): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<ethers.TransactionResponse>;
  approve(spender: string, amount: bigint): Promise<ethers.TransactionResponse>;
  transferFrom(from: string, to: string, amount: bigint): Promise<ethers.TransactionResponse>;
  mint(amount: bigint): Promise<ethers.TransactionResponse>;
  mintTo(to: string, amount: bigint): Promise<ethers.TransactionResponse>;
  burn(amount: bigint): Promise<ethers.TransactionResponse>;
  getMaxSupply(): Promise<bigint>;
}

/**
 * Get Kadena EVM testnet configuration
 */
export function getKadenaConfig() {
  const rpcUrl = process.env.KADENA_TESTNET_RPC || "https://api.testnet.chainweb.com/evm";
  const chainId = parseInt(process.env.KADENA_CHAIN_ID || "1");
  
  return {
    rpcUrl,
    chainId,
    name: "Kadena EVM Testnet"
  };
}

/**
 * Create a provider for Kadena EVM testnet
 */
export function createKadenaProvider(): ethers.JsonRpcProvider {
  const config = getKadenaConfig();
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

/**
 * Get MockPYUSD contract instance
 * @param address The deployed contract address
 * @param provider Optional provider (uses Kadena testnet by default)
 * @returns Contract instance with typed methods
 */
export function getPYUSDContract(
  address: string, 
  provider?: ethers.Provider | ethers.Signer
): MockPYUSDContract {
  if (!ethers.isAddress(address)) {
    throw new Error(`Invalid contract address: ${address}`);
  }

  const contractProvider = provider || createKadenaProvider();
  const contract = new ethers.Contract(address, MOCK_PYUSD_ABI, contractProvider) as MockPYUSDContract;
  
  return contract;
}

/**
 * Get MockPYUSD contract instance with signer for transactions
 * @param address The deployed contract address
 * @param privateKey The private key for signing transactions
 * @returns Contract instance with signer
 */
export function getPYUSDContractWithSigner(
  address: string,
  privateKey: string
): MockPYUSDContract {
  if (!ethers.isAddress(address)) {
    throw new Error(`Invalid contract address: ${address}`);
  }

  const provider = createKadenaProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(address, MOCK_PYUSD_ABI, wallet) as MockPYUSDContract;
  
  return contract;
}

/**
 * Format token amount with proper decimals
 * @param amount The raw token amount
 * @param decimals The number of decimals
 * @returns Formatted string
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse token amount from string to bigint
 * @param amount The token amount as string
 * @param decimals The number of decimals
 * @returns Parsed bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return ethers.parseUnits(amount, decimals);
}

/**
 * Get contract information
 * @param contractAddress The deployed contract address
 * @returns Contract information object
 */
export async function getContractInfo(contractAddress: string) {
  const contract = getPYUSDContract(contractAddress);
  
  try {
    const [name, symbol, decimals, totalSupply, maxSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
      contract.getMaxSupply()
    ]);

    return {
      address: contractAddress,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: formatTokenAmount(totalSupply, Number(decimals)),
      maxSupply: formatTokenAmount(maxSupply, Number(decimals)),
      network: getKadenaConfig().name
    };
  } catch (error) {
    throw new Error(`Failed to get contract info: ${error}`);
  }
}

/**
 * Check if contract is deployed and accessible
 * @param contractAddress The deployed contract address
 * @returns Promise<boolean>
 */
export async function isContractDeployed(contractAddress: string): Promise<boolean> {
  try {
    const contract = getPYUSDContract(contractAddress);
    await contract.name();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get contract ABI for frontend use
 * @returns The contract ABI as JSON string
 */
export function getContractABI(): string {
  return JSON.stringify(MOCK_PYUSD_ABI, null, 2);
}

/**
 * Validate contract address format
 * @param address The address to validate
 * @returns boolean
 */
export function isValidContractAddress(address: string): boolean {
  return ethers.isAddress(address);
}
