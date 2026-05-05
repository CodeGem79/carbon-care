import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gift, Users, CheckCircle2, Copy, Share2 } from "lucide-react";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "Refer a Friend — Litmus" },
      { name: "description", content: "Refer a friend to Litmus and earn a discount on your subscription." },
    ],
  }),
  component: ReferralPage,
});

interface Referral {
  id: string;
  friendName: string;
  friendEmail: string;
  friendCompany: string;
  date: string;
  status: "pending" | "signed_up" | "rewarded";
}

function ReferralPage() {
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [yourCompany, setYourCompany] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendCompany, setFriendCompany] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([
    { id: "1", friendName: "Sarah Johnson", friendEmail: "sarah@greenco.com", friendCompany: "GreenCo Ltd", date: "2026-03-15", status: "rewarded" },
    { id: "2", friendName: "Mark Davies", friendEmail: "mark@ecoworks.co.uk", friendCompany: "EcoWorks", date: "2026-04-20", status: "signed_up" },
  ]);
  const [copied, setCopied] = useState(false);

  const referralCode = "LITMUS-REF-7X9K2";
  const referralLink = `https://litmus.app/signup?ref=${referralCode}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName || !yourEmail || !friendName || !friendEmail) return;

    const newReferral: Referral = {
      id: Date.now().toString(),
      friendName,
      friendEmail,
      friendCompany,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setReferrals((prev) => [newReferral, ...prev]);
    setFriendName("");
    setFriendEmail("");
    setFriendCompany("");
    setFriendPhone("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = (s: Referral["status"]) =>
    s === "rewarded" ? "default" : s === "signed_up" ? "secondary" : "outline";

  const statusLabel = (s: Referral["status"]) =>
    s === "rewarded" ? "Reward Applied" : s === "signed_up" ? "Signed Up" : "Pending";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Refer a Friend</h1>
        <p className="mt-1 text-muted-foreground">
          Share Litmus with a colleague and you'll both receive <strong>20% off</strong> your next billing cycle.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{referrals.length}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{referrals.filter((r) => r.status === "rewarded").length}</p>
              <p className="text-xs text-muted-foreground">Rewards Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">20%</p>
              <p className="text-xs text-muted-foreground">Discount Per Referral</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5" /> Your Referral Link
          </CardTitle>
          <CardDescription>Share this link or code with friends. When they sign up, you both get rewarded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-1 h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Referral Code: <span className="font-mono font-semibold">{referralCode}</span>
          </p>
        </CardContent>
      </Card>

      {/* Referral Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send a Referral</CardTitle>
          <CardDescription>Fill in your details and your friend's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Your Details */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Details</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="yourName">Full Name *</Label>
                  <Input id="yourName" value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="Jane Smith" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="yourEmail">Email *</Label>
                  <Input id="yourEmail" type="email" value={yourEmail} onChange={(e) => setYourEmail(e.target.value)} placeholder="jane@company.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="yourCompany">Company</Label>
                  <Input id="yourCompany" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} placeholder="Company Ltd" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Friend's Details */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Friend's Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="friendName">Full Name *</Label>
                  <Input id="friendName" value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="friendEmail">Email *</Label>
                  <Input id="friendEmail" type="email" value={friendEmail} onChange={(e) => setFriendEmail(e.target.value)} placeholder="john@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="friendCompany">Company</Label>
                  <Input id="friendCompany" value={friendCompany} onChange={(e) => setFriendCompany(e.target.value)} placeholder="Their Company Ltd" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="friendPhone">Phone Number</Label>
                  <Input id="friendPhone" type="tel" value={friendPhone} onChange={(e) => setFriendPhone(e.target.value)} placeholder="+44 7700 900000" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">
                <Gift className="mr-2 h-4 w-4" /> Send Referral
              </Button>
              {submitted && (
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" /> Referral submitted!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Referral History */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referral History</CardTitle>
            <CardDescription>Track the status of your referrals below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Friend</th>
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Company</th>
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{r.friendName}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{r.friendEmail}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{r.friendCompany || "—"}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{r.date}</td>
                      <td className="py-3">
                        <Badge variant={statusColor(r.status)}>{statusLabel(r.status)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}