import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Moon, Search, Sun, User, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import { applyTheme, getTheme } from "@/lib/theme";
import { fmtDateTime, setCurrency } from "@/lib/format";
import { useSettings } from "@/hooks/use-lookups";
import { NAV } from "./nav";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

function AppSidebar() {
  const { isManager, isHR, isAdmin, roles } = useAuth();
  const loc = useLocation();
  const { setOpenMobile } = useSidebar();
  const allowed = NAV.filter((n) => !n.access || (n.access === "manager" && isManager) || (n.access === "hr" && isHR) || (n.access === "admin" && isAdmin));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4"><Link to="/dashboard"><Logo /></Link></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {allowed.map((n) => (
                <SidebarMenuItem key={n.to}>
                  <SidebarMenuButton asChild isActive={loc.pathname.startsWith(n.to)} tooltip={n.label}>
                    <Link to={n.to} onClick={() => setOpenMobile(false)}><n.icon /><span>{n.label}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-xs opacity-70 group-data-[collapsible=icon]:hidden">
        {roles.map((r) => ROLE_LABELS[r]).join(", ") || "No role"}
      </SidebarFooter>
    </Sidebar>
  );
}

function Notifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
      return data ?? [];
    },
  });
  const unread = (data ?? []).filter((n) => !n.read).length;
  async function markAll() {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }
  async function openOne(id: string, link: string | null) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["notifications"] });
    if (link) navigate({ to: link.split("#")[0] as "/dashboard" });
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && <button className="text-xs text-info hover:underline" onClick={markAll}>Mark all read</button>}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {(data ?? []).length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</p>}
          {(data ?? []).map((n) => (
            <button key={n.id} onClick={() => openOne(n.id, n.link)} className={`block w-full border-b px-3 py-2 text-left hover:bg-muted ${n.read ? "opacity-60" : ""}`}>
              <p className="text-sm font-medium">{n.title}</p>
              {n.body && <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
              <p className="mt-0.5 text-[10px] text-muted-foreground">{fmtDateTime(n.created_at)}</p>
            </button>
          ))}
        </div>
        <Link to="/profile" className="block border-t px-3 py-2 text-center text-xs text-muted-foreground hover:text-foreground">Notification preferences</Link>
      </PopoverContent>
    </Popover>
  );
}

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const { data } = useQuery({
    queryKey: ["search", q],
    enabled: open && q.trim().length > 1,
    queryFn: async () => {
      const term = `%${q.trim().replace(/[%,()]/g, "")}%`;
      const [e, t, ev, p, a] = await Promise.all([
        supabase.from("employees").select("id, full_name, job_title").or(`full_name.ilike.${term},email.ilike.${term},employee_code.ilike.${term}`).limit(5),
        supabase.from("tasks").select("id, title").ilike("title", term).limit(5),
        supabase.from("events").select("id, title, date").ilike("title", term).limit(5),
        supabase.from("projects").select("id, name").ilike("name", term).limit(5),
        supabase.from("assets").select("id, name, asset_code").or(`name.ilike.${term},asset_code.ilike.${term},serial_number.ilike.${term}`).limit(5),
      ]);
      return { e: e.data ?? [], t: t.data ?? [], ev: ev.data ?? [], p: p.data ?? [], a: a.data ?? [] };
    },
  });
  const go = (to: string, params?: Record<string, string>) => { setOpen(false); navigate({ to: to as "/dashboard", params: params as never }); };
  return (
    <>
      <Button variant="outline" className="hidden h-9 w-64 justify-start text-muted-foreground md:flex" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" /> Search everything… <kbd className="ml-auto text-[10px]">Ctrl K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search" onClick={() => setOpen(true)}><Search className="h-5 w-5" /></Button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput placeholder="Search employees, tasks, events, projects, assets…" value={q} onValueChange={setQ} />
        <CommandList>
          <CommandEmpty>{q.length < 2 ? "Type at least 2 characters." : "No results."}</CommandEmpty>
          {!!data?.e.length && <CommandGroup heading="Employees">{data.e.map((x) => <CommandItem key={x.id} onSelect={() => go("/employees/$id", { id: x.id })}>{x.full_name} <span className="text-xs text-muted-foreground">{x.job_title}</span></CommandItem>)}</CommandGroup>}
          {!!data?.t.length && <CommandGroup heading="Tasks">{data.t.map((x) => <CommandItem key={x.id} onSelect={() => go("/tasks")}>{x.title}</CommandItem>)}</CommandGroup>}
          {!!data?.p.length && <CommandGroup heading="Projects">{data.p.map((x) => <CommandItem key={x.id} onSelect={() => go("/tasks")}>{x.name}</CommandItem>)}</CommandGroup>}
          {!!data?.ev.length && <CommandGroup heading="Events">{data.ev.map((x) => <CommandItem key={x.id} onSelect={() => go("/events")}>{x.title} <span className="text-xs text-muted-foreground">{x.date}</span></CommandItem>)}</CommandGroup>}
          {!!data?.a.length && <CommandGroup heading="Assets">{data.a.map((x) => <CommandItem key={x.id} onSelect={() => go("/assets")}>{x.name} <span className="text-xs text-muted-foreground">{x.asset_code}</span></CommandItem>)}</CommandGroup>}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function Crumbs() {
  const loc = useLocation();
  const parts = loc.pathname.split("/").filter(Boolean);
  const label = (p: string) => NAV.find((n) => n.to === `/${p}`)?.label ?? (p.length > 20 ? "Details" : p.charAt(0).toUpperCase() + p.slice(1));
  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink asChild><Link to="/dashboard">Home</Link></BreadcrumbLink></BreadcrumbItem>
        {parts.map((p, i) => (
          <span key={p} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === parts.length - 1 ? <BreadcrumbPage>{label(p)}</BreadcrumbPage> : <BreadcrumbLink asChild><Link to={`/${parts.slice(0, i + 1).join("/")}` as "/dashboard"}>{label(p)}</Link></BreadcrumbLink>}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const settings = useSettings();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setTheme(getTheme());
    setOnline(navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  useEffect(() => {
    if (settings.data) setCurrency(settings.data.currency, settings.data.currency_symbol);
  }, [settings.data]);
  useEffect(() => {
    if (user) supabase.rpc("generate_my_reminders").then(() => qc.invalidateQueries({ queryKey: ["notifications"] }));
  }, [user, qc]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger />
          <Crumbs />
          <div className="ml-auto flex items-center gap-1">
            <GlobalSearch />
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => { const t = theme === "dark" ? "light" : "dark"; setTheme(t); applyTheme(t); }}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{(user?.email ?? "?").slice(0, 2).toUpperCase()}</div></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}><User className="h-4 w-4" /> My profile</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {!online && (
          <div className="flex items-center gap-2 bg-warning/20 px-4 py-2 text-sm"><WifiOff className="h-4 w-4" /> You are offline. Changes cannot be saved until your connection returns.</div>
        )}
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
