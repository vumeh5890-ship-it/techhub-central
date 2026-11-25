import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/operations")({
  head: () => ({ meta: [
    { title: "Daily Operations — THMS" },
    { name: "description", content: "Daily activities and their progress." },
    { property: "og:title", content: "Daily Operations — THMS" },
    { property: "og:description", content: "Daily activities and their progress." },
  ] }),
  component: OperationsPage,
});

const fields: Field[] = [{"name": "title", "label": "Title", "type": "text", "required": true}, {"name": "date", "label": "Date", "type": "date", "required": true}, {"name": "start_time", "label": "Start", "type": "time"}, {"name": "end_time", "label": "End", "type": "time"}, {"name": "location", "label": "Location", "type": "text"}, {"name": "responsible_employee_id", "label": "Responsible", "type": "employee"}, {"name": "department_id", "label": "Department", "type": "department"}, {"name": "priority", "label": "Priority", "type": "select", "options": ["Low", "Medium", "High", "Urgent"], "required": true, "default": "Medium"}, {"name": "status", "label": "Status", "type": "select", "options": ["Planned", "In progress", "Completed", "Cancelled"], "required": true, "default": "Planned"}, {"name": "progress", "label": "Progress %", "type": "number", "min": 0, "max": 100, "default": 0}, {"name": "description", "label": "Description", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "date", "label": "Date"}, {"key": "title", "label": "Title"}, {"key": "responsible_employee_id", "label": "Responsible"}, {"key": "priority", "label": "Priority"}, {"key": "status", "label": "Status"}];

function OperationsPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Daily Operations" description="Daily activities and their progress." />
      <ResourcePage table="daily_activities" title="Daily Operations" singular="Activity" fields={fields} columns={columns}
        order={{ column: "date", ascending: false }} canCreate={auth.isManager} canEdit={() => auth.isManager} canDelete={auth.isAdmin} />
    </div>
  );
}
