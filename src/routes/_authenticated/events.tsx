import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, type Field, type Column } from "@/components/thms/resource-page";
import { PageHeader } from "@/components/thms/page-header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/events")({
  head: () => ({ meta: [
    { title: "Events & Calendar — THMS" },
    { name: "description", content: "Company events, trainings and meetings." },
    { property: "og:title", content: "Events & Calendar — THMS" },
    { property: "og:description", content: "Company events, trainings and meetings." },
  ] }),
  component: EventsPage,
});

const fields: Field[] = [{"name": "title", "label": "Title", "type": "text", "required": true}, {"name": "category", "label": "Category", "type": "select", "options": ["Meeting", "Training", "Workshop", "Hackathon", "Social", "Other"], "required": true, "default": "Meeting"}, {"name": "date", "label": "Date", "type": "date", "required": true}, {"name": "start_time", "label": "Start", "type": "time"}, {"name": "end_time", "label": "End", "type": "time"}, {"name": "venue", "label": "Venue", "type": "text"}, {"name": "organizer", "label": "Organizer", "type": "text"}, {"name": "status", "label": "Status", "type": "select", "options": ["Scheduled", "Completed", "Cancelled"], "required": true, "default": "Scheduled"}, {"name": "description", "label": "Description", "type": "textarea", "full": true}];
const columns: Column[] = [{"key": "date", "label": "Date"}, {"key": "title", "label": "Event"}, {"key": "category", "label": "Category"}, {"key": "venue", "label": "Venue"}, {"key": "status", "label": "Status"}];

function EventsPage() {
  const auth = useAuth();
  return (
    <div>
      <PageHeader title="Events & Calendar" description="Company events, trainings and meetings." />
      <ResourcePage table="events" title="Events & Calendar" singular="Event" fields={fields} columns={columns}
        order={{ column: "date", ascending: false }} canCreate={auth.isManager} canEdit={() => auth.isManager} canDelete={auth.isAdmin} />
    </div>
  );
}
