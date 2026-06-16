import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Flame,
  Zap,
  Droplets,
  Trash2,
  Plane,
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

const MONTHS = [
  "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025",
  "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026",
] as const;

type SiteBlueprint = {
  id: string;
  name: string;
  utilities: UtilityKey[]; // only the utilities required at this site
  // logged[utility] = boolean[] aligned to MONTHS
  logged: Partial<Record<UtilityKey, boolean[]>>;
};

const f = (...trueIdx: number[]) =>
  MONTHS.map((_, i) => trueIdx.includes(i));
const all = () => MONTHS.map(() => true);

const SITES: SiteBlueprint[] = [
  {
    id: "london",
    name: "London HQ",
    utilities: ["electricity", "gas", "water"],
    logged: {
      electricity: all(),
      // Missing Jan 2026 (index 9) for gas + water
      gas: MONTHS.map((_, i) => i !== 9),
      water: MONTHS.map((_, i) => i !== 9),
    },
  },
  {
    id: "manchester",
    name: "Manchester Warehouse",
    utilities: ["electricity"], // gas N/A here
    logged: {
      // Missing Feb 2026 (index 10)
      electricity: MONTHS.map((_, i) => i !== 10),
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
          const arr = site.logged[util] ?? MONTHS.map(() => false);
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
    }, []);

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tender-Ready Pre-Submission Audit</h1>
        <p className="text-muted-foreground">FY 2025/26 — PPN 06/21 verification readiness</p>
      </div>

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
              {(gapsOnly ? byMonth : MONTHS.map((_, i) => [i, byMonth.find(([m]) => m === i)?.[1] ?? []] as [number, Gap[]])).map(
                ([monthIdx, monthGaps]) => {
                  if (gapsOnly && monthGaps.length === 0) return null;
                  return (
                    <MonthBlock
                      key={monthIdx}
                      month={MONTHS[monthIdx]}
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