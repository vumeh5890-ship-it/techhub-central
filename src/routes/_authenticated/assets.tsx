import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/assets")({
  head: () => ({ meta: [
    { title: "Equipment & Assets — THMS" },
    { name: "description", content: "Company equipment inventory." },
    { property: "og:title", content: "Equipment & Assets — THMS" },
    { property: "og:description", content: "Company equipment inventory." },
  ] }),
  component: AssetsPage,
});

const fields: Field[] = [{"name": "asset_code", "label": "Asset code", "type": "text", "required": true}, {"name": "name", "label": "Name", "type": "text", "required": true}, {"name": "category", "label": "Category", "type": "text", "required": true}, {"name": "serial_number", "label": "Serial number", "type": "text"}, {"name": "purchase_date", "label": "Purchase date", "type": "date"}, {"name": "purchase_price", "label": "Purchase price", "type": "number", "min": 0}, {"name": "assigned_employee_id", "label": "Assigned to", "type": "employee"}, {"name": "location", "label": "Location", "type": "text"}, {"name": "status", "label": "Status", "type": "select", "options": ["Available", "In use", "Under repair", "Retired"], "required": true, "default": "Available"}, {"name": "notes", "label": "Notes", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "asset_code", "label": "Code"}, {"key": "name", "label": "Name"}, {"key": "category", "label": "Category"}, {"key": "assigned_employee_id", "label": "Assigned to"}, {"key": "status", "label": "Status"}];

function AssetsPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Equipment & Assets" description="Company equipment inventory." />
      <ResourcePage table="assets" title="Equipment & Assets" singular="Asset" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isAdmin} canEdit={() => auth.isAdmin} canDelete={auth.isAdmin} />
    </div>
  );
}
