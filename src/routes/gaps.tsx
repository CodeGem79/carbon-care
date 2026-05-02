import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/gaps")({
  component: GapsPage,
});

const categories = [
  "Electricity (S2)",
  "Gas (S1)",
  "Waste (S3)",
  "Business Travel (S3)",
  "Commuting (S3)",
];

const gapData: Record<string, boolean[]> = {
  "Electricity (S2)": [true, true, true, true, false, false, false, false, false, false, false, false],
  "Gas (S1)": [true, true, true, true, true, false, false, false, false, false, false, false],
  "Waste (S3)": [false, false, false, false, false, false, false, false, false, false, false, false],
  "Business Travel (S3)": [true, false, true, false, false, false, false, false, false, false, false, false],
  "Commuting (S3)": [true, true, true, true, false, false, false, false, false, false, false, false],
};

const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function GapsPage() {
  const totalCells = categories.length * 12;
  const filledCells = Object.values(gapData).flat().filter(Boolean).length;
  const coverage = Math.round((filledCells / totalCells) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gap Finder</h1>
        <p className="text-muted-foreground">FY 2026/27 Data Integrity Check</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Overall Coverage</p>
            <p className="text-3xl font-bold">{coverage}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${coverage}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Missing Entries</p>
              <p className="text-2xl font-bold">{totalCells - filledCells}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Logged Entries</p>
              <p className="text-2xl font-bold">{filledCells}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">PPN 06/21 Coverage Matrix</CardTitle>
          <CardDescription>Green = data logged, Red = missing — potential disqualification risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Category</th>
                  {months.map((m) => (
                    <th key={m} className="pb-3 text-center font-medium text-muted-foreground">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat} className="border-t">
                    <td className="py-2.5 pr-4 font-medium">{cat}</td>
                    {gapData[cat].map((logged, i) => (
                      <td key={i} className="py-2.5 text-center">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-all ${
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

      <div className="flex items-start gap-2 rounded-lg bg-accent p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <p className="font-medium">PPN 06/21 Compliance</p>
          <p className="text-muted-foreground">
            All categories must have 12 months of continuous data to qualify for NHS Evergreen certification.
            Missing entries risk tender disqualification.
          </p>
        </div>
      </div>
    </div>
  );
}