import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/compliance")({
  component: CompliancePage,
});

const yearlyData = [
  {
    year: "2026/27",
    total: 12450,
    baseline: false,
    scopes: { s1: 4200, s2: 6230, s3: 2020 },
    change: -8.2,
  },
  {
    year: "2025/26",
    total: 13560,
    baseline: false,
    scopes: { s1: 4800, s2: 6700, s3: 2060 },
    change: -5.1,
  },
  {
    year: "2024/25",
    total: 14290,
    baseline: true,
    scopes: { s1: 5100, s2: 7100, s3: 2090 },
    change: 0,
  },
];

function CompliancePage() {
  const [expanded, setExpanded] = useState<string | null>("2026/27");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compliance History</h1>
        <p className="text-muted-foreground">Year-over-year carbon footprint comparison</p>
      </div>

      {/* Summary bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Baseline Year</p>
            <p className="text-2xl font-bold">2024/25</p>
            <p className="text-xs text-muted-foreground">14,290 kg CO₂e</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Current Year</p>
            <p className="text-2xl font-bold">2026/27</p>
            <p className="text-xs text-muted-foreground">12,450 kg CO₂e</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Reduction</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-success">-12.9%</p>
              <TrendingDown className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Since baseline</p>
          </CardContent>
        </Card>
      </div>

      {/* Year breakdown */}
      <div className="space-y-3">
        {yearlyData.map((y) => (
          <Card key={y.year} className="overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-accent/30"
              onClick={() => setExpanded(expanded === y.year ? null : y.year)}
            >
              <div className="flex items-center gap-3">
                {expanded === y.year ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{y.year}</span>
                    {y.baseline && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Baseline
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{y.total.toLocaleString()} kg CO₂e</p>
                </div>
              </div>
              {y.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${y.change < 0 ? "text-success" : "text-destructive"}`}>
                  {y.change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  {y.change > 0 ? "+" : ""}{y.change}%
                </div>
              )}
            </button>
            {expanded === y.year && (
              <div className="border-t bg-accent/20 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Scope 1 (Direct)</p>
                    <p className="text-lg font-semibold">{y.scopes.s1.toLocaleString()} kg</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-chart-1" style={{ width: `${(y.scopes.s1 / y.total) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Scope 2 (Energy)</p>
                    <p className="text-lg font-semibold">{y.scopes.s2.toLocaleString()} kg</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-chart-2" style={{ width: `${(y.scopes.s2 / y.total) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Scope 3 (Indirect)</p>
                    <p className="text-lg font-semibold">{y.scopes.s3.toLocaleString()} kg</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-chart-3" style={{ width: `${(y.scopes.s3 / y.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}