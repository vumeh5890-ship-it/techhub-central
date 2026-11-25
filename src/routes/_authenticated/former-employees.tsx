import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/former-employees")({
  head: () => ({ meta: [
    { title: "Former Employees — THMS" },
    { name: "description", content: "Employees who resigned or were terminated." },
    { property: "og:title", content: "Former Employees — THMS" },
    { property: "og:description", content: "Employees who resigned or were terminated." },
  ] }),
  component: FormerEmployeesPage,
});

const fields: Field[] = [{"name": "departure_date", "label": "Departure date", "type": "date"}, {"name": "departure_reason", "label": "Reason", "type": "textarea"}, {"name": "exit_interview_notes", "label": "Exit interview notes", "type": "textarea"}];
const columns: Column[] = [{"key": "employee_code", "label": "Code"}, {"key": "full_name", "label": "Name"}, {"key": "status", "label": "Status"}, {"key": "departure_date", "label": "Left on"}];

function FormerEmployeesPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Former Employees" description="Employees who resigned or were terminated." />
      <ResourcePage table="employees" title="Former Employees" singular="Employee" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isHR} canEdit={() => auth.isHR} canDelete={auth.isAdmin} apply={(q) => q.in("status", ["Resigned", "Terminated"])} />
    </div>
  );
}
