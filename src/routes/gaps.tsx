import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Flame,
  Zap,
  Droplets,
  Trash2,
  Plane,
  Check,
  X,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/gaps")({
  component: GapsPage,
});

type UtilityKey = "electricity" | "gas" | "water" | "waste" | "travel";

const UTILITY_META: Record<UtilityKey, { label: string; action: string; Icon: typeof Zap }> = {
  electricity: { label: "Electricity Entry", action: "Add Electric Usage", Icon: Zap },
  gas: { label: "Natural Gas Entry", action: "Add Gas Usage", Icon: Flame },
  water: { label: "Water Entry", action: "Add Water Usage", Icon: Droplets },
  waste: { label: "Waste Entry", action: "Add Waste Log", Icon: Trash2 },
  travel: { label: "Business Travel Entry", action: "Add Travel Log", Icon: Plane },
};

const MONTH_LABELS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] as const;

const FY_START_YEAR = 2024;
const FY_END_YEAR = 2030;
const FINANCIAL_YEARS = Array.from({ length: FY_END_YEAR - FY_START_YEAR + 1 }, (_, i) => {
  const start = FY_START_YEAR + i;
  return `${start}/${String(start + 1).slice(-2)}`;
});

function buildMonths(fy: string): string[] {
  const startYear = Number(fy.slice(0, 4));
  return MONTH_LABELS.map((m, i) => `${m} ${i <= 8 ? startYear : startYear + 1}`);
}

type SiteBlueprint = {
  id: string;
  name: string;
  utilities: UtilityKey[]; // only the utilities required at this site
  // logged[utility] = boolean[] aligned to the 12 FY months
  logged: Partial<Record<UtilityKey, boolean[]>>;
};

const all = () => MONTH_LABELS.map(() => true);

const SITES: SiteBlueprint[] = [
  {
    id: "london",
    name: "London HQ",
    utilities: ["electricity", "gas", "water"],
    logged: {
      electricity: all(),
      // Missing Jan 2026 (index 9) for gas + water
      gas: MONTH_LABELS.map((_, i) => i !== 9),
      water: MONTH_LABELS.map((_, i) => i !== 9),
    },
  },
  {
    id: "manchester",
    name: "Manchester Warehouse",
    utilities: ["electricity"], // gas N/A here
    logged: {
      // Missing Feb 2026 (index 10)
      electricity: MONTH_LABELS.map((_, i) => i !== 10),
    },
  },
  {
    id: "birmingham",
    name: "Birmingham Depot",
    utilities: ["electricity", "waste"],
    logged: {
      electricity: all(),
      waste: all(),
    },
  },
];

type Gap = { siteId: string; siteName: string; utility: UtilityKey; monthIdx: number };

function GapsPage() {
  const [gapsOnly, setGapsOnly] = useState(true);
  const [selectedFY, setSelectedFY] = useState("2025/26");
  const months = useMemo(() => buildMonths(selectedFY), [selectedFY]);

  const { gaps, totalRequired, totalLogged, fullySiteUtilityProfiles, totalSiteUtilityProfiles } =
    useMemo(() => {
      const gapsList: Gap[] = [];
      let required = 0;
      let logged = 0;
      let fullProfiles = 0;
      let totalProfiles = 0;
      for (const site of SITES) {
        for (const util of site.utilities) {
          totalProfiles += 1;
          const arr = site.logged[util] ?? MONTH_LABELS.map(() => false);
          let allLogged = true;
          arr.forEach((ok, i) => {
            required += 1;
            if (ok) logged += 1;
            else {
              allLogged = false;
              gapsList.push({ siteId: site.id, siteName: site.name, utility: util, monthIdx: i });
            }
          });
          if (allLogged) fullProfiles += 1;
        }
      }
      return {
        gaps: gapsList,
        totalRequired: required,
        totalLogged: logged,
        fullySiteUtilityProfiles: fullProfiles,
        totalSiteUtilityProfiles: totalProfiles,
      };
    }, [selectedFY]);

  const coverage = Math.round((totalLogged / totalRequired) * 100);

  // Group gaps by month index
  const byMonth = useMemo(() => {
    const map = new Map<number, Gap[]>();
    for (const g of gaps) {
      if (!map.has(g.monthIdx)) map.set(g.monthIdx, []);
      map.get(g.monthIdx)!.push(g);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [gaps]);

  const allClear = gaps.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tender-Ready Pre-Submission Audit</h1>
          <p className="text-muted-foreground">FY {selectedFY} — PPN 06/21 verification readiness</p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Financial Year</Label>
          <Select value={selectedFY} onValueChange={setSelectedFY}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FINANCIAL_YEARS.map((fy) => (
                <SelectItem key={fy} value={fy}>FY {fy}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* At-a-glance compliance matrix */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Compliance Matrix — At a Glance</CardTitle>
          <CardDescription>
            Site × month coverage for FY {selectedFY}. Hover a cell for detail.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card p-2 text-left font-medium text-muted-foreground">
                    Site / Utility
                  </th>
                  {months.map((m) => (
                    <th key={m} className="p-1 text-center font-medium text-muted-foreground">
                      <div className="leading-tight">{m.split(" ")[0]}</div>
                      <div className="text-[10px] opacity-60">{m.split(" ")[1]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SITES.map((site) => (
                  <SiteMatrixRows key={site.id} site={site} months={months} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-emerald-600 text-white">
                <Check className="h-3 w-3" />
              </span>
              Logged
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-amber-500 text-white">
                <X className="h-3 w-3" />
              </span>
              Missing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Minus className="h-3 w-3" />
              </span>
              Not applicable
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-base text-slate-900 dark:text-slate-100">
              Outstanding Environmental Gaps Matrix
            </CardTitle>
            <CardDescription>Required for PPN 06/21 Verification Compliance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="gaps-only" className="text-xs text-muted-foreground">
              {gapsOnly ? "Gaps Only" : "All Months"}
            </Label>
            <Switch id="gaps-only" checked={gapsOnly} onCheckedChange={setGapsOnly} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Global Progress Gauge */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {fullySiteUtilityProfiles} of {totalSiteUtilityProfiles} Site utility profiles fully logged
              </p>
              <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                {coverage}%
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-700 transition-all dark:bg-emerald-500"
                style={{ width: `${coverage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {totalLogged} of {totalRequired} monthly entries logged across {SITES.length} locations.
            </p>
          </div>

          {/* All-clear empty state */}
          {gapsOnly && allClear ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl border px-6 py-12 text-center"
              style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <ShieldCheck className="h-8 w-8" style={{ color: "#2D6A4F" }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: "#1B4332" }}>
                Your Organization is Tender-Ready
              </h3>
              <p className="mt-1 max-w-md text-sm" style={{ color: "#2D6A4F" }}>
                Every active corporate location has fully logged their required utility blueprints.
                Your carbon accounting file envelope is complete for PPN 06/21 submission processing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(gapsOnly ? byMonth : MONTH_LABELS.map((_, i) => [i, byMonth.find(([m]) => m === i)?.[1] ?? []] as [number, Gap[]])).map(
                ([monthIdx, monthGaps]) => {
                  if (gapsOnly && monthGaps.length === 0) return null;
                  return (
                    <MonthBlock
                      key={monthIdx}
                      month={months[monthIdx]}
                      gaps={monthGaps}
                    />
                  );
                },
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SiteMatrixRows({ site, months }: { site: SiteBlueprint; months: string[] }) {
  const allUtils: UtilityKey[] = ["electricity", "gas", "water", "waste", "travel"];
  return (
    <>
      {allUtils.map((util, rowIdx) => {
        const required = site.utilities.includes(util);
        const arr = site.logged[util];
        const meta = UTILITY_META[util];
        const Icon = meta.Icon;
        return (
          <tr key={util} className="border-t border-slate-100 dark:border-slate-800">
            <td className="sticky left-0 z-10 bg-card p-2 whitespace-nowrap">
              {rowIdx === 0 && (
                <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <MapPin className="h-3 w-3" /> {site.name}
                </div>
              )}
              <div className="flex items-center gap-1.5 pl-4 text-muted-foreground">
                <Icon className="h-3 w-3" />
                <span className="capitalize">{util}</span>
              </div>
            </td>
            {months.map((m, i) => {
              if (!required) {
                return (
                  <td key={m} className="p-1 text-center">
                    <span
                      title="Not applicable at this site"
                      className="mx-auto inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      <Minus className="h-3 w-3" />
                    </span>
                  </td>
                );
              }
              const ok = arr?.[i] ?? false;
              return (
                <td key={m} className="p-1 text-center">
                  <span
                    title={`${site.name} · ${util} · ${m} — ${ok ? "Logged" : "Missing"}`}
                    className={`mx-auto inline-flex h-5 w-5 items-center justify-center rounded-sm text-white ${
                      ok ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                  >
                    {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function MonthBlock({ month, gaps }: { month: string; gaps: Gap[] }) {
  const isClean = gaps.length === 0;
  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        isClean
          ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
          : "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20"
      }`}
      style={!isClean ? { borderLeft: "3px solid #B45309" } : { borderLeft: "3px solid #2D6A4F" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{month}</p>
        <p className="text-xs text-muted-foreground">
          {isClean ? "All blueprints logged" : `${gaps.length} missing entr${gaps.length === 1 ? "y" : "ies"}`}
        </p>
      </div>
      {!isClean && (
        <ul className="divide-y divide-amber-100 border-t border-amber-100 bg-white dark:divide-amber-900/30 dark:border-amber-900/30 dark:bg-slate-950/40">
          {gaps.map((g, i) => {
            const meta = UTILITY_META[g.utility];
            const Icon = meta.Icon;
            return (
              <li
                key={`${g.siteId}-${g.utility}-${i}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-amber-50/60 dark:hover:bg-amber-950/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                    <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {g.siteName}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-0.5 gap-1 border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                    >
                      <Icon className="h-3 w-3" />
                      Missing {meta.label}
                    </Badge>
                  </div>
                </div>
                <button
                  type="button"
                  className="group inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-50 active:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                >
                  {meta.action}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}