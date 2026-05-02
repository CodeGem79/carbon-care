import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, Building2 } from "lucide-react";

export const Route = createFileRoute("/locations")({
  component: LocationsPage,
});

const initialLocations = [
  { id: "1", name: "HQ London", sqFt: "12000", managerEmail: "ops@company.com" },
  { id: "2", name: "Warehouse Birmingham", sqFt: "25000", managerEmail: "warehouse@company.com" },
  { id: "3", name: "Office Manchester", sqFt: "5000", managerEmail: "manchester@company.com" },
];

function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Manage your organisation's sites</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input placeholder="e.g. HQ London" />
              </div>
              <div className="space-y-2">
                <Label>Square Footage</Label>
                <Input type="number" placeholder="e.g. 12000" />
              </div>
              <div className="space-y-2">
                <Label>Manager Email</Label>
                <Input type="email" placeholder="manager@company.com" />
              </div>
              <Button className="w-full">Save Location</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <Card key={loc.id} className="group relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{loc.name}</h3>
                    <p className="text-xs text-muted-foreground">{Number(loc.sqFt).toLocaleString()} sq ft</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {loc.managerEmail}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}