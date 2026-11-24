import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEmployees() {
  return useQuery({
    queryKey: ["lookup", "employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("id, full_name, employee_code, status, department_id, job_title, user_id")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
}
export function useDepartments() {
  return useQuery({
    queryKey: ["lookup", "departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });
}
export function useProjects() {
  return useQuery({
    queryKey: ["lookup", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("id, name, status").order("name");
      if (error) throw error;
      return data;
    },
  });
}
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    },
  });
}
export function useLookupMaps() {
  const e = useEmployees();
  const d = useDepartments();
  const p = useProjects();
  const emp = new Map((e.data ?? []).map((x) => [x.id, x.full_name]));
  const dept = new Map((d.data ?? []).map((x) => [x.id, x.name]));
  const proj = new Map((p.data ?? []).map((x) => [x.id, x.name]));
  return { emp, dept, proj, employees: e.data ?? [], departments: d.data ?? [], projects: p.data ?? [] };
}
