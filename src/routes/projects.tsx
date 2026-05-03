import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

type ProjectStatus = "Planned" | "In Progress" | "Completed";
type ProjectCategory = "Energy Efficiency" | "Transport" | "Waste" | "Water" | "Renewable Energy" | "Other";

interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  targetDate: string;
  estimatedSavings: number;
  status: ProjectStatus;
  evidence?: string;
  createdAt: string;
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
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Install Solar Panels",
    category: "Renewable Energy",
    targetDate: "2026-06-15",
    estimatedSavings: 2400,
    status: "Planned",
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    name: "EV Fleet Transition (Phase 1)",
    category: "Transport",
    targetDate: "2025-12-01",
    estimatedSavings: 1800,
    status: "Planned",
    createdAt: "2025-06-10",
  },
  {
    id: "4",
    name: "Waste Segregation Programme",
    category: "Waste",
    targetDate: "2026-03-01",
    estimatedSavings: 320,
    status: "Completed",
    evidence: "invoice-waste-2026.pdf",
    createdAt: "2025-09-20",
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

  const resetForm = () => {
    setFormName("");
    setFormCategory("Energy Efficiency");
    setFormDate("");
    setFormSavings("");
    setFormStatus("Planned");
    setEditingId(null);
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
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formDate || !formSavings) return;
    if (editingId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: formName, category: formCategory, targetDate: formDate, estimatedSavings: Number(formSavings), status: formStatus }
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
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProjects((prev) => [...prev, newProject]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Savings (kg CO₂e)</Label>
                  <Input type="number" placeholder="500" value={formSavings} onChange={(e) => setFormSavings(e.target.value)} />
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

                {project.status === "Completed" && project.evidence ? (
                  <div className="rounded-md bg-success/10 p-2.5 text-xs text-success flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Evidence: {project.evidence}
                  </div>
                ) : project.status !== "Completed" ? (
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Evidence to Verify
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}