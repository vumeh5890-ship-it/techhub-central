
-- ROLES
create type public.app_role as enum ('super_admin','admin','hr_manager','department_manager','employee');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, email text, avatar_url text,
  notify_tasks boolean not null default true, notify_events boolean not null default true,
  notify_leave boolean not null default true, notify_announcements boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated; grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null, created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, update, delete on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.has_any_role(_user_id uuid, _roles app_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role = any(_roles)) $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select public.has_any_role(auth.uid(), array['super_admin','admin']::app_role[]) $$;
create or replace function public.is_hr() returns boolean language sql stable security definer set search_path=public as $$
  select public.has_any_role(auth.uid(), array['super_admin','admin','hr_manager']::app_role[]) $$;
create or replace function public.is_manager() returns boolean language sql stable security definer set search_path=public as $$
  select public.has_any_role(auth.uid(), array['super_admin','admin','hr_manager','department_manager']::app_role[]) $$;

create policy "own profile read or managers" on public.profiles for select to authenticated using (id = auth.uid() or public.is_manager());
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "roles read own or super" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "super manages roles insert" on public.user_roles for insert to authenticated with check (public.has_role(auth.uid(),'super_admin'));
create policy "super manages roles update" on public.user_roles for update to authenticated using (public.has_role(auth.uid(),'super_admin'));
create policy "super manages roles delete" on public.user_roles for delete to authenticated using (public.has_role(auth.uid(),'super_admin'));

-- COMPANY SETTINGS
create table public.company_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'Tech Hub', address text, phone text, email text, logo_url text,
  currency text not null default 'NGN', currency_symbol text not null default '₦',
  timezone text not null default 'Africa/Lagos',
  working_days text[] not null default array['Mon','Tue','Wed','Thu','Fri'],
  work_start time not null default '08:00', work_end time not null default '17:00',
  late_after time not null default '08:15',
  job_titles text[] not null default array[]::text[],
  updated_at timestamptz not null default now()
);
insert into public.company_settings (id) values (1);
grant select, update on public.company_settings to authenticated; grant all on public.company_settings to service_role;
alter table public.company_settings enable row level security;
create policy "settings read" on public.company_settings for select to authenticated using (true);
create policy "settings update" on public.company_settings for update to authenticated using (public.is_admin());

-- DEPARTMENTS
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, description text, manager_id uuid,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.departments to authenticated; grant all on public.departments to service_role;
alter table public.departments enable row level security;
create policy "dept read" on public.departments for select to authenticated using (true);
create policy "dept insert" on public.departments for insert to authenticated with check (public.is_admin());
create policy "dept update" on public.departments for update to authenticated using (public.is_admin());
create policy "dept delete" on public.departments for delete to authenticated using (public.is_admin());

-- EMPLOYEES
create sequence public.employee_code_seq;
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique default ('EMP-' || lpad(nextval('public.employee_code_seq')::text, 5, '0')),
  user_id uuid unique,
  full_name text not null, email text, phone text, address text, gender text,
  department_id uuid references public.departments(id) on delete set null,
  job_title text, employment_type text not null default 'Full-time',
  employment_date date not null default current_date,
  manager_id uuid references public.employees(id) on delete set null,
  status text not null default 'Active' check (status in ('Active','On probation','On leave','Suspended','Resigned','Terminated')),
  photo_url text, notes text,
  departure_date date, departure_reason text, departure_authorized_by text, exit_interview_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.employees (status); create index on public.employees (department_id); create index on public.employees (full_name);
alter table public.departments add constraint departments_manager_fk foreign key (manager_id) references public.employees(id) on delete set null;
grant select, insert, update on public.employees to authenticated; grant all on public.employees to service_role;
alter table public.employees enable row level security;
create or replace function public.my_employee_id() returns uuid language sql stable security definer set search_path=public as $$
  select id from public.employees where user_id = auth.uid() limit 1 $$;
create policy "emp read" on public.employees for select to authenticated using (true);
create policy "emp insert" on public.employees for insert to authenticated with check (public.is_hr());
create policy "emp update" on public.employees for update to authenticated using (public.is_hr());
-- no delete policy: employees are archived, never deleted

create table public.employee_sensitive (
  employee_id uuid primary key references public.employees(id) on delete cascade,
  salary numeric(14,2), salary_currency text default 'NGN',
  emergency_contact_name text, emergency_contact_phone text, emergency_contact_relation text,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.employee_sensitive to authenticated; grant all on public.employee_sensitive to service_role;
alter table public.employee_sensitive enable row level security;
create policy "sens read" on public.employee_sensitive for select to authenticated using (public.is_hr() or employee_id = public.my_employee_id());
create policy "sens insert" on public.employee_sensitive for insert to authenticated with check (public.is_hr());
create policy "sens update" on public.employee_sensitive for update to authenticated using (public.is_hr());

create table public.employment_history (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  event_type text not null, event_date date not null default current_date,
  position text, department_id uuid references public.departments(id) on delete set null,
  salary numeric(14,2), notes text, authorized_by uuid,
  created_at timestamptz not null default now()
);
create index on public.employment_history (employee_id);
grant select, insert on public.employment_history to authenticated; grant all on public.employment_history to service_role;
alter table public.employment_history enable row level security;
create policy "hist read" on public.employment_history for select to authenticated using (public.is_hr() or employee_id = public.my_employee_id());
create policy "hist insert" on public.employment_history for insert to authenticated with check (public.is_hr());

-- ATTENDANCE
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null default current_date, check_in timestamptz, check_out timestamptz,
  status text not null default 'Present' check (status in ('Present','Late','Absent','On leave','Half day')),
  notes text, corrected_by uuid, correction_reason text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (employee_id, date)
);
create index on public.attendance (date);
grant select, insert, update, delete on public.attendance to authenticated; grant all on public.attendance to service_role;
alter table public.attendance enable row level security;
create policy "att read" on public.attendance for select to authenticated using (public.is_manager() or employee_id = public.my_employee_id());
create policy "att insert" on public.attendance for insert to authenticated with check (public.is_manager() or (employee_id = public.my_employee_id() and date = current_date));
create policy "att update" on public.attendance for update to authenticated using (public.is_manager() or (employee_id = public.my_employee_id() and date = current_date));
create policy "att delete" on public.attendance for delete to authenticated using (public.is_admin());

-- LEAVE
create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type text not null check (leave_type in ('Annual','Sick','Personal','Emergency','Maternity','Paternity','Other')),
  start_date date not null, end_date date not null, reason text,
  status text not null default 'Pending' check (status in ('Pending','Approved','Rejected','Info requested','Cancelled')),
  decision_comment text, decided_by uuid, decided_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index on public.leave_requests (status);
grant select, insert, update on public.leave_requests to authenticated; grant all on public.leave_requests to service_role;
alter table public.leave_requests enable row level security;
create policy "leave read" on public.leave_requests for select to authenticated using (public.is_hr() or employee_id = public.my_employee_id());
create policy "leave insert" on public.leave_requests for insert to authenticated with check (public.is_hr() or (employee_id = public.my_employee_id() and status='Pending'));
create policy "leave update" on public.leave_requests for update to authenticated using (public.is_hr() or (employee_id = public.my_employee_id() and status in ('Pending','Info requested')));

-- DAILY ACTIVITIES
create table public.daily_activities (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, date date not null default current_date,
  start_time time, end_time time, location text,
  responsible_employee_id uuid references public.employees(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Critical')),
  status text not null default 'Planned' check (status in ('Planned','In Progress','Completed','Unfinished','Cancelled')),
  progress int not null default 0 check (progress between 0 and 100),
  completion_notes text, attachment_url text, created_by uuid default auth.uid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.daily_activities (date);
grant select, insert, update, delete on public.daily_activities to authenticated; grant all on public.daily_activities to service_role;
alter table public.daily_activities enable row level security;
create policy "act read" on public.daily_activities for select to authenticated using (true);
create policy "act insert" on public.daily_activities for insert to authenticated with check (public.is_manager());
create policy "act update" on public.daily_activities for update to authenticated using (public.is_manager() or responsible_employee_id = public.my_employee_id());
create policy "act delete" on public.daily_activities for delete to authenticated using (public.is_admin());

create table public.activity_assignments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.daily_activities(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  role text, unique(activity_id, employee_id)
);
grant select, insert, delete on public.activity_assignments to authenticated; grant all on public.activity_assignments to service_role;
alter table public.activity_assignments enable row level security;
create policy "aa read" on public.activity_assignments for select to authenticated using (true);
create policy "aa insert" on public.activity_assignments for insert to authenticated with check (public.is_manager());
create policy "aa delete" on public.activity_assignments for delete to authenticated using (public.is_manager());

-- PROJECTS & TASKS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null, description text,
  department_id uuid references public.departments(id) on delete set null,
  lead_id uuid references public.employees(id) on delete set null,
  start_date date, end_date date,
  status text not null default 'Active' check (status in ('Planning','Active','On Hold','Completed','Cancelled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated; grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "proj read" on public.projects for select to authenticated using (true);
create policy "proj insert" on public.projects for insert to authenticated with check (public.is_manager());
create policy "proj update" on public.projects for update to authenticated using (public.is_manager());
create policy "proj delete" on public.projects for delete to authenticated using (public.is_admin());

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null, description text,
  assignee_id uuid references public.employees(id) on delete set null,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Critical')),
  status text not null default 'To Do' check (status in ('To Do','In Progress','Under Review','Completed','On Hold','Cancelled')),
  due_date date, completed_at timestamptz, attachment_url text, created_by uuid default auth.uid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.tasks (status); create index on public.tasks (assignee_id); create index on public.tasks (due_date);
grant select, insert, update, delete on public.tasks to authenticated; grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "task read" on public.tasks for select to authenticated using (true);
create policy "task insert" on public.tasks for insert to authenticated with check (public.is_manager());
create policy "task update" on public.tasks for update to authenticated using (public.is_manager() or assignee_id = public.my_employee_id());
create policy "task delete" on public.tasks for delete to authenticated using (public.is_manager());

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null default auth.uid(), author_name text, body text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.task_comments to authenticated; grant all on public.task_comments to service_role;
alter table public.task_comments enable row level security;
create policy "tc read" on public.task_comments for select to authenticated using (true);
create policy "tc insert" on public.task_comments for insert to authenticated with check (author_id = auth.uid());
create policy "tc delete" on public.task_comments for delete to authenticated using (author_id = auth.uid() or public.is_admin());

-- EVENTS
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text,
  category text not null default 'Staff meeting',
  date date not null, start_time time, end_time time, venue text, organizer text,
  required_resources text,
  status text not null default 'Scheduled' check (status in ('Scheduled','Rescheduled','Completed','Cancelled')),
  notes text, created_by uuid default auth.uid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.events (date);
grant select, insert, update, delete on public.events to authenticated; grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "ev read" on public.events for select to authenticated using (true);
create policy "ev insert" on public.events for insert to authenticated with check (public.is_manager());
create policy "ev update" on public.events for update to authenticated using (public.is_manager());
create policy "ev delete" on public.events for delete to authenticated using (public.is_admin());

create table public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  unique(event_id, employee_id)
);
grant select, insert, delete on public.event_participants to authenticated; grant all on public.event_participants to service_role;
alter table public.event_participants enable row level security;
create policy "ep read" on public.event_participants for select to authenticated using (true);
create policy "ep insert" on public.event_participants for insert to authenticated with check (public.is_manager());
create policy "ep delete" on public.event_participants for delete to authenticated using (public.is_manager());

-- ANNOUNCEMENTS
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null, body text not null,
  category text not null default 'General' check (category in ('General','Important','Meeting','Policy','Event','Emergency')),
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.announcements to authenticated; grant all on public.announcements to service_role;
alter table public.announcements enable row level security;
create policy "ann read" on public.announcements for select to authenticated using (true);
create policy "ann insert" on public.announcements for insert to authenticated with check (public.is_admin());
create policy "ann update" on public.announcements for update to authenticated using (public.is_admin());
create policy "ann delete" on public.announcements for delete to authenticated using (public.is_admin());

create table public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null default auth.uid(), read_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);
grant select, insert on public.announcement_reads to authenticated; grant all on public.announcement_reads to service_role;
alter table public.announcement_reads enable row level security;
create policy "ar read" on public.announcement_reads for select to authenticated using (user_id = auth.uid());
create policy "ar insert" on public.announcement_reads for insert to authenticated with check (user_id = auth.uid());

-- NOTIFICATIONS
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, kind text not null default 'info', title text not null, body text, link text,
  read boolean not null default false, created_at timestamptz not null default now()
);
create index on public.notifications (user_id, read);
grant select, update, delete on public.notifications to authenticated; grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "notif read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notif update" on public.notifications for update to authenticated using (user_id = auth.uid());
create policy "notif delete" on public.notifications for delete to authenticated using (user_id = auth.uid());

-- FINANCE
create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  category text not null, amount numeric(14,2) not null check (amount > 0),
  date date not null default current_date, description text, source text,
  payment_method text, receipt_path text, created_by uuid default auth.uid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.financial_transactions (date); create index on public.financial_transactions (type);
grant select, insert, update, delete on public.financial_transactions to authenticated; grant all on public.financial_transactions to service_role;
alter table public.financial_transactions enable row level security;
create policy "fin read" on public.financial_transactions for select to authenticated using (public.is_admin());
create policy "fin insert" on public.financial_transactions for insert to authenticated with check (public.is_admin());
create policy "fin update" on public.financial_transactions for update to authenticated using (public.is_admin());
create policy "fin delete" on public.financial_transactions for delete to authenticated using (public.has_role(auth.uid(),'super_admin'));

-- ASSETS
create sequence public.asset_code_seq;
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  asset_code text not null unique default ('AST-' || lpad(nextval('public.asset_code_seq')::text, 5, '0')),
  name text not null, category text not null default 'Other', serial_number text,
  purchase_date date, purchase_price numeric(14,2), condition text default 'Good',
  assigned_employee_id uuid references public.employees(id) on delete set null,
  location text, warranty_until date, warranty_info text,
  status text not null default 'Available' check (status in ('Available','Assigned','Under Maintenance','Damaged','Retired')),
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.assets (status);
grant select, insert, update, delete on public.assets to authenticated; grant all on public.assets to service_role;
alter table public.assets enable row level security;
create policy "asset read" on public.assets for select to authenticated using (true);
create policy "asset insert" on public.assets for insert to authenticated with check (public.is_admin());
create policy "asset update" on public.assets for update to authenticated using (public.is_admin());
create policy "asset delete" on public.assets for delete to authenticated using (public.has_role(auth.uid(),'super_admin'));

create table public.asset_assignments (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  assigned_at timestamptz not null default now(), returned_at timestamptz, notes text
);
grant select, insert, update on public.asset_assignments to authenticated; grant all on public.asset_assignments to service_role;
alter table public.asset_assignments enable row level security;
create policy "asg read" on public.asset_assignments for select to authenticated using (true);
create policy "asg insert" on public.asset_assignments for insert to authenticated with check (public.is_admin());
create policy "asg update" on public.asset_assignments for update to authenticated using (public.is_admin());

create table public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  date date not null default current_date, description text not null, cost numeric(14,2), performed_by text,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.maintenance_records to authenticated; grant all on public.maintenance_records to service_role;
alter table public.maintenance_records enable row level security;
create policy "mr read" on public.maintenance_records for select to authenticated using (true);
create policy "mr insert" on public.maintenance_records for insert to authenticated with check (public.is_admin());
create policy "mr delete" on public.maintenance_records for delete to authenticated using (public.is_admin());

-- AUDIT
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, user_email text, action text not null, table_name text, record_id text,
  old_data jsonb, new_data jsonb, created_at timestamptz not null default now()
);
create index on public.audit_logs (created_at desc);
grant select, insert on public.audit_logs to authenticated; grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit read" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "audit insert login" on public.audit_logs for insert to authenticated with check (user_id = auth.uid() and action = 'login');

create or replace function public.audit_trigger() returns trigger language plpgsql security definer set search_path=public as $$
declare v_email text;
begin
  select email into v_email from auth.users where id = auth.uid();
  insert into public.audit_logs(user_id, user_email, action, table_name, record_id, old_data, new_data)
  values (auth.uid(), v_email, lower(tg_op), tg_table_name,
    coalesce((case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end)->>'id',
             (case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end)->>'employee_id'),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end);
  return coalesce(new, old);
end $$;
do $$ declare t text; begin
  foreach t in array array['employees','employee_sensitive','financial_transactions','events','user_roles','attendance','leave_requests','departments','assets','company_settings','announcements'] loop
    execute format('create trigger audit_%1$s after insert or update or delete on public.%1$s for each row execute function public.audit_trigger()', t);
  end loop; end $$;

-- updated_at
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end $$;
do $$ declare t text; begin
  foreach t in array array['profiles','departments','employees','employee_sensitive','attendance','leave_requests','daily_activities','projects','tasks','events','financial_transactions','assets','company_settings'] loop
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop; end $$;

-- Employment history automation
create or replace function public.employee_history_trigger() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.employment_history(employee_id, event_type, event_date, position, department_id, authorized_by, notes)
    values (new.id, 'Hired', new.employment_date, new.job_title, new.department_id, auth.uid(), 'Employment started');
  else
    if new.job_title is distinct from old.job_title then
      insert into public.employment_history(employee_id, event_type, position, department_id, authorized_by, notes)
      values (new.id, 'Position change', new.job_title, new.department_id, auth.uid(), 'From ' || coalesce(old.job_title,'—'));
    end if;
    if new.department_id is distinct from old.department_id then
      insert into public.employment_history(employee_id, event_type, position, department_id, authorized_by, notes)
      values (new.id, 'Department transfer', new.job_title, new.department_id, auth.uid(), 'Transferred');
    end if;
    if new.status is distinct from old.status then
      insert into public.employment_history(employee_id, event_type, event_date, position, department_id, authorized_by, notes)
      values (new.id, 'Status: ' || new.status, coalesce(case when new.status in ('Resigned','Terminated') then new.departure_date end, current_date),
              new.job_title, new.department_id, auth.uid(), coalesce(new.departure_reason, 'Status changed from ' || old.status));
    end if;
  end if;
  return new;
end $$;
create trigger employee_history after insert or update on public.employees for each row execute function public.employee_history_trigger();

create or replace function public.salary_history_trigger() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if (tg_op='INSERT' and new.salary is not null) or (tg_op='UPDATE' and new.salary is distinct from old.salary) then
    insert into public.employment_history(employee_id, event_type, salary, authorized_by, notes)
    values (new.employee_id, 'Salary change', new.salary, auth.uid(), 'Salary set');
  end if;
  return new;
end $$;
create trigger salary_history after insert or update on public.employee_sensitive for each row execute function public.salary_history_trigger();

-- Notifications
create or replace function public.notify_user(_user uuid, _kind text, _title text, _body text, _link text) returns void
language plpgsql security definer set search_path=public as $$
begin if _user is not null then insert into public.notifications(user_id, kind, title, body, link) values (_user,_kind,_title,_body,_link); end if; end $$;

create or replace function public.task_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare u uuid;
begin
  if new.assignee_id is not null and (tg_op='INSERT' or new.assignee_id is distinct from old.assignee_id) then
    select user_id into u from public.employees where id = new.assignee_id;
    perform public.notify_user(u, 'task', 'New task assigned', new.title, '/tasks');
  end if;
  if tg_op='UPDATE' and new.status='Completed' and old.status <> 'Completed' then new.completed_at = now(); end if;
  return new;
end $$;
create trigger task_notify before insert or update on public.tasks for each row execute function public.task_notify();

create or replace function public.leave_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare u uuid; r record;
begin
  if tg_op='INSERT' then
    for r in select distinct user_id from public.user_roles where role in ('super_admin','admin','hr_manager') loop
      perform public.notify_user(r.user_id, 'leave', 'New leave request', new.leave_type || ' leave ' || new.start_date || ' → ' || new.end_date, '/leave');
    end loop;
  elsif new.status is distinct from old.status and new.status in ('Approved','Rejected','Info requested') then
    select user_id into u from public.employees where id = new.employee_id;
    perform public.notify_user(u, 'leave', 'Leave request ' || lower(new.status), coalesce(new.decision_comment,''), '/leave');
  end if;
  return new;
end $$;
create trigger leave_notify after insert or update on public.leave_requests for each row execute function public.leave_notify();

create or replace function public.announcement_notify() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.notifications(user_id, kind, title, body, link)
  select p.id, 'announcement', 'Announcement: ' || new.title, left(new.body, 140), '/announcements'
  from public.profiles p where p.notify_announcements;
  return new;
end $$;
create trigger announcement_notify after insert on public.announcements for each row execute function public.announcement_notify();

create or replace function public.event_participant_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare u uuid; e record;
begin
  select user_id into u from public.employees where id = new.employee_id;
  select title, date into e from public.events where id = new.event_id;
  perform public.notify_user(u, 'event', 'You were added to an event', e.title || ' on ' || e.date, '/events');
  return new;
end $$;
create trigger event_participant_notify after insert on public.event_participants for each row execute function public.event_participant_notify();

-- New user bootstrap: first user is super admin, others employees; link employee by email
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name, email) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email);
  if not exists (select 1 from public.user_roles where role='super_admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'super_admin');
  else
    insert into public.user_roles(user_id, role) values (new.id, 'employee');
  end if;
  update public.employees set user_id = new.id where user_id is null and lower(email) = lower(new.email);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- link on employee creation if account already exists
create or replace function public.employee_link_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.user_id is null and new.email is not null then
    select id into new.user_id from auth.users where lower(email)=lower(new.email) limit 1;
  end if;
  return new;
end $$;
create trigger employee_link_user before insert or update of email on public.employees for each row execute function public.employee_link_user();

-- Upcoming reminders (called by client, idempotent per day)
create or replace function public.generate_my_reminders() returns void language plpgsql security definer set search_path=public as $$
declare me uuid := public.my_employee_id(); r record;
begin
  if auth.uid() is null then return; end if;
  for r in select e.id, e.title, e.date from public.events e join public.event_participants p on p.event_id=e.id
    where p.employee_id = me and e.status <> 'Cancelled' and e.date between current_date and current_date + 1 loop
    if not exists (select 1 from public.notifications where user_id=auth.uid() and kind='reminder' and link='/events#'||r.id and created_at::date = current_date) then
      perform public.notify_user(auth.uid(), 'reminder', 'Upcoming event: ' || r.title, 'On ' || r.date, '/events#'||r.id);
    end if;
  end loop;
  for r in select t.id, t.title, t.due_date from public.tasks t where t.assignee_id = me and t.status not in ('Completed','Cancelled') and t.due_date <= current_date + 1 loop
    if not exists (select 1 from public.notifications where user_id=auth.uid() and kind='reminder' and link='/tasks#'||r.id and created_at::date = current_date) then
      perform public.notify_user(auth.uid(), 'reminder', case when r.due_date < current_date then 'Overdue task: ' else 'Task due soon: ' end || r.title, 'Due ' || r.due_date, '/tasks#'||r.id);
    end if;
  end loop;
end $$;
grant execute on function public.generate_my_reminders() to authenticated;

-- Admin: list users with roles
create or replace function public.list_users_with_roles() returns table(user_id uuid, email text, full_name text, roles app_role[])
language sql stable security definer set search_path=public as $$
  select p.id, p.email, p.full_name, coalesce(array_agg(r.role) filter (where r.role is not null), '{}')
  from public.profiles p left join public.user_roles r on r.user_id = p.id
  where public.is_admin() group by p.id, p.email, p.full_name order by p.email $$;
grant execute on function public.list_users_with_roles() to authenticated;
