import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, Copy, Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

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

interface FoundWalletsProps {
  wallets: FoundWallet[];
}

export function FoundWallets({ wallets }: FoundWalletsProps) {
  const { toast } = useToast();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const exportWallets = () => {
    const data = wallets.map(w => ({
      seedPhrase: w.seedPhrase,
      btcAddress: w.btcAddress,
      ethAddress: w.ethAddress,
      btcBalance: w.btcBalance,
      ethBalance: w.ethBalance,
      usdtBalance: w.usdtBalance,
      totalBalance: w.totalBalance,
      foundAt: w.timestamp.toISOString(),
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `found-wallets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: `${wallets.length} wallet(s) exported to JSON`,
      duration: 3000,
    });
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="h-[500px] flex flex-col border-primary/30 animate-pulse-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Found Wallets
            <Badge className="ml-2" data-testid="text-found-count">
              {wallets.length}
            </Badge>
          </CardTitle>
          {wallets.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportWallets}
              data-testid="button-export"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full px-6">
          {wallets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No wallets found yet
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Wallets with balance greater than 0.00001 will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <Collapsible
                  key={wallet.id}
                  open={openItems.includes(wallet.id)}
                  onOpenChange={() => toggleItem(wallet.id)}
                >
                  <Card className="bg-primary/5 border-primary/30 animate-shake overflow-visible">
                    <CollapsibleTrigger className="w-full" data-testid={`wallet-${wallet.id}`}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-primary text-primary-foreground">
                                Active Wallet
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(wallet.timestamp, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline" className="bg-bitcoin/10 text-bitcoin border-bitcoin/30">
                                BTC: {wallet.btcBalance.toFixed(8)}
                              </Badge>
                              <Badge variant="outline" className="bg-ethereum/10 text-ethereum border-ethereum/30">
                                ETH: {wallet.ethBalance.toFixed(8)}
                              </Badge>
                              <Badge variant="outline" className="bg-usdt/10 text-usdt border-usdt/30">
                                USDT: {wallet.usdtBalance.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">
                              Total Value
                            </div>
                            <div className="text-lg font-bold text-primary">
                              ${wallet.totalBalance.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4 space-y-3 border-t">
                        {/* Seed Phrase */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Seed Phrase
                          </label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <code className="text-xs font-mono flex-1 break-all">
                              {wallet.seedPhrase}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(wallet.seedPhrase, "Seed phrase");
                              }}
                              data-testid={`button-copy-seed-${wallet.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* BTC Address */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Bitcoin Address
                          </label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <code className="text-xs font-mono flex-1 break-all">
                              {wallet.btcAddress}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(wallet.btcAddress, "BTC address");
                              }}
                              data-testid={`button-copy-btc-${wallet.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* ETH Address */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Ethereum Address
                          </label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <code className="text-xs font-mono flex-1 break-all">
                              {wallet.ethAddress}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(wallet.ethAddress, "ETH address");
                              }}
                              data-testid={`button-copy-eth-${wallet.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
