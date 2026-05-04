import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Download, Target } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { useMemo, useState } from "react";
import { FileSearch, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/sign-off")({
  component: SignOffPage,
});

function SignOffPage() {
  const complianceScore = 68;
  const gaps = ["Waste (S3) — 12 months missing", "Business Travel (S3) — 10 months missing"];
  const totalCommitments = 4;
  const verifiedCommitments = 1;
  const commitmentPercent = Math.round((verifiedCommitments / totalCommitments) * 100);

  // Path to Net Zero data
  const baselineYear = 2024;
  const targetYear = 2050;
  const baselineEmissions = 12500; // kg CO₂e
  const actualData: Record<number, number> = {
    2024: 12500,
    2025: 11800,
    2026: 11200,
  };

  const trajectoryData = useMemo(() => {
    const points: { year: string; baseline: number | null; actual: number | null; target: number }[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = baselineYear; y <= targetYear; y++) {
      const targetValue = Math.max(0, baselineEmissions * (1 - (y - baselineYear) / (targetYear - baselineYear)));
      points.push({
        year: String(y),
        baseline: y === baselineYear ? baselineEmissions : null,
        actual: actualData[y] ?? null,
        target: Math.round(targetValue),
      });
    }
    return points;
  }, []);

  const chartConfig = {
    actual: { label: "Actual Emissions", color: "var(--primary)" },
    target: { label: "Target Path", color: "var(--success)" },
    baseline: { label: "Baseline", color: "var(--warning)" },
  };

  // Check if actual emissions are above target
  const latestActualYear = Math.max(...Object.keys(actualData).map(Number));
  const latestActual = actualData[latestActualYear];
  const latestTarget = Math.round(baselineEmissions * (1 - (latestActualYear - baselineYear) / (targetYear - baselineYear)));
  const isAboveTarget = latestActual > latestTarget;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sign-off & Report</h1>
        <p className="text-muted-foreground">FY 2026/27 Compliance Certification</p>
      </div>

      {/* Score */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="currentColor"
                className={`transition-all duration-1000 ${complianceScore >= 100 ? "text-success" : "text-warning"}`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(complianceScore / 100) * 327} 327`}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-bold">{complianceScore}%</span>
              <p className="text-xs text-muted-foreground">Compliant</p>
            </div>
          </div>

          {complianceScore >= 100 ? (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2 text-success">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-semibold">Tender Ready — Full Compliance</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2 text-warning-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="font-semibold">Incomplete — Gaps Detected</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Path to Net Zero */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Path to Net Zero
          </CardTitle>
          <CardDescription>
            Progress against your science-based target trajectory (Baseline {baselineYear} → Net Zero {targetYear})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAboveTarget && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium">
                Compliance Risk: Actual emissions ({latestActual.toLocaleString()} kg) are above the target path ({latestTarget.toLocaleString()} kg) for {latestActualYear}.
              </span>
            </div>
          )}
          <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
            <LineChart data={trajectoryData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
                tickFormatter={(v) => v}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>{Number(value).toLocaleString()} kg CO₂e</span>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                connectNulls
                name="target"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-actual)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-actual)" }}
                connectNulls
                name="actual"
              />
              <ReferenceLine
                y={baselineEmissions}
                stroke="var(--color-baseline)"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: "Baseline", position: "right", fontSize: 10, fill: "var(--color-baseline)" }}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded bg-primary" />
              Actual Emissions
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-success" />
              Target Path (SBTi)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded border-t border-dashed border-warning" />
              Baseline ({baselineYear})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaps */}
      {gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Outstanding Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gaps.map((gap, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-destructive/5 p-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                {gap}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Methodology Snapshot */}
      <MethodologySnapshot />

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Commitment Verification
          </CardTitle>
          <CardDescription>{verifiedCommitments} of {totalCommitments} reduction projects verified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={commitmentPercent} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {commitmentPercent < 50
              ? "Low verification rate — this will reduce your Tender Readiness Score."
              : commitmentPercent < 100
                ? "Good progress. Verify remaining projects to strengthen your application."
                : "All commitments verified — excellent!"}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">View Projects</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate Carbon Reduction Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Generate a PPN 06/21 compliant Carbon Reduction Plan PDF for tender submissions.
            {complianceScore < 100 && " Note: generating with gaps will produce a draft report."}
          </p>
          <div className="flex gap-2">
            <Button className="flex-1">
              <FileText className="h-4 w-4" />
              Generate PDF Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MethodologySnapshot() {
  const [expanded, setExpanded] = useState(false);

  // In a real app these would come from shared state / DB
  const methodology = {
    rationale: "2024/25 was selected as the baseline year as it represents the first full year of comprehensive data collection post-pandemic, providing a reliable and representative starting point for measuring carbon reduction progress.",
    exclusions: "Downstream transportation excluded — not applicable to our digital service model. Franchises excluded — the organisation does not operate a franchise model.",
    calcMethod: "Emissions calculated using DEFRA 2025 conversion factors. Electricity consumption based on meter readings; gas estimated from supplier invoices.",
  };

  const hasGaps = !methodology.rationale || !methodology.exclusions || !methodology.calcMethod;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSearch className="h-4 w-4 text-primary" />
            Review Methodology
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Verify your methodology narratives before generating the report.
          {hasGaps && " ⚠ Some sections may be incomplete — review on the Profile page."}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Baseline Rationale</p>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
              {methodology.rationale || <span className="italic text-destructive">Not provided — complete on Profile page</span>}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scope 3 Exclusions</p>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
              {methodology.exclusions || <span className="italic text-destructive">Not provided — complete on Profile page</span>}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Calculation Methodology</p>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
              {methodology.calcMethod || <span className="italic text-destructive">Not provided — complete on Profile page</span>}
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/profile">Edit on Profile Page</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}