import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  good: "bg-success/15 text-success border-success/30",
  warn: "bg-warning/15 text-warning-foreground border-warning/40 dark:text-warning",
  bad: "bg-destructive/12 text-destructive border-destructive/30",
  info: "bg-info/12 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
};
const map: Record<string, keyof typeof tone> = {
  Active: "good", Present: "good", Completed: "good", Approved: "good", Available: "good", income: "good", Scheduled: "info",
  "On probation": "info", "In Progress": "info", Planned: "info", Assigned: "info", Planning: "info", Rescheduled: "warn",
  "Under Review": "warn", Pending: "warn", Late: "warn", "On leave": "warn", "Under Maintenance": "warn", "Info requested": "warn", "Half day": "warn", "On Hold": "warn", Medium: "info", High: "warn",
  Suspended: "bad", Terminated: "bad", Rejected: "bad", Absent: "bad", Damaged: "bad", Unfinished: "bad", Critical: "bad", expense: "bad", Emergency: "bad", Important: "warn",
  Resigned: "muted", Cancelled: "muted", Retired: "muted", "To Do": "muted", Low: "muted",
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap", tone[map[value] ?? "muted"])}>
      {value}
    </span>
  );
}
