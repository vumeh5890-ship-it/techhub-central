import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/thms/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [
    { title: "Settings — THMS" },
    { name: "description", content: "Company details and working hours." },
    { property: "og:title", content: "Settings — THMS" },
    { property: "og:description", content: "Company details and working hours." },
  ] }),
  component: SettingsPage,
});

const KEYS = ["company_name", "address", "phone", "email", "currency", "currency_symbol", "timezone"] as const;

function SettingsPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle()).data,
  });
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => { if (data) setForm(Object.fromEntries(KEYS.map((k) => [k, String(data[k] ?? "")]))); }, [data]);
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("company_settings").update(form as never).eq("id", 1); if (error) throw error; },
    onSuccess: () => { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="Settings" description="Company details used across the system." />
      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        {KEYS.map((k) => (
          <div key={k} className="space-y-1.5">
            <Label htmlFor={k} className="capitalize">{k.replace(/_/g, " ")}</Label>
            <Input id={k} value={form[k] ?? ""} disabled={!isAdmin} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        {isAdmin && <div className="sm:col-span-2"><Button onClick={() => save.mutate()} disabled={save.isPending}>Save settings</Button></div>}
      </Card>
    </div>
  );
}
