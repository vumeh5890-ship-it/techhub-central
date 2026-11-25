import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/finance")({
  head: () => ({ meta: [
    { title: "Finance — THMS" },
    { name: "description", content: "Income and expense records." },
    { property: "og:title", content: "Finance — THMS" },
    { property: "og:description", content: "Income and expense records." },
  ] }),
  component: FinancePage,
});

const fields: Field[] = [{"name": "type", "label": "Type", "type": "select", "options": ["Income", "Expense"], "required": true, "default": "Income"}, {"name": "category", "label": "Category", "type": "text", "required": true}, {"name": "amount", "label": "Amount", "type": "number", "required": true, "min": 0}, {"name": "date", "label": "Date", "type": "date", "required": true}, {"name": "payment_method", "label": "Payment method", "type": "text"}, {"name": "source", "label": "Source / payee", "type": "text"}, {"name": "receipt_path", "label": "Receipt", "type": "file", "bucket": "receipts"}, {"name": "description", "label": "Description", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "date", "label": "Date"}, {"key": "type", "label": "Type"}, {"key": "category", "label": "Category"}, {"key": "amount", "label": "Amount"}, {"key": "description", "label": "Description"}];

function FinancePage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Finance" description="Income and expense records." />
      <ResourcePage table="financial_transactions" title="Finance" singular="Transaction" fields={fields} columns={columns}
        order={{ column: "date", ascending: false }} canCreate={auth.isAdmin} canEdit={() => auth.isAdmin} canDelete={auth.isAdmin} />
    </div>
  );
}
