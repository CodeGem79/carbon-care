import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ExternalLink, Leaf, FileImage, MapPin, Calendar, X, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

type Entry = {
  id: number;
  type: string;
  scope: string;
  site: string;
  carbon: number;
  month: string;
  year: number;
  fy: string;
  evidence: boolean;
};

const allEntries: Entry[] = [
  // FY 2022/23
  { id: 101, type: "Electricity", scope: "S2", site: "HQ London", carbon: 310.5, month: "Apr", year: 2022, fy: "2022/23", evidence: true },
  { id: 102, type: "Gas", scope: "S1", site: "HQ London", carbon: 275.0, month: "Jun", year: 2022, fy: "2022/23", evidence: true },
  { id: 103, type: "Diesel", scope: "S1", site: "Fleet", carbon: 610.2, month: "Sep", year: 2022, fy: "2022/23", evidence: true },
  { id: 104, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 62.1, month: "Nov", year: 2022, fy: "2022/23", evidence: false },
  { id: 105, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 142.0, month: "Jan", year: 2023, fy: "2022/23", evidence: true },
  { id: 106, type: "Water", scope: "S3", site: "HQ London", carbon: 15.8, month: "Mar", year: 2023, fy: "2022/23", evidence: false },
  // FY 2023/24
  { id: 201, type: "Electricity", scope: "S2", site: "HQ London", carbon: 290.1, month: "Apr", year: 2023, fy: "2023/24", evidence: true },
  { id: 202, type: "Gas", scope: "S1", site: "HQ London", carbon: 255.4, month: "May", year: 2023, fy: "2023/24", evidence: true },
  { id: 203, type: "Diesel", scope: "S1", site: "Fleet", carbon: 580.0, month: "Jul", year: 2023, fy: "2023/24", evidence: true },
  { id: 204, type: "Water", scope: "S3", site: "Office Manchester", carbon: 11.2, month: "Sep", year: 2023, fy: "2023/24", evidence: false },
  { id: 205, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 52.3, month: "Nov", year: 2023, fy: "2023/24", evidence: true },
  { id: 206, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 125.0, month: "Feb", year: 2024, fy: "2023/24", evidence: true },
  // FY 2024/25 — BASELINE
  { id: 301, type: "Electricity", scope: "S2", site: "HQ London", carbon: 268.4, month: "Apr", year: 2024, fy: "2024/25", evidence: true },
  { id: 302, type: "Gas", scope: "S1", site: "Warehouse Birmingham", carbon: 195.2, month: "May", year: 2024, fy: "2024/25", evidence: true },
  { id: 303, type: "Water", scope: "S3", site: "HQ London", carbon: 14.1, month: "Jun", year: 2024, fy: "2024/25", evidence: true },
  { id: 304, type: "Diesel", scope: "S1", site: "Fleet", carbon: 540.0, month: "Aug", year: 2024, fy: "2024/25", evidence: true },
  { id: 305, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 108.5, month: "Oct", year: 2024, fy: "2024/25", evidence: true },
  { id: 306, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 48.9, month: "Dec", year: 2024, fy: "2024/25", evidence: false },
  { id: 307, type: "Gas", scope: "S1", site: "HQ London", carbon: 230.0, month: "Jan", year: 2025, fy: "2024/25", evidence: true },
  { id: 308, type: "Electricity", scope: "S2", site: "HQ London", carbon: 185.3, month: "Mar", year: 2025, fy: "2024/25", evidence: true },
  // FY 2025/26
  { id: 401, type: "Electricity", scope: "S2", site: "HQ London", carbon: 240.1, month: "Apr", year: 2025, fy: "2025/26", evidence: true },
  { id: 402, type: "Gas", scope: "S1", site: "Warehouse Birmingham", carbon: 172.8, month: "May", year: 2025, fy: "2025/26", evidence: true },
  { id: 403, type: "Water", scope: "S3", site: "HQ London", carbon: 11.5, month: "Jun", year: 2025, fy: "2025/26", evidence: true },
  { id: 404, type: "Diesel", scope: "S1", site: "Fleet", carbon: 498.0, month: "Aug", year: 2025, fy: "2025/26", evidence: true },
  { id: 405, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 41.0, month: "Nov", year: 2025, fy: "2025/26", evidence: false },
  { id: 406, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 95.2, month: "Feb", year: 2026, fy: "2025/26", evidence: true },
  // FY 2026/27 — current
  { id: 1, type: "Electricity", scope: "S2", site: "HQ London", carbon: 245.3, month: "Apr", year: 2026, fy: "2026/27", evidence: true },
  { id: 2, type: "Gas", scope: "S1", site: "Warehouse Birmingham", carbon: 180.1, month: "Apr", year: 2026, fy: "2026/27", evidence: true },
  { id: 3, type: "Water", scope: "S3", site: "HQ London", carbon: 12.8, month: "May", year: 2026, fy: "2026/27", evidence: false },
  { id: 4, type: "Diesel", scope: "S1", site: "Fleet", carbon: 520.0, month: "May", year: 2026, fy: "2026/27", evidence: true },
  { id: 5, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 98.4, month: "Jun", year: 2026, fy: "2026/27", evidence: true },
  { id: 6, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 45.2, month: "Jun", year: 2026, fy: "2026/27", evidence: false },
  { id: 7, type: "Gas", scope: "S1", site: "HQ London", carbon: 210.5, month: "Jul", year: 2026, fy: "2026/27", evidence: true },
  { id: 8, type: "Electricity", scope: "S2", site: "HQ London", carbon: 198.7, month: "Aug", year: 2026, fy: "2026/27", evidence: true },
  { id: 9, type: "Water", scope: "S3", site: "Office Manchester", carbon: 9.4, month: "Sep", year: 2026, fy: "2026/27", evidence: false },
  { id: 10, type: "Diesel", scope: "S1", site: "Fleet", carbon: 485.0, month: "Oct", year: 2026, fy: "2026/27", evidence: true },
  { id: 11, type: "Electricity", scope: "S2", site: "Warehouse Birmingham", carbon: 155.2, month: "Nov", year: 2026, fy: "2026/27", evidence: true },
  { id: 12, type: "Waste", scope: "S3", site: "HQ London", carbon: 38.6, month: "Dec", year: 2026, fy: "2026/27", evidence: false },
  { id: 13, type: "Gas", scope: "S1", site: "HQ London", carbon: 290.3, month: "Jan", year: 2027, fy: "2026/27", evidence: true },
  { id: 14, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 112.0, month: "Feb", year: 2027, fy: "2026/27", evidence: true },
  { id: 15, type: "Water", scope: "S3", site: "HQ London", carbon: 11.2, month: "Mar", year: 2027, fy: "2026/27", evidence: false },
];

const FISCAL_YEARS = ["2026/27", "2025/26", "2024/25", "2023/24", "2022/23"];
const BASELINE_YEAR = "2024/25";
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function HistoryPage() {
  const [selectedFY, setSelectedFY] = useState("2026/27");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedScope, setSelectedScope] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerEntry, setDrawerEntry] = useState<Entry | null>(null);
  const [expandedFY, setExpandedFY] = useState<string | null>(null);

  const entries = useMemo(() => allEntries.filter((e) => e.fy === selectedFY), [selectedFY]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (selectedMonth !== "ALL" && e.month !== selectedMonth) return false;
      if (selectedScope !== "ALL" && e.scope !== selectedScope) return false;
      if (selectedType !== "ALL" && e.type !== selectedType) return false;
      if (searchQuery && !e.site.toLowerCase().includes(searchQuery.toLowerCase()) && !e.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [entries, selectedMonth, selectedScope, selectedType, searchQuery]);

  const totalCarbon = useMemo(() => filtered.reduce((sum, e) => sum + e.carbon, 0), [filtered]);
  const entryCount = filtered.length;

  const activeFilterLabel = useMemo(() => {
    const parts: string[] = [];
    if (selectedMonth !== "ALL") parts.push(selectedMonth);
    if (selectedScope !== "ALL") parts.push(selectedScope);
    if (selectedType !== "ALL") parts.push(selectedType);
    if (searchQuery) parts.push(`"${searchQuery}"`);
    return parts.length > 0 ? parts.join(" · ") : "All Entries";
  }, [selectedMonth, selectedScope, selectedType, searchQuery]);

  const yearSummaries = useMemo(() => {
    return FISCAL_YEARS.map((fy) => {
      const fyEntries = allEntries.filter((e) => e.fy === fy);
      const s1 = fyEntries.filter((e) => e.scope === "S1").reduce((s, e) => s + e.carbon, 0);
      const s2 = fyEntries.filter((e) => e.scope === "S2").reduce((s, e) => s + e.carbon, 0);
      const s3 = fyEntries.filter((e) => e.scope === "S3").reduce((s, e) => s + e.carbon, 0);
      const total = s1 + s2 + s3;
      const evidenceCount = fyEntries.filter((e) => e.evidence).length;
      return { fy, entries: fyEntries, s1, s2, s3, total, count: fyEntries.length, evidenceCount, isBaseline: fy === BASELINE_YEAR };
    });
  }, []);

  const baselineTotal = useMemo(() => yearSummaries.find((y) => y.isBaseline)?.total ?? 0, [yearSummaries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit History</h1>
          <p className="text-muted-foreground">Digital Filing Cabinet — 7-year evidence archive</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Fiscal Year Archive Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Fiscal Year Archive</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {yearSummaries.map((ys) => {
            const isSelected = selectedFY === ys.fy;
            const isExpanded = expandedFY === ys.fy;
            const changeVsBaseline = baselineTotal > 0 && !ys.isBaseline
              ? ((ys.total - baselineTotal) / baselineTotal) * 100
              : null;

            return (
              <Card
                key={ys.fy}
                className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/40"}`}
                onClick={() => { setSelectedFY(ys.fy); setSelectedMonth("ALL"); }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">FY {ys.fy}</span>
                      {ys.isBaseline && <Badge variant="outline" className="text-[10px] border-primary text-primary">BASELINE</Badge>}
                    </div>
                    {isSelected && <Badge className="bg-primary text-primary-foreground text-[10px]">VIEWING</Badge>}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">{ys.total.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">kg CO₂e</span></p>
                      <p className="text-xs text-muted-foreground">{ys.count} logs · {ys.evidenceCount} with evidence</p>
                    </div>
                    {changeVsBaseline !== null && (
                      <span className={`text-xs font-bold ${changeVsBaseline <= 0 ? "text-green-600" : "text-red-500"}`}>
                        {changeVsBaseline <= 0 ? "▼" : "▲"} {Math.abs(changeVsBaseline).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {/* Scope bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    <div className="bg-[hsl(var(--chart-1))]" style={{ flex: ys.s1 || 0.1 }} />
                    <div className="bg-[hsl(var(--chart-2))]" style={{ flex: ys.s2 || 0.1 }} />
                    <div className="bg-[hsl(var(--chart-3))]" style={{ flex: ys.s3 || 0.1 }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>S1: {ys.s1.toFixed(0)}</span><span>S2: {ys.s2.toFixed(0)}</span><span>S3: {ys.s3.toFixed(0)}</span>
                  </div>
                  {/* Expand documents */}
                  <button
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                    onClick={(ev) => { ev.stopPropagation(); setExpandedFY(isExpanded ? null : ys.fy); }}
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {isExpanded ? "Hide Documents" : "View Documents"}
                  </button>
                  {isExpanded && (
                    <div className="space-y-1.5 border-t pt-3 mt-1 max-h-56 overflow-y-auto">
                      {ys.entries.map((audit) => (
                        <div key={audit.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="inline-flex rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{audit.scope}</span>
                            <span className="font-medium truncate">{audit.type}</span>
                            <span className="text-muted-foreground">{audit.month} {audit.year}</span>
                            <span className="font-semibold">{audit.carbon.toFixed(1)} kg</span>
                          </div>
                          {audit.evidence ? (
                            <button
                              className="flex items-center gap-1 text-primary hover:underline shrink-0"
                              onClick={(ev) => { ev.stopPropagation(); setDrawerEntry(audit); }}
                            >
                              <ExternalLink className="h-3 w-3" /> View
                            </button>
                          ) : (
                            <span className="text-muted-foreground italic">No file</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 7-Year Retention Note */}
      <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="flex items-start gap-3 py-3">
          <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-0.5">7-Year Retention Rule</p>
            <p>UK government contracting rules require evidence for up to 7 years. All documents across every fiscal year are accessible from this archive. Missing baseline evidence undermines your entire "Path to Net Zero" trajectory.</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <h2 className="text-lg font-bold">FY {selectedFY} — Detailed Log</h2>

      {/* Month selector strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedMonth("ALL")}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${selectedMonth === "ALL" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
        >
          All
        </button>
        {MONTHS.map((m) => (
          <button key={m} onClick={() => setSelectedMonth(m)} className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${selectedMonth === m ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
            {m}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search entries..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={selectedScope} onValueChange={setSelectedScope}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Scope" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Scopes</SelectItem>
            <SelectItem value="S1">Scope 1</SelectItem>
            <SelectItem value="S2">Scope 2</SelectItem>
            <SelectItem value="S3">Scope 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
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

      {/* Totals summary card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">FY {selectedFY} · {activeFilterLabel}</p>
              <p className="text-2xl font-bold tracking-tight">{totalCarbon.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Entries</p>
            <p className="text-xl font-bold">{entryCount}</p>
          </div>
        </CardContent>
      </Card>

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
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No entries match your filters.</td></tr>
                ) : filtered.map((e) => (
                  <tr key={e.id} className="border-b transition-colors hover:bg-accent/30">
                    <td className="p-3 font-medium">{e.type}</td>
                    <td className="p-3"><span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{e.scope}</span></td>
                    <td className="p-3 text-muted-foreground">{e.site}</td>
                    <td className="p-3 text-muted-foreground">{e.month} {e.year}</td>
                    <td className="p-3 text-right font-semibold">{e.carbon.toFixed(1)}</td>
                    <td className="p-3 text-center">
                      {e.evidence ? (
                        <button onClick={() => setDrawerEntry(e)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" /> View
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

      {/* Evidence Preview Drawer */}
      <Drawer open={!!drawerEntry} onOpenChange={(open) => !open && setDrawerEntry(null)}>
        <DrawerContent className="max-h-[85vh]">
          {drawerEntry && (
            <>
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <DrawerTitle className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-primary" />
                    Evidence — {drawerEntry.type} ({drawerEntry.fy})
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><X className="h-4 w-4" /></Button>
                  </DrawerClose>
                </div>
                <DrawerDescription>Supporting document for FY {drawerEntry.fy}</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-4 overflow-y-auto px-4 pb-2">
                <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <FileImage className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">Invoice-{drawerEntry.type.toLowerCase()}-{drawerEntry.month.toLowerCase()}{drawerEntry.year}.pdf</p>
                    <p className="text-xs">Document preview</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audit Metadata</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div><p className="text-xs text-muted-foreground">Period</p><p className="text-sm font-medium">{drawerEntry.month} {drawerEntry.year}</p></div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium">{drawerEntry.site}</p></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" />
                      <div><p className="text-xs text-muted-foreground">Carbon Value</p><p className="text-sm font-bold">{drawerEntry.carbon.toFixed(1)} kg CO₂e</p></div>
                    </div>
                    <Badge variant="outline">{drawerEntry.scope}</Badge>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button className="w-full"><Download className="h-4 w-4" /> Download for Auditor</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}