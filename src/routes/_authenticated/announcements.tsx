import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/announcements")({
  head: () => ({ meta: [
    { title: "Announcements — THMS" },
    { name: "description", content: "Company-wide news and notices." },
    { property: "og:title", content: "Announcements — THMS" },
    { property: "og:description", content: "Company-wide news and notices." },
  ] }),
  component: AnnouncementsPage,
});

const fields: Field[] = [{"name": "title", "label": "Title", "type": "text", "required": true}, {"name": "category", "label": "Category", "type": "select", "options": ["General", "HR", "Event", "Urgent"], "required": true, "default": "General"}, {"name": "body", "label": "Message", "type": "textarea", "required": true, "full": true}];
const columns: Column[] = [{"key": "created_at", "label": "Posted"}, {"key": "title", "label": "Title"}, {"key": "category", "label": "Category"}];

function AnnouncementsPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Announcements" description="Company-wide news and notices." />
      <ResourcePage table="announcements" title="Announcements" singular="Announcement" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isHR} canEdit={() => auth.isHR} canDelete={auth.isAdmin} />
    </div>
  );
}
