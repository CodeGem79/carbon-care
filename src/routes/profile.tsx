import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, Save, Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Organisation settings and configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            Organisation Details
          </CardTitle>
          <CardDescription>Configure your company and fiscal year settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input placeholder="Your Company Ltd" defaultValue="" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Select defaultValue="3">
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
              <Label>Baseline Year</Label>
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}/{y + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Monthly Carbon Target (kg CO₂e)</Label>
            <Input type="number" placeholder="500" defaultValue="500" />
          </div>

          <Button>
            <Save className="h-4 w-4" />
            Save Organisation Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Board Approval</CardTitle>
          <CardDescription>PPN 06/21 requires the date the board formally approved the Carbon Reduction Plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Board Approval Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Approving Authority</Label>
              <Input placeholder="e.g., Board of Directors" />
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4" />
            Save Approval Details
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Carbon Reduction Commitment</CardTitle>
          <CardDescription>This information appears on your CRP document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Carbon Commitment Statement</Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="Describe your organisation's carbon reduction commitment..."
            />
          </div>
          <div className="space-y-2">
            <Label>Scope 3 Methodology / Exclusions</Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="e.g., Downstream transportation excluded due to lack of reliable data from logistics partners. Franchises excluded — not applicable to our business model."
            />
            <p className="text-xs text-muted-foreground">
              If any Scope 3 categories are excluded from your footprint, you must document the reason here for PPN 06/21 compliance.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Signatory Name</Label>
              <Input placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label>Signatory Role</Label>
              <Input placeholder="Chief Sustainability Officer" />
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4" />
            Save Commitment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}