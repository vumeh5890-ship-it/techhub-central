import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({ meta: [
    { title: "Audit Logs — THMS" },
    { name: "description", content: "Record of every change made in the system." },
    { property: "og:title", content: "Audit Logs — THMS" },
    { property: "og:description", content: "Record of every change made in the system." },
  ] }),
  component: AuditPage,
});

const fields: Field[] = [];
const columns: Column[] = [{"key": "created_at", "label": "When"}, {"key": "user_email", "label": "User"}, {"key": "action", "label": "Action"}, {"key": "table_name", "label": "Area"}, {"key": "record_id", "label": "Record"}];

function AuditPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Audit Logs" description="Record of every change made in the system." />
      <ResourcePage table="audit_logs" title="Audit Logs" singular="Log entry" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={false} canEdit={() => false} canDelete={false} />
    </div>
  );
}
