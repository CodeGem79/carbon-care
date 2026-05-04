import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ExternalLink, Leaf, FileImage, MapPin, Calendar, X } from "lucide-react";
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

const entries = [
  { id: 1, type: "Electricity", scope: "S2", site: "HQ London", carbon: 245.3, month: "Apr", year: 2026, evidence: true },
  { id: 2, type: "Gas", scope: "S1", site: "Warehouse Birmingham", carbon: 180.1, month: "Apr", year: 2026, evidence: true },
  { id: 3, type: "Water", scope: "S3", site: "HQ London", carbon: 12.8, month: "May", year: 2026, evidence: false },
  { id: 4, type: "Diesel", scope: "S1", site: "Fleet", carbon: 520.0, month: "May", year: 2026, evidence: true },
  { id: 5, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 98.4, month: "Jun", year: 2026, evidence: true },
  { id: 6, type: "Waste", scope: "S3", site: "Warehouse Birmingham", carbon: 45.2, month: "Jun", year: 2026, evidence: false },
  { id: 7, type: "Gas", scope: "S1", site: "HQ London", carbon: 210.5, month: "Jul", year: 2026, evidence: true },
  { id: 8, type: "Electricity", scope: "S2", site: "HQ London", carbon: 198.7, month: "Aug", year: 2026, evidence: true },
  { id: 9, type: "Water", scope: "S3", site: "Office Manchester", carbon: 9.4, month: "Sep", year: 2026, evidence: false },
  { id: 10, type: "Diesel", scope: "S1", site: "Fleet", carbon: 485.0, month: "Oct", year: 2026, evidence: true },
  { id: 11, type: "Electricity", scope: "S2", site: "Warehouse Birmingham", carbon: 155.2, month: "Nov", year: 2026, evidence: true },
  { id: 12, type: "Waste", scope: "S3", site: "HQ London", carbon: 38.6, month: "Dec", year: 2026, evidence: false },
  { id: 13, type: "Gas", scope: "S1", site: "HQ London", carbon: 290.3, month: "Jan", year: 2027, evidence: true },
  { id: 14, type: "Electricity", scope: "S2", site: "Office Manchester", carbon: 112.0, month: "Feb", year: 2027, evidence: true },
  { id: 15, type: "Water", scope: "S3", site: "HQ London", carbon: 11.2, month: "Mar", year: 2027, evidence: false },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedScope, setSelectedScope] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [drawerEntry, setDrawerEntry] = useState<(typeof entries)[number] | null>(null);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (selectedMonth !== "ALL" && e.month !== selectedMonth) return false;
      if (selectedScope !== "ALL" && e.scope !== selectedScope) return false;
      if (selectedType !== "ALL" && e.type !== selectedType) return false;
      if (searchQuery && !e.site.toLowerCase().includes(searchQuery.toLowerCase()) && !e.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedMonth, selectedScope, selectedType, searchQuery]);

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

      {/* Month selector strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedMonth("ALL")}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${  
            selectedMonth === "ALL"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          All
        </button>
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedMonth === m
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
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
        <Select value={selectedType} onValueChange={setSelectedType}>
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

      {/* Totals summary card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{activeFilterLabel}</p>
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
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No entries match your filters.
                    </td>
                  </tr>
                ) : filtered.map((e) => (
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
                        <button
                          onClick={() => setDrawerEntry(e)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
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

      {/* Evidence Preview Drawer */}
      <Drawer open={!!drawerEntry} onOpenChange={(open) => !open && setDrawerEntry(null)}>
        <DrawerContent className="max-h-[85vh]">
          {drawerEntry && (
            <>
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <DrawerTitle className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-primary" />
                    Evidence — {drawerEntry.type}
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
                <DrawerDescription>
                  Supporting document for this audit entry
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-4 overflow-y-auto px-4 pb-2">
                {/* Document Preview Placeholder */}
                <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <FileImage className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">Invoice-{drawerEntry.type.toLowerCase()}-{drawerEntry.month.toLowerCase()}{drawerEntry.year}.pdf</p>
                    <p className="text-xs">Document preview</p>
                  </div>
                </div>

                <Separator />

                {/* Audit Metadata */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audit Metadata</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Period</p>
                        <p className="text-sm font-medium">{drawerEntry.month} {drawerEntry.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{drawerEntry.site}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Carbon Value</p>
                        <p className="text-sm font-bold">{drawerEntry.carbon.toFixed(1)} kg CO₂e</p>
                      </div>
                    </div>
                    <Badge variant="outline">{drawerEntry.scope}</Badge>
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button className="w-full">
                  <Download className="h-4 w-4" />
                  Download for Auditor
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}