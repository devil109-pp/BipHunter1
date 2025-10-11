import type { Express } from "express";
import { createServer, type Server } from "http";
import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import { ethers } from "ethers";
import * as ecc from "tiny-secp256k1";

// Initialize BIP32 with ECC
const bip32 = BIP32Factory(ecc);

// Helper function to generate random BIP39 mnemonic
function generateMnemonic(): string {
  return bip39.generateMnemonic(128); // 12 words
}

// Helper function to derive Bitcoin address from mnemonic
function getBitcoinAddress(mnemonic: string): string {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  const path = "m/44'/0'/0'/0/0"; // BIP44 path for Bitcoin
  const child = root.derivePath(path);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
  });
  return address || "";
}

// Helper function to derive Ethereum address from mnemonic
function getEthereumAddress(mnemonic: string): string {
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  return wallet.address;
}

// Helper function to check Bitcoin balance
async function checkBitcoinBalance(address: string): Promise<number> {
  try {
    const apiKey = process.env.BLOCKCHAIN_API_KEY || "";
    const url = `https://blockchain.info/q/addressbalance/${address}?confirmations=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.error(`Bitcoin API error: ${response.status}`);
      return 0;
    }

    const satoshis = await response.text();
    return parseInt(satoshis) / 100000000; // Convert satoshis to BTC
  } catch (error) {
    console.error("Error checking Bitcoin balance:", error);
    return 0;
  }
}

// Helper function to check Ethereum balance
async function checkEthereumBalance(address: string): Promise<number> {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || "";
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "1") {
      const weiBalance = data.result;
      return parseFloat(ethers.formatEther(weiBalance));
    }

    return 0;
  } catch (error) {
    console.error("Error checking Ethereum balance:", error);
    return 0;
  }
}

// Helper function to check USDT (ERC-20) balance
async function checkUSDTBalance(address: string): Promise<number> {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || "";
    const usdtContract = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT contract address
    const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${usdtContract}&address=${address}&tag=latest&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "1") {
      // USDT has 6 decimals
      return parseInt(data.result) / 1000000;
    }

    return 0;
  } catch (error) {
    console.error("Error checking USDT balance:", error);
    return 0;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate wallet and check balances
  app.post("/api/generate-wallet", async (req, res) => {
    try {
      // Generate random mnemonic
      const seedPhrase = generateMnemonic();
      
      // Derive addresses
      const btcAddress = getBitcoinAddress(seedPhrase);
      const ethAddress = getEthereumAddress(seedPhrase);

      // Check balances in parallel
      const [btcBalance, ethBalance, usdtBalance] = await Promise.all([
        checkBitcoinBalance(btcAddress),
        checkEthereumBalance(ethAddress),
        checkUSDTBalance(ethAddress),
      ]);

      // Calculate total balance (simplified - in reality you'd need price conversion)
      const totalBalance = btcBalance + ethBalance + usdtBalance;

      // Check if wallet has significant balance
      const isFound = totalBalance > 0.00001;

      const response = {
        id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        seedPhrase,
        btcAddress,
        ethAddress,
        btcBalance,
        ethBalance,
        usdtBalance,
        totalBalance,
        isFound,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error generating wallet:", error);
      res.status(500).json({
        error: "Failed to generate wallet",
        message: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
