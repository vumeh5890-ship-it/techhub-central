import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/employees")({
  head: () => ({ meta: [
    { title: "Employees — THMS" },
    { name: "description", content: "Staff directory and employment details." },
    { property: "og:title", content: "Employees — THMS" },
    { property: "og:description", content: "Staff directory and employment details." },
  ] }),
  component: EmployeesPage,
});

const fields: Field[] = [{"name": "employee_code", "label": "Employee code", "type": "text", "required": true}, {"name": "full_name", "label": "Full name", "type": "text", "required": true}, {"name": "email", "label": "Email", "type": "email"}, {"name": "phone", "label": "Phone", "type": "text"}, {"name": "department_id", "label": "Department", "type": "department"}, {"name": "job_title", "label": "Job title", "type": "text"}, {"name": "employment_type", "label": "Employment type", "type": "select", "options": ["Full-time", "Part-time", "Contract", "Intern"], "required": true, "default": "Full-time"}, {"name": "employment_date", "label": "Employment date", "type": "date", "required": true}, {"name": "status", "label": "Status", "type": "select", "options": ["Active", "On leave", "Suspended", "Resigned", "Terminated"], "required": true, "default": "Active"}];
const columns: Column[] = [{"key": "employee_code", "label": "Code"}, {"key": "full_name", "label": "Name"}, {"key": "job_title", "label": "Title"}, {"key": "department_id", "label": "Department"}, {"key": "status", "label": "Status"}];

function EmployeesPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Employees" description="Staff directory and employment details." />
      <ResourcePage table="employees" title="Employees" singular="Employee" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isHR} canEdit={() => auth.isHR} canDelete={auth.isAdmin} apply={(q) => q.not("status", "in", "(Resigned,Terminated)")} />
    </div>
  );
}
