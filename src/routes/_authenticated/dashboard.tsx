import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/thms/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — THMS" },
    { name: "description", content: "Overview of staff, tasks, events and finances." },
    { property: "og:title", content: "Dashboard — THMS" },
    { property: "og:description", content: "Overview of staff, tasks, events and finances." },
  ] }),
  component: Dashboard,
});

async function count(table: "employees" | "tasks" | "events" | "assets" | "leave_requests", f?: (q: any) => any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (f) q = f(q);
  const { count: c } = await q;
  return c ?? 0;
}

function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => ({
      employees: await count("employees", (q) => q.eq("status", "Active")),
      openTasks: await count("tasks", (q) => q.not("status", "in", "(Completed,Cancelled)")),
      overdue: await count("tasks", (q) => q.not("status", "in", "(Completed,Cancelled)").lt("due_date", today)),
      events: await count("events", (q) => q.gte("date", today)),
      assets: await count("assets"),
      leave: await count("leave_requests", (q) => q.eq("status", "Pending")),
    }),
  });
  const cards = [
    ["Active employees", data?.employees, "/employees"],
    ["Open tasks", data?.openTasks, "/tasks"],
    ["Overdue tasks", data?.overdue, "/tasks"],
    ["Upcoming events", data?.events, "/events"],
    ["Assets", data?.assets, "/assets"],
    ["Pending leave", data?.leave, "/leave"],
  ] as const;
  return (
    <div>
      <PageHeader title="Dashboard" description="What's happening across the hub today." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, v, to]) => (
          <Link key={label} to={to}>
            <Card className="p-5 transition-colors hover:border-primary">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{v ?? "—"}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
