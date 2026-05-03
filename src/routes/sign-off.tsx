import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Download, Target } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/sign-off")({
  component: SignOffPage,
});

function SignOffPage() {
  const complianceScore = 68;
  const gaps = ["Waste (S3) — 12 months missing", "Business Travel (S3) — 10 months missing"];
  const totalCommitments = 4;
  const verifiedCommitments = 1;
  const commitmentPercent = Math.round((verifiedCommitments / totalCommitments) * 100);

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