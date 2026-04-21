insert into public.user_profiles (
  id,
  email
)
values (
  gen_random_uuid(),
  'audit-test@example.com'
);