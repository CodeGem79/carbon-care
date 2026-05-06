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
            <Input type="number" placeholder="Total target (auto-calculated)" defaultValue="500" disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">Total is the sum of the three scope targets below</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Scope 1 Target</Label>
              <Input type="number" placeholder="200" defaultValue="200" />
              <p className="text-xs text-muted-foreground">Direct emissions</p>
            </div>
            <div className="space-y-2">
              <Label>Scope 2 Target</Label>
              <Input type="number" placeholder="200" defaultValue="200" />
              <p className="text-xs text-muted-foreground">Indirect (energy)</p>
            </div>
            <div className="space-y-2">
              <Label>Scope 3 Target</Label>
              <Input type="number" placeholder="100" defaultValue="100" />
              <p className="text-xs text-muted-foreground">Value chain</p>
            </div>
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
         <CardTitle className="text-base">Baseline Rationale</CardTitle>
         <CardDescription>Explain why your chosen baseline year was selected — auditors require this justification</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
         <div className="space-y-2">
           <Label>Baseline Year Rationale</Label>
           <Textarea
             className="min-h-[80px]"
             placeholder="e.g., 2024/25 was selected as the baseline year as it represents the first full year of comprehensive data collection post-pandemic, providing a reliable and representative starting point for measuring carbon reduction progress."
           />
           <p className="text-xs text-muted-foreground">
             PPN 06/21 requires a clear rationale for the chosen baseline year. This is especially important if the year differs from the organisation's first year of operation.
           </p>
         </div>
         <Button>
           <Save className="h-4 w-4" />
           Save Rationale
         </Button>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle className="text-base">Exclusions & Methodology</CardTitle>
         <CardDescription>Document excluded emission categories and your calculation methodology</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
         <div className="space-y-2">
           <Label>Scope 3 Exclusions</Label>
           <Textarea
             className="min-h-[80px]"
             placeholder="e.g., Downstream transportation excluded — not applicable to our digital service model. Franchises excluded — the organisation does not operate a franchise model."
           />
           <p className="text-xs text-muted-foreground">
             If any mandatory Scope 3 category shows zero or is omitted, you must explain why. A missing justification will be flagged as non-compliant.
           </p>
         </div>
         <div className="space-y-2">
           <Label>Calculation Methodology</Label>
           <Textarea
             className="min-h-[80px]"
             placeholder="e.g., Emissions calculated using DEFRA 2025 conversion factors. Electricity consumption based on meter readings; gas estimated from supplier invoices."
           />
           <p className="text-xs text-muted-foreground">
             Describe the emission factors, data sources, and any estimation methods used in your calculations.
           </p>
         </div>
         <Button>
           <Save className="h-4 w-4" />
           Save Methodology
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
           <Label>Net Zero Target Year</Label>
           <Select defaultValue="2050">
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               {[2030, 2035, 2040, 2045, 2050].map((y) => (
                 <SelectItem key={y} value={String(y)}>{y}</SelectItem>
               ))}
             </SelectContent>
           </Select>
           <p className="text-xs text-muted-foreground">
             This target is used to plot the "Path to Net Zero" trajectory on the Sign-Off page.
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