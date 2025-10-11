import { z } from "zod";

// Operation schema - represents each wallet generation attempt
export const operationSchema = z.object({
  id: z.string(),
  seedPhrase: z.string(),
  timestamp: z.date(),
  btcAddress: z.string(),
  ethAddress: z.string(),
  btcBalance: z.number(),
  ethBalance: z.number(),
  usdtBalance: z.number(),
  totalBalance: z.number(),
  isFound: z.boolean(),
  status: z.enum(["pending", "checking", "success", "error"]),
  error: z.string().optional(),
});

export type Operation = z.infer<typeof operationSchema>;

// Found wallet schema - wallets with balance > 0.00001
export const foundWalletSchema = z.object({
  id: z.string(),
  seedPhrase: z.string(),
  timestamp: z.date(),
  btcAddress: z.string(),
  ethAddress: z.string(),
  btcBalance: z.number(),
  ethBalance: z.number(),
  usdtBalance: z.number(),
  totalBalance: z.number(),
});

export type FoundWallet = z.infer<typeof foundWalletSchema>;

// API Request/Response schemas
export const generateWalletRequestSchema = z.object({
  checkBalance: z.boolean().default(true),
});

export const generateWalletResponseSchema = z.object({
  id: z.string(),
  seedPhrase: z.string(),
  btcAddress: z.string(),
  ethAddress: z.string(),
  btcBalance: z.number(),
  ethBalance: z.number(),
  usdtBalance: z.number(),
  totalBalance: z.number(),
  isFound: z.boolean(),
  timestamp: z.string(),
});

export type GenerateWalletRequest = z.infer<typeof generateWalletRequestSchema>;
export type GenerateWalletResponse = z.infer<typeof generateWalletResponseSchema>;

// Stats schema
export const statsSchema = z.object({
  totalOperations: z.number(),
  foundWallets: z.number(),
  operationsPerSecond: z.number(),
  successRate: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;
