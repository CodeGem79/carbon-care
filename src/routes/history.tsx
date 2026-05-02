import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

const entries = [
  { id: 1, type: "Electricity", scope: "S2", site: "HQ London", carbon: 245.3, month: "Mar", year: 2026, evidence: true },
  { id: 2, type: "Gas", scope: "S1", site: "Warehouse Birmingham", carbon: 180.1, month: "Mar", year: 2026, evidence: true },
  { id: 3, type: "Water", scope: "S3", site: "HQ London", carbon: 12.8, month: "Feb", year: 2026, evidence: false },
  { id: 4, type: "Diesel", scope: "S1", site: "Fleet", carbon: 520.0, month: "Feb", year: 2026, evidence: true },
  { id: 5, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 98.4, month: "Jan", year: 2026, evidence: true },
  { id: 6, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 45.2, month: "Jan", year: 2026, evidence: false },
];

function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit History</h1>
          <p className="text-muted-foreground">All logged entries for FY 2026/27</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search entries..." className="pl-9" />
        </div>
        <Select defaultValue="ALL">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Scopes</SelectItem>
            <SelectItem value="S1">Scope 1</SelectItem>
            <SelectItem value="S2">Scope 2</SelectItem>
            <SelectItem value="S3">Scope 3</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="ALL">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="Electricity">Electricity</SelectItem>
            <SelectItem value="Gas">Gas</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Waste">Waste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Scope</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Site</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Period</th>
                  <th className="p-3 text-right font-medium text-muted-foreground">Carbon (kg CO₂e)</th>
                  <th className="p-3 text-center font-medium text-muted-foreground">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b transition-colors hover:bg-accent/30">
                    <td className="p-3 font-medium">{e.type}</td>
                    <td className="p-3">
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {e.scope}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{e.site}</td>
                    <td className="p-3 text-muted-foreground">{e.month} {e.year}</td>
                    <td className="p-3 text-right font-semibold">{e.carbon.toFixed(1)}</td>
                    <td className="p-3 text-center">
                      {e.evidence ? (
                        <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}