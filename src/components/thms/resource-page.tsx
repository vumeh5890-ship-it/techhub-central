import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpDown, Download, FileSpreadsheet, FileText, Loader2, Paperclip, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useLookupMaps } from "@/hooks/use-lookups";
import { exportCSV, exportPDF, exportXLSX, type ExportRow } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./page-header";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export type FieldType = "text" | "email" | "textarea" | "number" | "date" | "time" | "select" | "employee" | "department" | "project" | "file";
export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  default?: unknown;
  full?: boolean;
  bucket?: "media" | "receipts";
  min?: number;
  max?: number;
}
export interface Column {
  key: string;
  label: string;
  render?: (row: Row) => ReactNode;
  value?: (row: Row) => string | number | null | undefined;
}
export interface ResourceProps {
  table: string;
  title: string;
  singular: string;
  fields: Field[];
  columns: Column[];
  select?: string;
  order?: { column: string; ascending?: boolean };
  filters?: { name: string; label: string; options: string[] }[];
  apply?: (q: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  canCreate?: boolean;
  canEdit?: (row: Row) => boolean;
  canDelete?: boolean;
  rowActions?: (row: Row) => ReactNode;
  transform?: (values: Row, editing: Row | null) => Row;
  afterSave?: (saved: Row, values: Row, editing: Row | null) => Promise<void> | void;
  emptyHint?: string;
  dateColumn?: string;
  extraQueryKey?: unknown[];
  defaults?: () => Row;
}

function buildSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    let s: z.ZodTypeAny;
    if (f.type === "number") {
      s = z.union([z.literal(""), z.coerce.number().min(f.min ?? -Infinity).max(f.max ?? Infinity)]);
      if (f.required) s = z.coerce.number({ message: `${f.label} is required` }).min(f.min ?? -Infinity).max(f.max ?? Infinity);
    } else if (f.type === "email") {
      s = f.required ? z.string().trim().email("Enter a valid email").max(255) : z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(255)]);
    } else {
      s = f.required ? z.string().trim().min(1, `${f.label} is required`).max(f.type === "textarea" ? 5000 : 255) : z.string().max(f.type === "textarea" ? 5000 : 500).optional().or(z.literal(""));
    }
    shape[f.name] = s;
  }
  return z.object(shape);
}

export function useSignedUrl() {
  return async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
    if (error || !data) { toast.error("Could not open file"); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  };
}

export function ResourcePage(props: ResourceProps) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const maps = useLookupMaps();
  const openFile = useSignedUrl();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<{ key: string; asc: boolean } | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const key = ["resource", props.table, ...(props.extraQueryKey ?? [])];

  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase.from(props.table as any).select(props.select ?? "*");
      if (props.apply) q = props.apply(q);
      if (props.order) q = q.order(props.order.column, { ascending: props.order.ascending ?? false });
      const { data, error } = await q.limit(1000);
      if (error) throw error;
      return data as Row[];
    },
  });

  const display = (c: Column, r: Row): string => {
    if (c.value) return String(c.value(r) ?? "");
    const v = r[c.key];
    if (c.key.endsWith("employee_id") || c.key === "assignee_id" || c.key === "manager_id" || c.key === "lead_id") return maps.emp.get(v) ?? "";
    if (c.key === "department_id") return maps.dept.get(v) ?? "";
    if (c.key === "project_id") return maps.proj.get(v) ?? "";
    return v == null ? "" : String(v);
  };

  const rows = useMemo(() => {
    let r = data ?? [];
    const s = search.trim().toLowerCase();
    if (s) r = r.filter((row) => props.columns.some((c) => display(c, row).toLowerCase().includes(s)));
    for (const [k, v] of Object.entries(filterVals)) if (v && v !== "__all") r = r.filter((row) => String(row[k]) === v);
    if (props.dateColumn) {
      if (from) r = r.filter((row) => String(row[props.dateColumn!] ?? "") >= from);
      if (to) r = r.filter((row) => String(row[props.dateColumn!] ?? "").slice(0, 10) <= to);
    }
    if (sort) {
      const col = props.columns.find((c) => c.key === sort.key);
      if (col) {
        r = [...r].sort((a, b) => {
          const av = col.value ? col.value(a) : a[col.key];
          const bv = col.value ? col.value(b) : b[col.key];
          const an = Number(av), bn = Number(bv);
          const cmp = !isNaN(an) && !isNaN(bn) && av !== "" && bv !== "" && av != null && bv != null ? an - bn : display(col, a).localeCompare(display(col, b));
          return sort.asc ? cmp : -cmp;
        });
      }
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filterVals, sort, from, to, maps.emp, maps.dept, maps.proj]);

  const schema = useMemo(() => buildSchema(props.fields), [props.fields]);
  const form = useForm<Row>({ resolver: zodResolver(schema) as never });

  function startCreate() {
    const d: Row = {};
    for (const f of props.fields) d[f.name] = f.default ?? "";
    Object.assign(d, props.defaults?.() ?? {});
    form.reset(d);
    setEditing(null);
    setOpen(true);
  }
  function startEdit(r: Row) {
    const d: Row = {};
    for (const f of props.fields) {
      const v = r[f.name];
      d[f.name] = v == null ? "" : f.type === "time" ? String(v).slice(0, 5) : String(v);
    }
    form.reset(d);
    setEditing(r);
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const clean: Row = {};
      for (const f of props.fields) {
        const v = values[f.name];
        clean[f.name] = v === "" || v === undefined ? null : f.type === "number" ? Number(v) : v;
      }
      const payload = props.transform ? props.transform(clean, editing) : clean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = supabase.from(props.table as any);
      const res = editing ? await t.update(payload as never).eq("id", editing["id"]).select().single() : await t.insert(payload as never).select().single();
      if (res.error) throw res.error;
      await props.afterSave?.(res.data as Row, clean, editing);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`${props.singular} ${editing ? "updated" : "created"}`);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["resource"] });
      qc.invalidateQueries({ queryKey: ["lookup"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (r: Row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from(props.table as any).delete().eq("id", r["id"]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${props.singular} deleted`);
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ["resource"] });
      qc.invalidateQueries({ queryKey: ["lookup"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function uploadFile(f: Field, file: File) {
    if (!user) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10 MB"); return; }
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from(f.bucket ?? "media").upload(path, file);
    if (error) { toast.error(error.message); return; }
    form.setValue(f.name, path, { shouldDirty: true });
    toast.success("File uploaded");
  }

  const exportRows = (): ExportRow[] =>
    rows.map((r) => Object.fromEntries(props.columns.map((c) => [c.label, display(c, r)])));

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={`Search ${props.title.toLowerCase()}…`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        {props.filters?.map((f) => (
          <Select key={f.name} value={filterVals[f.name] ?? "__all"} onValueChange={(v) => setFilterVals((s) => ({ ...s, [f.name]: v }))}>
            <SelectTrigger className="lg:w-44"><SelectValue placeholder={f.label} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All {f.label.toLowerCase()}</SelectItem>
              {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
        {props.dateColumn && (
          <div className="flex gap-2">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="lg:w-40" />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="lg:w-40" />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!rows.length}><Download className="h-4 w-4" /> Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportCSV(exportRows(), props.table)}><FileText className="h-4 w-4" /> CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportXLSX(exportRows(), props.table)}><FileSpreadsheet className="h-4 w-4" /> Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportPDF(exportRows(), props.table, props.title)}><FileText className="h-4 w-4" /> PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {props.canCreate && (
          <Button onClick={startCreate}><Plus className="h-4 w-4" /> New {props.singular.toLowerCase()}</Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : error ? (
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      ) : rows.length === 0 ? (
        <EmptyState title={`No ${props.title.toLowerCase()} yet`} hint={props.emptyHint ?? (props.canCreate ? `Click “New ${props.singular.toLowerCase()}” to add the first record.` : "")} />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {props.columns.map((c) => (
                  <TableHead key={c.key}>
                    <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => ({ key: c.key, asc: s?.key === c.key ? !s.asc : true }))}>
                      {c.label} <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </button>
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r["id"]}>
                  {props.columns.map((c) => (
                    <TableCell key={c.key} className="max-w-xs truncate">{c.render ? c.render(r) : display(c, r) || "—"}</TableCell>
                  ))}
                  <TableCell className="text-right whitespace-nowrap">
                    {props.rowActions?.(r)}
                    {props.fields.filter((f) => f.type === "file" && r[f.name]).map((f) => (
                      <Button key={f.name} size="icon" variant="ghost" aria-label="Open attachment" onClick={() => openFile(f.bucket ?? "media", r[f.name])}><Paperclip className="h-4 w-4" /></Button>
                    ))}
                    {props.canEdit?.(r) && <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => startEdit(r)}><Pencil className="h-4 w-4" /></Button>}
                    {props.canDelete && <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-muted-foreground">{rows.length} record{rows.length === 1 ? "" : "s"}</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} {props.singular.toLowerCase()}</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="grid gap-4 sm:grid-cols-2">
            {props.fields.map((f) => {
              const err = form.formState.errors[f.name]?.message as string | undefined;
              return (
                <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={f.name} className="mb-1.5 block">{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.name} rows={3} {...form.register(f.name)} />
                  ) : ["select", "employee", "department", "project"].includes(f.type) ? (
                    <Controller
                      control={form.control}
                      name={f.name}
                      render={({ field }) => {
                        const opts: { v: string; l: string }[] =
                          f.type === "select" ? (f.options ?? []).map((o) => ({ v: o, l: o }))
                          : f.type === "employee" ? maps.employees.filter((e) => !["Resigned", "Terminated"].includes(e.status)).map((e) => ({ v: e.id, l: `${e.full_name} (${e.employee_code})` }))
                          : f.type === "department" ? maps.departments.map((d) => ({ v: d.id, l: d.name }))
                          : maps.projects.map((p) => ({ v: p.id, l: p.name }));
                        return (
                          <Select value={field.value || "__none"} onValueChange={(v) => field.onChange(v === "__none" ? "" : v)}>
                            <SelectTrigger id={f.name}><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>
                              {!f.required && <SelectItem value="__none">— None —</SelectItem>}
                              {opts.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                  ) : f.type === "file" ? (
                    <div className="flex items-center gap-2">
                      <Input id={f.name} type="file" accept="image/*,application/pdf,.doc,.docx,.xlsx" onChange={(e) => e.target.files?.[0] && uploadFile(f, e.target.files[0])} />
                      {form.watch(f.name) && <span className="text-xs text-success">Attached</span>}
                    </div>
                  ) : (
                    <Input id={f.name} type={f.type} step={f.type === "number" ? "any" : undefined} {...form.register(f.name)} />
                  )}
                  {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
                </div>
              );
            })}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {props.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toDelete && del.mutate(toDelete)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
