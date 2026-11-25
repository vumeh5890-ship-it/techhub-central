import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import { PageHeader } from "@/components/thms/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [
    { title: "My Profile — THMS" },
    { name: "description", content: "Your account details and roles." },
    { property: "og:title", content: "My Profile — THMS" },
    { property: "og:description", content: "Your account details and roles." },
  ] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, roles } = useAuth();
  const { data } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const [name, setName] = useState("");
  useEffect(() => { setName(data?.full_name ?? ""); }, [data]);
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user!.id); if (error) throw error; },
    onSuccess: () => toast.success("Profile updated"),
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="My Profile" description={user?.email ?? ""} />
      <Card className="max-w-lg space-y-4 p-6">
        <div className="space-y-1.5"><Label htmlFor="n">Full name</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <p className="text-sm text-muted-foreground">Roles: {roles.map((r) => ROLE_LABELS[r]).join(", ") || "—"}</p>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
      </Card>
    </div>
  );
}
