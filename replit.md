# Crypto Wallet Checker

## Overview
A cryptocurrency wallet generator that creates random BIP39 12-word seed phrases and checks Bitcoin, Ethereum, and USDT balances in real-time via blockchain APIs. The application features a beautiful dark-themed dashboard with real-time wallet generation, balance verification, and export functionality.

## Current State
Fully functional MVP with:
- ✅ BIP39 wallet generation (12-word seed phrases)
- ✅ Bitcoin, Ethereum, and USDT address derivation
- ✅ Real-time balance checking via Blockchain.com and Etherscan APIs
- ✅ Operations feed showing last 20 wallet checks
- ✅ Found wallets section (balance > 0.00001)
- ✅ Export functionality for found wallets
- ✅ Start/Stop controls with real-time stats
- ✅ Beautiful UI following Material Design principles

## Recent Changes
**October 11, 2025**
- Initial implementation completed
- Fixed bitcoinjs-lib initialization with BIP32Factory and tiny-secp256k1
- Fixed frontend API response handling
- Implemented complete wallet generation loop with proper state management
- Added comprehensive UI with ControlPanel, OperationsFeed, and FoundWallets components
- Successfully tested all features end-to-end

## Project Architecture

### Frontend
- **Framework**: React with TypeScript
- **State Management**: React hooks with refs for real-time updates
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/UI components (Card, Button, Badge, ScrollArea, etc.)
- **Routing**: Wouter

### Backend
- **Framework**: Express.js
- **Crypto Libraries**: 
  - bip39 for mnemonic generation
  - bip32 with tiny-secp256k1 for Bitcoin key derivation
  - bitcoinjs-lib for Bitcoin address generation
  - ethers.js for Ethereum wallet derivation
- **APIs**: 
  - Blockchain.com API for Bitcoin balance checking
  - Etherscan API for Ethereum and USDT balance checking

### Key Components

#### Control Panel (`client/src/components/ControlPanel.tsx`)
- Large circular Start/Stop buttons
- Real-time statistics display:
  - Total Operations counter
  - Found Wallets counter
  - Operations per second (speed indicator)
- Running status indicator with pulsing animation

#### Operations Feed (`client/src/components/OperationsFeed.tsx`)
- Displays last 20 wallet generation operations
- Shows truncated seed phrases with copy functionality
- Displays Bitcoin and Ethereum addresses
- Balance badges for BTC, ETH, and USDT
- Auto-scrolls to show latest operations
- Relative timestamps

#### Found Wallets (`client/src/components/FoundWallets.tsx`)
- Prominent display for wallets with balance > 0.00001
- Expandable cards showing full details
- Copy functionality for seed phrases and addresses
- Export to JSON functionality
- Beautiful empty state

### Data Flow
1. User clicks START button
2. Frontend enters running state and begins infinite loop
3. Each iteration:
   - Generates random 12-word BIP39 mnemonic
   - Derives Bitcoin address (BIP44 path: m/44'/0'/0'/0/0)
   - Derives Ethereum address
   - Checks balances via external APIs
   - Updates operations feed and statistics
4. If wallet has balance > 0.00001, adds to found wallets
5. User clicks STOP to halt generation

### API Endpoints

#### POST /api/generate-wallet
Generates a new wallet and checks balances.

**Response:**
```json
{
  "id": "wallet-123456789-abc123",
  "seedPhrase": "word1 word2 ... word12",
  "btcAddress": "1ABC...",
  "ethAddress": "0xABC...",
  "btcBalance": 0.00000000,
  "ethBalance": 0.00000000,
  "usdtBalance": 0.00,
  "totalBalance": 0.00,
  "isFound": false,
  "timestamp": "2025-10-11T22:00:00.000Z"
}
```

## Environment Variables
- `BLOCKCHAIN_API_KEY`: API key for Blockchain.com (Bitcoin balance checks)
- `ETHERSCAN_API_KEY`: API key for Etherscan (Ethereum and USDT balance checks)
- `SESSION_SECRET`: Session secret for Express
- `NODE_ENV`: Environment mode (development/production)

## Design System

### Color Palette (Dark Theme)
- Background: `220 20% 12%` (deep slate)
- Card Surface: `220 18% 16%` (elevated panels)
- Primary (Success): `142 76% 45%` (vibrant green)
- Destructive (Stop): `0 84% 60%` (bright red)
- Bitcoin: `25 95% 53%` (orange)
- Ethereum: `221 83% 53%` (blue)
- USDT: `142 71% 45%` (green)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Headings**: 600-700 weight, -0.02em tracking
- **Body**: 400-500 weight
- **Monospace** (addresses/hashes): JetBrains Mono
- **Metrics**: 600 weight, tabular numbers

### Spacing
- Consistent spacing: 3, 4, 6, 8, 12 (Tailwind units)
- Container: max-w-7xl with px-4 padding
- Layout: Two-column (1/3 control panel, 2/3 operations/found wallets)

### Animations
- Start button: Pulse glow animation when active
- New operations: Slide-in from top
- Found wallets: Subtle shake + border glow
- Status indicator: Pulsing green dot when running

## Development

### Running Locally
```bash
npm run dev
```
Starts Express server on port 5000 with Vite dev server for frontend.

### Testing
The application has been tested end-to-end with:
- Wallet generation and display
- Start/Stop functionality
- Real-time statistics updates
- Copy to clipboard features
- Toast notifications

### Known Limitations
- Blockchain.com API has rate limits (429 errors expected with rapid requests)
- Etherscan API has rate limits (5 calls/second on free tier)
- Balance checking is sequential and may slow generation speed
- In-memory storage (no persistence between server restarts)

## User Guide

### How to Use
1. **Start Generation**: Click the green START button
   - Status changes to "Running" with pulsing green indicator
   - Wallets begin generating automatically
   - Operations feed updates in real-time

2. **Monitor Progress**: 
   - Total Operations counter shows number of wallets checked
   - Operations per second shows generation speed
   - Found Wallets counter shows successful discoveries

3. **View Operations**:
   - Last 20 operations displayed in feed
   - Each shows seed phrase, addresses, and balances
   - Click copy buttons to copy seed phrases or addresses

4. **Stop Generation**: Click the red STOP button
   - Generation halts immediately
   - All data remains visible

5. **Export Found Wallets**:
   - Click Export button in Found Wallets section
   - Downloads JSON file with all wallet details

### Security Notice
⚠️ **Important**: This application generates random seed phrases for educational purposes. Never use wallets generated by unknown tools for storing real cryptocurrency. The probability of finding a wallet with funds is astronomically low.

## Future Enhancements
- Persistent storage for found wallets
- Support for additional cryptocurrencies
- Configurable balance threshold
- Performance metrics and charts
- Batch export options (CSV format)
- Custom derivation paths
- Multi-threading for faster generation
