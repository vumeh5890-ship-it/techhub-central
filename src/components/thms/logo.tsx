export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-[11px] font-bold tracking-tight text-sidebar-primary-foreground shadow-sm" style={{ fontFamily: "var(--font-display)" }}>
        THMS
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Tech Hub</p>
          <p className="text-[11px] opacity-70">Management System</p>
        </div>
      )}
    </div>
  );
}
