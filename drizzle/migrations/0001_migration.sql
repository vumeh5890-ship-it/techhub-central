
create policy "receipts admin read" on storage.objects for select to authenticated using (bucket_id='receipts' and public.is_admin());
create policy "receipts admin write" on storage.objects for insert to authenticated with check (bucket_id='receipts' and public.is_admin());
create policy "receipts admin delete" on storage.objects for delete to authenticated using (bucket_id='receipts' and public.is_admin());
create policy "media read" on storage.objects for select to authenticated using (bucket_id='media');
create policy "media write" on storage.objects for insert to authenticated with check (bucket_id='media' and owner = auth.uid());
create policy "media delete" on storage.objects for delete to authenticated using (bucket_id='media' and (owner = auth.uid() or public.is_admin()));
