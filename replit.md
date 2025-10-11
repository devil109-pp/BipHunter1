# Cryptocurrency Wallet Checker

## Overview

This is a BIP39-based cryptocurrency wallet generator and balance checker application. The system generates random 12-word seed phrases, derives Bitcoin and Ethereum wallet addresses from them, and checks their balances across multiple cryptocurrencies (BTC, ETH, USDT) in real-time. The application features a continuous operation mode that generates wallets until stopped, tracking found wallets with non-zero balances for potential recovery scenarios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component System**: Shadcn UI (New York variant) built on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design principles adapted for crypto dashboards, prioritizing data density and real-time updates.

**State Management**: React hooks (useState, useEffect, useRef) for local component state. TanStack React Query handles server state management with custom query client configuration that disables automatic refetching.

**Routing**: Wouter for lightweight client-side routing with a single main route (Home) and 404 fallback.

**Layout Pattern**: Two-column responsive layout (mobile stacks vertically):
- Left column (~1/3 width): Control panel with start/stop buttons and statistics
- Right column (~2/3 width): Live operations feed and found wallets display

**Real-time Updates**: Client-side polling loop that continuously generates wallets when running, using async/await patterns and ref-based state tracking to prevent race conditions.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful endpoints with a single primary route (`/api/generate-wallet`) that handles wallet generation and balance checking.

**Wallet Generation Logic**:
- Uses `bip39` library to generate 12-word mnemonic seed phrases (128-bit entropy)
- Derives Bitcoin addresses via `bitcoinjs-lib` using BIP44 path `m/44'/0'/0'/0/0` with P2PKH format
- Derives Ethereum addresses via `ethers.js` from the same mnemonic
- Initializes ECC (Elliptic Curve Cryptography) using `tiny-secp256k1` for Bitcoin operations

**Balance Checking Strategy**: External API calls to blockchain services:
- Bitcoin: blockchain.info API for address balance queries
- Ethereum/USDT: (Implementation indicates external API usage, likely Etherscan or similar)

**Error Handling**: Custom error middleware that normalizes status codes and messages, with errors propagated back to client.

**Development Mode**: Vite middleware integration in development with HMR (Hot Module Replacement) support. Production serves static files from dist/public.

### Data Storage

**Current Implementation**: In-memory storage using a Map-based storage layer (`MemStorage` class) for user data. No database persistence is currently active despite Drizzle ORM being configured.

**Schema Definition**: Drizzle ORM configured with PostgreSQL dialect, schema located in `shared/schema.ts`, but appears unused in the current implementation.

**Data Models**:
- **Operation**: Represents each wallet generation attempt with seed phrase, addresses, balances, status (pending/checking/success/error), and timestamp
- **FoundWallet**: Subset of Operation data for wallets with balance > 0.00001
- Client-side state manages arrays of these objects with no backend persistence

**Rationale**: The in-memory approach suggests this is a utility tool for one-off sessions rather than a long-term wallet tracking system. Database integration is prepared but not implemented, allowing for future persistence if needed.

### External Dependencies

**Blockchain Libraries**:
- `bip39`: BIP39 mnemonic phrase generation and validation
- `bitcoinjs-lib`: Bitcoin address derivation and transaction handling
- `ethers.js`: Ethereum wallet management and address derivation
- `tiny-secp256k1`: Elliptic curve cryptography for Bitcoin

**External APIs**:
- Blockchain.info API for Bitcoin balance queries (requires optional API key via `BLOCKCHAIN_API_KEY` environment variable)
- Ethereum balance checking service (implementation details in incomplete code)

**UI Component Libraries**:
- Radix UI primitives (29 components including dialog, dropdown, toast, etc.)
- Tailwind CSS for utility-first styling
- Lucide React for iconography
- `class-variance-authority` and `clsx` for conditional className management

**Development Tools**:
- Replit-specific plugins: cartographer, dev-banner, runtime-error-modal
- TypeScript for type safety across client/server
- ESBuild for production server bundling

**Database (Configured but Unused)**:
- `@neondatabase/serverless`: Neon PostgreSQL serverless driver
- `drizzle-orm`: Type-safe ORM with PostgreSQL support
- `drizzle-kit`: Schema management and migrations

**Design Tokens**: Custom CSS variables for theming with dark mode as default, using HSL color space for consistent color manipulation across light/dark modes.