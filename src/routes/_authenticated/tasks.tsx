import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [
    { title: "Tasks & Projects — THMS" },
    { name: "description", content: "Assigned work, deadlines and progress." },
    { property: "og:title", content: "Tasks & Projects — THMS" },
    { property: "og:description", content: "Assigned work, deadlines and progress." },
  ] }),
  component: TasksPage,
});

const fields: Field[] = [{"name": "title", "label": "Title", "type": "text", "required": true}, {"name": "project_id", "label": "Project", "type": "project"}, {"name": "assignee_id", "label": "Assignee", "type": "employee"}, {"name": "priority", "label": "Priority", "type": "select", "options": ["Low", "Medium", "High", "Urgent"], "required": true, "default": "Medium"}, {"name": "status", "label": "Status", "type": "select", "options": ["To do", "In progress", "Review", "Completed", "Cancelled"], "required": true, "default": "To do"}, {"name": "due_date", "label": "Due date", "type": "date"}, {"name": "description", "label": "Description", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "title", "label": "Task"}, {"key": "assignee_id", "label": "Assignee"}, {"key": "priority", "label": "Priority"}, {"key": "status", "label": "Status"}, {"key": "due_date", "label": "Due"}];

function TasksPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Tasks & Projects" description="Assigned work, deadlines and progress." />
      <ResourcePage table="tasks" title="Tasks & Projects" singular="Task" fields={fields} columns={columns}
        order={{ column: "created_at", ascending: false }} canCreate={auth.isManager} canEdit={() => auth.isManager} canDelete={auth.isAdmin} />
    </div>
  );
}
