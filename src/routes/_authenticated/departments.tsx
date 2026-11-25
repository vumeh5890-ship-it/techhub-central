import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/departments")({
  head: () => ({ meta: [
    { title: "Departments — THMS" },
    { name: "description", content: "Company departments and managers." },
    { property: "og:title", content: "Departments — THMS" },
    { property: "og:description", content: "Company departments and managers." },
  ] }),
  component: DepartmentsPage,
});

const fields: Field[] = [{"name": "name", "label": "Name", "type": "text", "required": true}, {"name": "description", "label": "Description", "type": "textarea"}, {"name": "manager_id", "label": "Manager", "type": "employee"}];
const columns: Column[] = [{"key": "name", "label": "Name"}, {"key": "manager_id", "label": "Manager"}, {"key": "description", "label": "Description"}];

function DepartmentsPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Departments" description="Company departments and managers." />
      <ResourcePage table="departments" title="Departments" singular="Department" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isAdmin} canEdit={() => auth.isAdmin} canDelete={auth.isAdmin} />
    </div>
  );
}
