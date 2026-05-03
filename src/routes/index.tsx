import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  FileText,
  ArrowRight,
  Zap,
  Droplets,
  Flame,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const mockMetrics = [
  { label: "Total Carbon", value: "12,450", unit: "kg CO₂e", change: "-8.2%", icon: Leaf, trend: "down" as const },
  { label: "Electricity", value: "6,230", unit: "kWh", change: "-12%", icon: Zap, trend: "down" as const },
  { label: "Water", value: "340", unit: "m³", change: "+2.1%", icon: Droplets, trend: "up" as const },
  { label: "Waste", value: "890", unit: "kg", change: "-5.4%", icon: Trash2, trend: "down" as const },
];

const gapData = [
  { category: "Electricity (S2)", months: [true, true, true, true, false, false] },
  { category: "Gas (S1)", months: [true, true, true, true, true, false] },
  { category: "Waste (S3)", months: [false, false, false, false, false, false] },
  { category: "Business Travel (S3)", months: [true, false, true, false, false, false] },
  { category: "Commuting (S3)", months: [true, true, true, true, false, false] },
];

const recentEntries = [
  { type: "Electricity", site: "HQ London", carbon: 245.3, month: "Mar 2026" },
  { type: "Gas", site: "Warehouse Birmingham", carbon: 180.1, month: "Mar 2026" },
  { type: "Water", site: "HQ London", carbon: 12.8, month: "Feb 2026" },
];

const overdueProjects = [
  { name: "EV Fleet Transition (Phase 1)", targetDate: "2025-12-01", category: "Transport", daysOverdue: 518 },
];

const dueSoonProjects = [
  { name: "Install Solar Panels", targetDate: "2026-06-15", category: "Renewable Energy", daysLeft: 43 },
];

function DashboardPage() {
  const complianceScore = 68;
  const monthLabels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">FY 2026/27 Compliance Overview</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/audit">
              <Plus className="h-4 w-4" />
              New Entry
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/sign-off">
              <FileText className="h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockMetrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    m.trend === "down" ? "text-success" : "text-destructive"
                  }`}
                >
                  <TrendingDown className={`h-3 w-3 ${m.trend === "up" ? "rotate-180" : ""}`} />
                  {m.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">
                  {m.unit} · {m.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compliance Score */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-6">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="currentColor"
                  className="text-primary transition-all duration-1000"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(complianceScore / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold">{complianceScore}%</span>
              </div>
            </div>
            {complianceScore < 100 ? (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Action needed — gaps detected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tender Ready</span>
              </div>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/gaps">
                View Gap Finder
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Gap Finder Preview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Data Coverage</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/gaps">
                Full View
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 text-left font-medium text-muted-foreground">Category</th>
                    {monthLabels.map((m) => (
                      <th key={m} className="pb-2 text-center font-medium text-muted-foreground">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gapData.map((row) => (
                    <tr key={row.category} className="border-t">
                      <td className="py-2 pr-4 font-medium">{row.category}</td>
                      {row.months.map((logged, i) => (
                        <td key={i} className="py-2 text-center">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                              logged
                                ? "bg-success/15 text-success"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {logged ? "✓" : "!"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Entries</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEntries.map((entry, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                    <Flame className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{entry.type}</p>
                    <p className="text-xs text-muted-foreground">{entry.site}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{entry.carbon} kg CO₂e</p>
                  <p className="text-xs text-muted-foreground">{entry.month}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Accountability */}
      {(overdueProjects.length > 0 || dueSoonProjects.length > 0) && (
        <Card className={overdueProjects.length > 0 ? "border-destructive/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Project Alerts
              </CardTitle>
              <CardDescription>Reduction commitments needing attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/projects">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueProjects.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · Overdue by {p.daysOverdue} days</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-destructive">Compliance Risk</span>
              </div>
            ))}
            {dueSoonProjects.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-warning/10 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.daysLeft} days remaining</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-warning-foreground">Due Soon</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
