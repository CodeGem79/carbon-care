import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Plus,
  Zap,
  Flame,
  Droplets,
  Trash2,
  Plane,
  AlertTriangle,
  Settings2,
} from "lucide-react";

export const Route = createFileRoute("/locations")({
  component: LocationsPage,
});

type UtilityKey = "electricity" | "gas" | "water" | "waste" | "travel";

const UTILITIES: {
  key: UtilityKey;
  label: string;
  Icon: typeof Zap;
}[] = [
  { key: "electricity", label: "Electricity", Icon: Zap },
  { key: "gas", label: "Natural Gas", Icon: Flame },
  { key: "water", label: "Main Water Supply", Icon: Droplets },
  { key: "waste", label: "Waste & Recycling Logs", Icon: Trash2 },
  { key: "travel", label: "Business Travel Logistics", Icon: Plane },
];

type Location = {
  id: string;
  name: string;
  address: string;
  utilities: Record<UtilityKey, boolean>;
};

const defaultUtilities = (): Record<UtilityKey, boolean> => ({
  electricity: true,
  gas: false,
  water: false,
  waste: false,
  travel: false,
});

const initialLocations: Location[] = [
  {
    id: "1",
    name: "London HQ",
    address: "120 Bishopsgate, London EC2N 4AG",
    utilities: { electricity: true, gas: true, water: true, waste: false, travel: false },
  },
  {
    id: "2",
    name: "Manchester Warehouse",
    address: "45 Trafford Park Rd, Manchester M17 1AB",
    utilities: { electricity: true, gas: false, water: false, waste: false, travel: false },
  },
  {
    id: "3",
    name: "Birmingham Depot",
    address: "8 Aston Cross, Birmingham B6 5RQ",
    utilities: { electricity: true, gas: false, water: false, waste: true, travel: false },
  },
];

function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftAddress, setDraftAddress] = useState("");
  const [draftUtilities, setDraftUtilities] = useState<Record<UtilityKey, boolean>>(
    defaultUtilities(),
  );

  const openCreate = () => {
    setEditingId(null);
    setDraftName("");
    setDraftAddress("");
    setDraftUtilities(defaultUtilities());
    setOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditingId(loc.id);
    setDraftName(loc.name);
    setDraftAddress(loc.address);
    setDraftUtilities({ ...loc.utilities });
    setOpen(true);
  };

  const save = () => {
    if (!draftName.trim()) return;
    if (editingId) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? { ...l, name: draftName.trim(), address: draftAddress.trim(), utilities: draftUtilities }
            : l,
        ),
      );
    } else {
      setLocations((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: draftName.trim(),
          address: draftAddress.trim(),
          utilities: draftUtilities,
        },
      ]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Corporate Facilities &amp; Locations Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Define active physical entities and assign their environmental footprint profile
            tracking blueprints.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#1B4332] text-white shadow-sm transition-all hover:bg-[#2D6A4F] active:scale-[0.98] dark:bg-[#2D6A4F] dark:hover:bg-[#1B4332]"
        >
          <Plus className="h-4 w-4" />
          Register New Location
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => {
          const active = UTILITIES.filter((u) => loc.utilities[u.key]);
          const isEmpty = active.length === 0;
          return (
            <Card
              key={loc.id}
              className="group border-slate-200 transition-shadow hover:shadow-md dark:border-slate-800"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#1B4332] ring-1 ring-slate-200 dark:bg-slate-900 dark:text-emerald-400 dark:ring-slate-800">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {loc.name}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">{loc.address || "—"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {active.map((u) => {
                    const Icon = u.Icon;
                    return (
                      <Badge
                        key={u.key}
                        variant="outline"
                        className="gap-1 border-[#2D6A4F]/30 bg-[#1B4332]/5 text-[#1B4332] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      >
                        <Icon className="h-3 w-3" />
                        {u.label}
                      </Badge>
                    );
                  })}
                  {isEmpty && (
                    <div className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      Missing utility tracking route definitions—no environmental calculations will
                      be required for this location.
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(loc)}
                    className="border-slate-300 text-slate-700 transition-colors hover:border-[#2D6A4F] hover:bg-[#1B4332]/5 hover:text-[#1B4332] dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    Manage Utilities
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">
              {editingId ? "Edit Facility Blueprint" : "Register New Location"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update this site's metadata and toggle utility routing as the business changes."
                : "Add a new corporate facility and assign its environmental tracking blueprint."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loc-name">Facility / Location Name</Label>
              <Input
                id="loc-name"
                placeholder="e.g. Manchester Warehouse"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc-address">Street Address</Label>
              <Input
                id="loc-address"
                placeholder="e.g. 45 Trafford Park Rd, Manchester"
                value={draftAddress}
                onChange={(e) => setDraftAddress(e.target.value)}
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Active Utility Blueprint Routing
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Toggle ONLY the environmental asset streams this specific site is independently
                responsible for paying or logging.
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {UTILITIES.map((u) => {
                  const Icon = u.Icon;
                  const on = draftUtilities[u.key];
                  return (
                    <label
                      key={u.key}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-white px-3 py-2.5 transition-colors dark:bg-slate-950 ${
                        on
                          ? "border-[#2D6A4F]/60 ring-1 ring-[#2D6A4F]/20 dark:border-emerald-700"
                          : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md ${
                            on
                              ? "bg-[#1B4332]/10 text-[#1B4332] dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {u.label}
                        </span>
                      </span>
                      <Switch
                        checked={on}
                        onCheckedChange={(v) =>
                          setDraftUtilities((prev) => ({ ...prev, [u.key]: v }))
                        }
                        className="data-[state=checked]:bg-[#1B4332] dark:data-[state=checked]:bg-[#2D6A4F]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={!draftName.trim()}
              className="bg-[#1B4332] text-white shadow-sm transition-all hover:bg-[#2D6A4F] active:scale-[0.98] dark:bg-[#2D6A4F] dark:hover:bg-[#1B4332]"
            >
              Save &amp; Construct Blueprint Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}