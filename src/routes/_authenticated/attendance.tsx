import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({ meta: [
    { title: "Attendance — THMS" },
    { name: "description", content: "Daily check-ins and attendance status." },
    { property: "og:title", content: "Attendance — THMS" },
    { property: "og:description", content: "Daily check-ins and attendance status." },
  ] }),
  component: AttendancePage,
});

const fields: Field[] = [{"name": "employee_id", "label": "Employee", "type": "employee", "required": true}, {"name": "date", "label": "Date", "type": "date", "required": true}, {"name": "status", "label": "Status", "type": "select", "options": ["Present", "Late", "Absent", "On leave", "Remote"], "required": true, "default": "Present"}, {"name": "notes", "label": "Notes", "type": "textarea"}];
const columns: Column[] = [{"key": "date", "label": "Date"}, {"key": "employee_id", "label": "Employee"}, {"key": "status", "label": "Status"}, {"key": "notes", "label": "Notes"}];

function AttendancePage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Attendance" description="Daily check-ins and attendance status." />
      <ResourcePage table="attendance" title="Attendance" singular="Attendance record" fields={fields} columns={columns}
        order={{ column: "date", ascending: false }} canCreate={auth.isHR} canEdit={() => auth.isHR} canDelete={auth.isAdmin} />
    </div>
  );
}
