create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (public.my_employee_id() is not null or public.is_manager())
$$;

alter policy "asg read" on public.asset_assignments using (public.is_staff());
alter policy "proj read" on public.projects using (public.is_staff());
alter policy "tc read" on public.task_comments using (public.is_staff());
alter policy "ep read" on public.event_participants using (public.is_staff());
alter policy "task read" on public.tasks using (public.is_staff());
alter policy "act read" on public.daily_activities using (public.is_staff());
alter policy "asset read" on public.assets using (public.is_staff());
alter policy "aa read" on public.activity_assignments using (public.is_staff());
alter policy "emp read" on public.employees using (public.is_staff() or user_id = auth.uid());
alter policy "ann read" on public.announcements using (public.is_staff());
alter policy "ev read" on public.events using (public.is_staff());
alter policy "settings read" on public.company_settings using (public.is_staff());
alter policy "dept read" on public.departments using (public.is_staff());
alter policy "mr read" on public.maintenance_records using (public.is_staff());

alter policy "media read" on storage.objects using (bucket_id = 'media' and (owner = auth.uid() or public.is_manager()));