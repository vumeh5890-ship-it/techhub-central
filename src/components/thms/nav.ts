import { BarChart3, Boxes, Building2, CalendarDays, ClipboardList, Clock, FileClock, KanbanSquare, LayoutDashboard, Megaphone, Plane, Settings, UserMinus, Users, Wallet } from "lucide-react";

export type NavItem = { to: string; label: string; icon: typeof Users; access?: "manager" | "hr" | "admin" };
export const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/former-employees", label: "Former Employees", icon: UserMinus, access: "hr" },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/operations", label: "Daily Operations", icon: ClipboardList },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/tasks", label: "Tasks & Projects", icon: KanbanSquare },
  { to: "/events", label: "Events & Calendar", icon: CalendarDays },
  { to: "/leave", label: "Leave Requests", icon: Plane },
  { to: "/finance", label: "Finance", icon: Wallet, access: "admin" },
  { to: "/assets", label: "Equipment & Assets", icon: Boxes },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/reports", label: "Reports", icon: BarChart3, access: "manager" },
  { to: "/audit", label: "Audit Logs", icon: FileClock, access: "admin" },
  { to: "/settings", label: "Settings", icon: Settings },
];
