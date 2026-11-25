import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/leave")({
  head: () => ({ meta: [
    { title: "Leave Requests — THMS" },
    { name: "description", content: "Leave applications and approvals." },
    { property: "og:title", content: "Leave Requests — THMS" },
    { property: "og:description", content: "Leave applications and approvals." },
  ] }),
  component: LeavePage,
});

const fields: Field[] = [{"name": "employee_id", "label": "Employee", "type": "employee", "required": true}, {"name": "leave_type", "label": "Leave type", "type": "select", "options": ["Annual", "Sick", "Maternity", "Paternity", "Unpaid", "Other"], "required": true, "default": "Annual"}, {"name": "start_date", "label": "Start", "type": "date", "required": true}, {"name": "end_date", "label": "End", "type": "date", "required": true}, {"name": "reason", "label": "Reason", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "employee_id", "label": "Employee"}, {"key": "leave_type", "label": "Type"}, {"key": "start_date", "label": "From"}, {"key": "end_date", "label": "To"}, {"key": "status", "label": "Status"}];

function LeavePage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Leave Requests" description="Leave applications and approvals." />
      <ResourcePage table="leave_requests" title="Leave Requests" singular="Leave request" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={!!auth.user} canEdit={() => !!auth.user} canDelete={auth.isAdmin} />
    </div>
  );
}
