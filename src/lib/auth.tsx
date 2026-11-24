import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "hr_manager" | "department_manager" | "employee";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  hr_manager: "HR Manager",
  department_manager: "Department Manager",
  employee: "Employee",
};

interface AuthState {
  user: User | null;
  roles: AppRole[];
  employeeId: string | null;
  loading: boolean;
  isSuper: boolean;
  isAdmin: boolean;
  isHR: boolean;
  isManager: boolean;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(u: User | null) {
    setUser(u);
    if (!u) {
      setRoles([]);
      setEmployeeId(null);
      setLoading(false);
      return;
    }
    const [{ data: r }, { data: e }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", u.id),
      supabase.from("employees").select("id").eq("user_id", u.id).maybeSingle(),
    ]);
    setRoles((r ?? []).map((x) => x.role as AppRole));
    setEmployeeId(e?.id ?? null);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load(session?.user ?? null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const has = (list: AppRole[]) => roles.some((r) => list.includes(r));
  const value: AuthState = {
    user,
    roles,
    employeeId,
    loading,
    isSuper: has(["super_admin"]),
    isAdmin: has(["super_admin", "admin"]),
    isHR: has(["super_admin", "admin", "hr_manager"]),
    isManager: has(["super_admin", "admin", "hr_manager", "department_manager"]),
    refresh: async () => load((await supabase.auth.getUser()).data.user),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
