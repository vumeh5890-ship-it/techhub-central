import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/thms/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [
    { title: "Reports — THMS" },
    { name: "description", content: "Income, expenses and task completion summaries." },
    { property: "og:title", content: "Reports — THMS" },
    { property: "og:description", content: "Income, expenses and task completion summaries." },
  ] }),
  component: Reports,
});

function Reports() {
  const { data } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const [{ data: fin }, { data: tasks }] = await Promise.all([
        supabase.from("financial_transactions").select("type, amount"),
        supabase.from("tasks").select("status"),
      ]);
      const sum = (t: string) => (fin ?? []).filter((r) => r.type === t).reduce((a, r) => a + Number(r.amount), 0);
      const done = (tasks ?? []).filter((t) => t.status === "Completed").length;
      return { income: sum("Income"), expense: sum("Expense"), tasks: tasks?.length ?? 0, done };
    },
  });
  const items = [
    ["Total income", data?.income.toLocaleString()],
    ["Total expenses", data?.expense.toLocaleString()],
    ["Balance", data ? (data.income - data.expense).toLocaleString() : undefined],
    ["Tasks completed", data ? `${data.done} / ${data.tasks}` : undefined],
  ];
  return (
    <div>
      <PageHeader title="Reports" description="Key numbers across the company." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(([l, v]) => (
          <Card key={l} className="p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-2 text-2xl font-semibold text-foreground">{v ?? "—"}</p></Card>
        ))}
      </div>
    </div>
  );
}
