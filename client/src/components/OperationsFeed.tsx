import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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

interface OperationsFeedProps {
  operations: Operation[];
}

export function OperationsFeed({ operations }: OperationsFeedProps) {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [operations]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const truncateSeedPhrase = (phrase: string) => {
    const words = phrase.split(" ");
    if (words.length <= 6) return phrase;
    return `${words.slice(0, 6).join(" ")}...`;
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Operations
          <Badge variant="secondary" className="ml-auto" data-testid="text-operations-count">
            Last {Math.min(operations.length, 20)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full px-6" ref={scrollRef}>
          <div className="space-y-3">
            {operations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No operations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click START to begin generating wallets
                </p>
              </div>
            ) : (
              operations.map((op, index) => (
                <div
                  key={op.id}
                  className={`p-4 rounded-md border transition-all animate-slide-in ${
                    op.isFound
                      ? "bg-primary/5 border-primary/30"
                      : index % 2 === 0
                      ? "bg-muted/30"
                      : "bg-card"
                  }`}
                  data-testid={`operation-${op.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {truncateSeedPhrase(op.seedPhrase)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(op.seedPhrase, "Seed phrase")}
                          data-testid={`button-copy-seed-${op.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(op.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {op.status === "checking" && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Checking
                        </Badge>
                      )}
                      {op.status === "success" && !op.isFound && (
                        <Badge variant="secondary">Empty</Badge>
                      )}
                      {op.status === "success" && op.isFound && (
                        <Badge className="bg-primary text-primary-foreground">
                          Found!
                        </Badge>
                      )}
                      {op.status === "error" && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">BTC:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{truncateAddress(op.btcAddress)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyToClipboard(op.btcAddress, "BTC address")}
                          data-testid={`button-copy-btc-${op.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">ETH:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{truncateAddress(op.ethAddress)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyToClipboard(op.ethAddress, "ETH address")}
                          data-testid={`button-copy-eth-${op.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {op.status === "success" && (
                    <div className="mt-3 pt-3 border-t flex items-center gap-3 text-xs">
                      <Badge variant="outline" className="bg-bitcoin/10 text-bitcoin border-bitcoin/30">
                        BTC: {op.btcBalance.toFixed(8)}
                      </Badge>
                      <Badge variant="outline" className="bg-ethereum/10 text-ethereum border-ethereum/30">
                        ETH: {op.ethBalance.toFixed(8)}
                      </Badge>
                      <Badge variant="outline" className="bg-usdt/10 text-usdt border-usdt/30">
                        USDT: {op.usdtBalance.toFixed(2)}
                      </Badge>
                    </div>
                  )}

                  {op.error && (
                    <div className="mt-2 text-xs text-destructive">
                      {op.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
