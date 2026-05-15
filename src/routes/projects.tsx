import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Plus,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Upload,
  Target,
  TrendingDown,
  CalendarClock,
  Bell,
  Calculator,
  ListChecks,
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

type ProjectStatus = "Planned" | "In Progress" | "Completed";
type ProjectCategory = "Energy Efficiency" | "Transport" | "Waste" | "Water" | "Renewable Energy" | "Other";
type ReminderOption = "none" | "10days" | "7days" | "3days";
type WizardMode = "energy" | "transport" | "custom";
type FuelType = "Petrol" | "Diesel" | "EV";

const MILESTONES = [
  "Project Scoped & Quote Received",
  "Internal Approval & Budget Secured",
  "Implementation/Installation Started",
  "Completion & Evidence Collection",
];

const FUEL_FACTORS: Record<FuelType, number> = {
  Petrol: 0.28,
  Diesel: 0.27,
  EV: 0.05,
};
const KWH_FACTOR = 0.207;

const reminderOptions: { value: ReminderOption; label: string; days: number }[] = [
  { value: "none", label: "No Reminder", days: 0 },
  { value: "10days", label: "10 days before", days: 10 },
  { value: "7days", label: "1 week before", days: 7 },
  { value: "3days", label: "3 days before", days: 3 },
];

interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  targetDate: string;
  estimatedSavings: number;
  status: ProjectStatus;
  reminder: ReminderOption;
  evidence?: string;
  createdAt: string;
  calculationNote?: string;
  milestonesCompleted?: number[];
}

const categoryOptions: ProjectCategory[] = [
  "Energy Efficiency",
  "Transport",
  "Waste",
  "Water",
  "Renewable Energy",
  "Other",
];

const statusOptions: ProjectStatus[] = ["Planned", "In Progress", "Completed"];

const initialProjects: Project[] = [
  {
    id: "1",
    name: "LED Lighting Upgrade",
    category: "Energy Efficiency",
    targetDate: "2026-09-30",
    estimatedSavings: 500,
    status: "In Progress",
    reminder: "7days",
    createdAt: "2026-01-15",
    milestonesCompleted: [0, 1],
    calculationNote: "Reduced 2,415 kWh at 0.207 kg/kWh factor",
  },
  {
    id: "2",
    name: "Install Solar Panels",
    category: "Renewable Energy",
    targetDate: "2026-06-15",
    estimatedSavings: 2400,
    status: "Planned",
    reminder: "10days",
    createdAt: "2026-02-01",
    milestonesCompleted: [],
  },
  {
    id: "3",
    name: "EV Fleet Transition (Phase 1)",
    category: "Transport",
    targetDate: "2025-12-01",
    estimatedSavings: 1800,
    status: "Planned",
    reminder: "3days",
    createdAt: "2025-06-10",
    milestonesCompleted: [],
  },
  {
    id: "4",
    name: "Waste Segregation Programme",
    category: "Waste",
    targetDate: "2026-03-01",
    estimatedSavings: 320,
    status: "Completed",
    evidence: "invoice-waste-2026.pdf",
    reminder: "none",
    createdAt: "2025-09-20",
    milestonesCompleted: [0, 1, 2, 3],
  },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getProjectUrgency(project: Project): "overdue" | "due-soon" | "on-track" | "completed" {
  if (project.status === "Completed") return "completed";
  const days = getDaysUntil(project.targetDate);
  if (days < 0) return "overdue";
  if (days <= 30) return "due-soon";
  return "on-track";
}

function getReminderStatus(project: Project): { active: boolean; label: string } | null {
  if (project.status === "Completed" || project.reminder === "none") return null;
  const opt = reminderOptions.find((r) => r.value === project.reminder);
  if (!opt) return null;
  const daysLeft = getDaysUntil(project.targetDate);
  if (daysLeft <= opt.days && daysLeft >= 0) {
    return { active: true, label: `⏰ Reminder: ${daysLeft} day${daysLeft !== 1 ? "s" : ""} until deadline` };
  }
  return { active: false, label: `Reminder set: ${opt.label}` };
}

function statusBadgeClass(status: ProjectStatus) {
  switch (status) {
    case "Planned":
      return "bg-muted text-muted-foreground";
    case "In Progress":
      return "bg-primary/15 text-primary";
    case "Completed":
      return "bg-success/15 text-success";
  }
}

function urgencyBadge(urgency: ReturnType<typeof getProjectUrgency>) {
  switch (urgency) {
    case "overdue":
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    case "due-soon":
      return (
        <Badge className="gap-1 bg-warning/15 text-warning-foreground text-xs hover:bg-warning/20">
          <Clock className="h-3 w-3" />
          Due within 30 days
        </Badge>
      );
    case "completed":
      return (
        <Badge className="gap-1 bg-success/15 text-success text-xs hover:bg-success/20">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    default:
      return null;
  }
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProjectCategory>("Energy Efficiency");
  const [formDate, setFormDate] = useState("");
  const [formSavings, setFormSavings] = useState("");
  const [formStatus, setFormStatus] = useState<ProjectStatus>("Planned");
  const [formReminder, setFormReminder] = useState<ReminderOption>("7days");
  const [formNote, setFormNote] = useState("");

  // Wizard state
  const [wizardMode, setWizardMode] = useState<WizardMode>("energy");
  const [currentKwh, setCurrentKwh] = useState("");
  const [newKwh, setNewKwh] = useState("");
  const [annualMiles, setAnnualMiles] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("Petrol");
  const [customSavings, setCustomSavings] = useState("");

  // Recompute savings + note as wizard inputs change
  const recompute = (
    mode: WizardMode,
    cur: string,
    nw: string,
    miles: string,
    fuel: FuelType,
    custom: string,
  ) => {
    if (mode === "energy") {
      const c = Number(cur) || 0;
      const n = Number(nw) || 0;
      const reduced = Math.max(c - n, 0);
      const savings = Math.round(reduced * KWH_FACTOR);
      setFormSavings(String(savings));
      setFormNote(reduced > 0
        ? `Reduced ${reduced.toLocaleString()} kWh at ${KWH_FACTOR} kg/kWh factor = ${savings.toLocaleString()} kg CO₂e`
        : "");
    } else if (mode === "transport") {
      const m = Number(miles) || 0;
      const factor = FUEL_FACTORS[fuel];
      const savings = Math.round(m * factor);
      setFormSavings(String(savings));
      setFormNote(m > 0
        ? `${m.toLocaleString()} ${fuel} miles avoided at ${factor} kg/mile factor = ${savings.toLocaleString()} kg CO₂e`
        : "");
    } else {
      const v = Number(custom) || 0;
      setFormSavings(String(v));
      setFormNote(v > 0 ? `Manual estimate: ${v.toLocaleString()} kg CO₂e (user-entered)` : "");
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormCategory("Energy Efficiency");
    setFormDate("");
    setFormSavings("");
    setFormStatus("Planned");
    setFormReminder("7days");
    setEditingId(null);
    setFormNote("");
    setWizardMode("energy");
    setCurrentKwh("");
    setNewKwh("");
    setAnnualMiles("");
    setFuelType("Petrol");
    setCustomSavings("");
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDate(p.targetDate);
    setFormSavings(String(p.estimatedSavings));
    setFormStatus(p.status);
    setFormReminder(p.reminder);
    setEditingId(p.id);
    setFormNote(p.calculationNote ?? "");
    setWizardMode("custom");
    setCustomSavings(String(p.estimatedSavings));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formDate || !formSavings) return;
    if (editingId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: formName, category: formCategory, targetDate: formDate, estimatedSavings: Number(formSavings), status: formStatus, reminder: formReminder, calculationNote: formNote }
            : p,
        ),
      );
    } else {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: formName,
        category: formCategory,
        targetDate: formDate,
        estimatedSavings: Number(formSavings),
        status: formStatus,
        reminder: formReminder,
        createdAt: new Date().toISOString().slice(0, 10),
        calculationNote: formNote,
        milestonesCompleted: [],
      };
      setProjects((prev) => [...prev, newProject]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleMilestone = (projectId: string, idx: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const current = p.milestonesCompleted ?? [];
        const next = current.includes(idx)
          ? current.filter((i) => i !== idx)
          : [...current, idx];
        return { ...p, milestonesCompleted: next };
      }),
    );
  };

  const markEvidenceUploaded = (projectId: string) => {
    const filename = `evidence-${projectId.slice(0, 6)}-${new Date().getFullYear()}.pdf`;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              evidence: filename,
              status: "Completed" as ProjectStatus,
              milestonesCompleted: [0, 1, 2, 3],
            }
          : p,
      ),
    );
  };

  // stats
  const overdueCount = projects.filter((p) => getProjectUrgency(p) === "overdue").length;
  const dueSoonCount = projects.filter((p) => getProjectUrgency(p) === "due-soon").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const totalSavings = projects.reduce((s, p) => s + p.estimatedSavings, 0);
  const verifiedSavings = projects.filter((p) => p.status === "Completed").reduce((s, p) => s + p.estimatedSavings, 0);

  // commitment gauge
  const commitmentPercent = projects.length > 0 ? Math.round((completedCount / projects.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reduction Projects</h1>
          <p className="text-muted-foreground">Track, verify, and prove your carbon reduction commitments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "Add Reduction Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input placeholder="e.g., LED Lighting Upgrade" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formCategory} onValueChange={(v) => setFormCategory(v as ProjectCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                Deadline Reminder
              </Label>
              <Select value={formReminder} onValueChange={(v) => setFormReminder(v as ReminderOption)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Savings (kg CO₂e)</Label>
                  <Input type="number" value={formSavings} readOnly className="bg-muted/40 font-semibold" />
                </div>
              </div>

              {/* Carbon Savings Wizard */}
              <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Carbon Savings Wizard</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Calculation Mode</Label>
                  <Select
                    value={wizardMode}
                    onValueChange={(v) => {
                      const m = v as WizardMode;
                      setWizardMode(m);
                      recompute(m, currentKwh, newKwh, annualMiles, fuelType, customSavings);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy">Energy (kWh)</SelectItem>
                      <SelectItem value="transport">Transport (Miles)</SelectItem>
                      <SelectItem value="custom">Custom (Manual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {wizardMode === "energy" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Current Annual kWh</Label>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={currentKwh}
                        onChange={(e) => {
                          setCurrentKwh(e.target.value);
                          recompute("energy", e.target.value, newKwh, annualMiles, fuelType, customSavings);
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Estimated New kWh</Label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={newKwh}
                        onChange={(e) => {
                          setNewKwh(e.target.value);
                          recompute("energy", currentKwh, e.target.value, annualMiles, fuelType, customSavings);
                        }}
                      />
                    </div>
                  </div>
                )}

                {wizardMode === "transport" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Annual Miles Avoided</Label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={annualMiles}
                        onChange={(e) => {
                          setAnnualMiles(e.target.value);
                          recompute("transport", currentKwh, newKwh, e.target.value, fuelType, customSavings);
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Fuel Type</Label>
                      <Select
                        value={fuelType}
                        onValueChange={(v) => {
                          const f = v as FuelType;
                          setFuelType(f);
                          recompute("transport", currentKwh, newKwh, annualMiles, f, customSavings);
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Petrol">Petrol (0.28 kg/mi)</SelectItem>
                          <SelectItem value="Diesel">Diesel (0.27 kg/mi)</SelectItem>
                          <SelectItem value="EV">EV (0.05 kg/mi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {wizardMode === "custom" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Manual kg CO₂e</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={customSavings}
                      onChange={(e) => {
                        setCustomSavings(e.target.value);
                        recompute("custom", currentKwh, newKwh, annualMiles, fuelType, e.target.value);
                      }}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Calculation Note (Audit Trail)</Label>
                  <Textarea
                    rows={2}
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    placeholder="Auto-filled from wizard inputs — editable for audit context"
                    className="text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as ProjectStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={!formName || !formDate || !formSavings}>
                {editingId ? "Save Changes" : "Add Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}/{projects.length}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verifiedSavings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Verified kg CO₂e saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commitment vs Reality Gauge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commitment vs. Reality</CardTitle>
          <CardDescription>
            {completedCount} of {projects.length} projects verified — {commitmentPercent}% delivery rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Verified savings</span>
              <span className="font-semibold">{verifiedSavings.toLocaleString()} / {totalSavings.toLocaleString()} kg CO₂e</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${totalSavings > 0 ? (verifiedSavings / totalSavings) * 100 : 0}%` }}
              />
            </div>
            {overdueCount > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                {overdueCount} overdue project{overdueCount > 1 ? "s" : ""} — this lowers your Tender Readiness Score
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const urgency = getProjectUrgency(project);
          const daysLeft = getDaysUntil(project.targetDate);
          const reminderStatus = getReminderStatus(project);
          const milestones = project.milestonesCompleted ?? [];
          const milestonesDone = milestones.length;
          const firstThreeDone = [0, 1, 2].every((i) => milestones.includes(i));
          const isCompleted = project.status === "Completed";
          const progressColor = isCompleted ? "bg-success" : "bg-primary";
          return (
            <Card
              key={project.id}
              className={urgency === "overdue" ? "border-destructive/40" : ""}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(project)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={statusBadgeClass(project.status)}>{project.status}</Badge>
                  {urgencyBadge(urgency)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Target Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(project.targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Savings</p>
                    <p className="font-medium">{project.estimatedSavings.toLocaleString()} kg CO₂e</p>
                  </div>
                </div>

                {/* Milestone progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ListChecks className="h-3.5 w-3.5" />
                      Milestones
                    </span>
                    <span className="font-semibold">{milestonesDone}/{MILESTONES.length}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${(milestonesDone / MILESTONES.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Milestone checklist (In Progress only) */}
                {project.status === "In Progress" && (
                  <div className="space-y-1.5 rounded-md border bg-muted/30 p-2.5">
                    {MILESTONES.map((label, idx) => {
                      const checked = milestones.includes(idx);
                      const isFinal = idx === MILESTONES.length - 1;
                      return (
                        <label
                          key={idx}
                          className={`flex items-start gap-2 text-xs cursor-pointer rounded px-1.5 py-1 ${isFinal ? "bg-success/10 border border-success/30" : ""}`}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleMilestone(project.id, idx)}
                            className="mt-0.5"
                          />
                          <span className={`leading-tight ${checked ? "line-through text-muted-foreground" : ""} ${isFinal ? "font-semibold" : ""}`}>
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {urgency === "overdue" && (
                  <div className="rounded-md bg-destructive/5 p-2.5 text-xs text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Overdue by {Math.abs(daysLeft)} day{Math.abs(daysLeft) !== 1 ? "s" : ""} — flagged as Compliance Risk
                  </div>
                )}

                {urgency === "due-soon" && (
                  <div className="rounded-md bg-warning/10 p-2.5 text-xs text-warning-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining — is this project complete?
                  </div>
                )}

                {reminderStatus && (
                  <div className={`rounded-md p-2.5 text-xs flex items-center gap-1.5 ${reminderStatus.active ? "bg-primary/10 text-primary font-semibold" : "bg-muted/50 text-muted-foreground"}`}>
                    <Bell className="h-3.5 w-3.5" />
                    {reminderStatus.label}
                  </div>
                )}

                {project.status === "Completed" && project.evidence ? (
                  <div className="rounded-md bg-success/10 p-2.5 text-xs text-success flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Evidence: {project.evidence}
                  </div>
                ) : project.status !== "Completed" ? (
                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      disabled={!firstThreeDone}
                      onClick={() => markEvidenceUploaded(project.id)}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Evidence to Verify
                    </Button>
                    {!firstThreeDone && (
                      <p className="text-[10px] text-muted-foreground text-center">
                        Complete first 3 milestones to unlock
                      </p>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}