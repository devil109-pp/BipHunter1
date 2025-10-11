import { Play, Square, Activity, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  totalOperations: number;
  foundWallets: number;
  operationsPerSecond: number;
}

export function ControlPanel({
  isRunning,
  onStart,
  onStop,
  totalOperations,
  foundWallets,
  operationsPerSecond,
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      {/* Control Buttons */}
      <Card className="overflow-visible">
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-6">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full transition-all ${
                isRunning
                  ? "bg-primary animate-pulse-glow"
                  : "bg-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {isRunning ? "Running" : "Stopped"}
            </span>
          </div>

          {/* Control Button */}
          {isRunning ? (
            <Button
              size="lg"
              variant="destructive"
              className="rounded-full h-24 w-24 flex flex-col items-center justify-center gap-1"
              onClick={onStop}
              data-testid="button-stop"
            >
              <Square className="h-8 w-8" />
              <span className="text-xs font-semibold">STOP</span>
            </Button>
          ) : (
            <Button
              size="lg"
              className="rounded-full h-24 w-24 flex flex-col items-center justify-center gap-1"
              onClick={onStart}
              data-testid="button-start"
            >
              <Play className="h-8 w-8" />
              <span className="text-xs font-semibold">START</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="space-y-4">
        {/* Total Operations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums" data-testid="text-total-operations">
              {totalOperations.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Found Wallets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Found Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-primary" data-testid="text-found-wallets">
              {foundWallets.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Operations Per Second */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums" data-testid="text-operations-per-second">
                {operationsPerSecond.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">ops/s</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
