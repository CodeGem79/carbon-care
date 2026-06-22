import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
});

const RESOURCE_DATA: Record<string, { units: string[]; defaultUnit: string }> = {
  Electricity: { units: ["kWh", "MWh"], defaultUnit: "kWh" },
  Gas: { units: ["kWh", "m³", "Therms"], defaultUnit: "kWh" },
  Water: { units: ["m³", "Liters", "Gallons"], defaultUnit: "m³" },
  Diesel: { units: ["Liters", "Gallons", "Tonnes"], defaultUnit: "Liters" },
  Waste: { units: ["kg", "Tonnes"], defaultUnit: "kg" },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Generate financial years dynamically (UK FY: April → March)
const FY_START = 2024;
const FY_END = 2030;
const financialYears = Array.from(
  { length: FY_END - FY_START + 1 },
  (_, i) => {
    const start = FY_START + i;
    return `${start}/${String(start + 1).slice(-2)}`;
  },
);

function currentFY(): string {
  const now = new Date();
  const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const clamped = Math.min(Math.max(startYear, FY_START), FY_END);
  return `${clamped}/${String(clamped + 1).slice(-2)}`;
}

function AuditPage() {
  const [type, setType] = useState("Electricity");
  const [unit, setUnit] = useState("kWh");
  const [value, setValue] = useState("");
  const [billingMonth, setBillingMonth] = useState(String(new Date().getMonth()));
  const [financialYear, setFinancialYear] = useState(currentFY());
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleTypeChange = (val: string) => {
    setType(val);
    setUnit(RESOURCE_DATA[val]?.defaultUnit || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Entry</h1>
        <p className="text-muted-foreground">Log a new resource consumption entry</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resource Details</CardTitle>
          <CardDescription>Select the resource type and enter consumption data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(RESOURCE_DATA).map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_DATA[type]?.units.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Consumption Value</Label>
              <Input
                type="number"
                placeholder="Enter value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Billing Month</Label>
                <Select value={billingMonth} onValueChange={setBillingMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, i) => (
                      <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Financial Year</Label>
                <Select value={financialYear} onValueChange={setFinancialYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYears.map((fy) => (
                      <SelectItem key={fy} value={fy}>FY {fy}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hq">HQ London</SelectItem>
                    <SelectItem value="warehouse">Warehouse Birmingham</SelectItem>
                    <SelectItem value="office">Office Manchester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-2">
              <Label>Evidence (Optional)</Label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-accent/50">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Upload invoice or photo</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-accent p-3 text-sm">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Carbon will be auto-calculated using DEFRA emission factors
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={!value}>
              {submitted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Entry Logged Successfully
                </>
              ) : (
                "Log Entry"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}