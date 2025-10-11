import { useState, useEffect, useRef } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { OperationsFeed } from "@/components/OperationsFeed";
import { FoundWallets } from "@/components/FoundWallets";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Operation {
  id: string;
  seedPhrase: string;
  timestamp: Date;
  btcAddress: string;
  ethAddress: string;
  btcBalance: number;
  ethBalance: number;
  usdtBalance: number;
  totalBalance: number;
  isFound: boolean;
  status: "pending" | "checking" | "success" | "error";
  error?: string;
}

interface FoundWallet {
  id: string;
  seedPhrase: string;
  timestamp: Date;
  btcAddress: string;
  ethAddress: string;
  btcBalance: number;
  ethBalance: number;
  usdtBalance: number;
  totalBalance: number;
}

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [foundWallets, setFoundWallets] = useState<FoundWallet[]>([]);
  const [totalOperations, setTotalOperations] = useState(0);
  const [operationsPerSecond, setOperationsPerSecond] = useState(0);
  const { toast } = useToast();
  const isRunningRef = useRef(false);
  const operationCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const generateWallet = async () => {
    if (!isRunningRef.current) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempOperation: Operation = {
      id: tempId,
      seedPhrase: "Generating...",
      timestamp: new Date(),
      btcAddress: "",
      ethAddress: "",
      btcBalance: 0,
      ethBalance: 0,
      usdtBalance: 0,
      totalBalance: 0,
      isFound: false,
      status: "checking",
    };

    setOperations((prev) => [tempOperation, ...prev].slice(0, 20));

    try {
      const res = await apiRequest("POST", "/api/generate-wallet", {});
      const response = await res.json();

      if (!isRunningRef.current) return;

      const operation: Operation = {
        id: response.id,
        seedPhrase: response.seedPhrase,
        timestamp: new Date(response.timestamp),
        btcAddress: response.btcAddress,
        ethAddress: response.ethAddress,
        btcBalance: response.btcBalance,
        ethBalance: response.ethBalance,
        usdtBalance: response.usdtBalance,
        totalBalance: response.totalBalance,
        isFound: response.isFound,
        status: "success",
      };

      setOperations((prev) => {
        const filtered = prev.filter((op) => op.id !== tempId);
        return [operation, ...filtered].slice(0, 20);
      });

      operationCountRef.current += 1;
      setTotalOperations(operationCountRef.current);

      // Calculate operations per second
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const ops = operationCountRef.current / Math.max(elapsed, 1);
      setOperationsPerSecond(ops);

      if (operation.isFound) {
        const foundWallet: FoundWallet = {
          id: operation.id,
          seedPhrase: operation.seedPhrase,
          timestamp: operation.timestamp,
          btcAddress: operation.btcAddress,
          ethAddress: operation.ethAddress,
          btcBalance: operation.btcBalance,
          ethBalance: operation.ethBalance,
          usdtBalance: operation.usdtBalance,
          totalBalance: operation.totalBalance,
        };

        setFoundWallets((prev) => [foundWallet, ...prev]);

        toast({
          title: "🎉 Wallet Found!",
          description: `Total balance: $${operation.totalBalance.toFixed(2)}`,
          duration: 5000,
        });
      }

      // Continue generating if still running
      if (isRunningRef.current) {
        setTimeout(() => generateWallet(), 100);
      }
    } catch (error: any) {
      if (!isRunningRef.current) return;

      const errorOperation: Operation = {
        id: tempId,
        seedPhrase: "Error",
        timestamp: new Date(),
        btcAddress: "",
        ethAddress: "",
        btcBalance: 0,
        ethBalance: 0,
        usdtBalance: 0,
        totalBalance: 0,
        isFound: false,
        status: "error",
        error: error.message || "Failed to generate wallet",
      };

      setOperations((prev) => {
        const filtered = prev.filter((op) => op.id !== tempId);
        return [errorOperation, ...filtered].slice(0, 20);
      });

      // Continue despite error
      if (isRunningRef.current) {
        setTimeout(() => generateWallet(), 500);
      }
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    operationCountRef.current = totalOperations;
    toast({
      title: "Started",
      description: "Wallet generation in progress...",
      duration: 2000,
    });
    setTimeout(() => generateWallet(), 100);
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "Stopped",
      description: `Completed ${totalOperations} operations`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Wallet Checker</h1>
          <p className="text-muted-foreground">
            BIP39 wallet generator with real-time balance verification for Bitcoin, Ethereum, and USDT
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              isRunning={isRunning}
              onStart={handleStart}
              onStop={handleStop}
              totalOperations={totalOperations}
              foundWallets={foundWallets.length}
              operationsPerSecond={operationsPerSecond}
            />
          </div>

          {/* Right Column - Operations & Found Wallets */}
          <div className="lg:col-span-2 space-y-6">
            <OperationsFeed operations={operations} />
            <FoundWallets wallets={foundWallets} />
          </div>
        </div>
      </div>
    </div>
  );
}
