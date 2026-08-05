create or replace function public.hook_restrict_signup_to_algorims(event jsonb)
returns jsonb
language plpgsql
stable
as $$
begin
  if lower(split_part(event->'user'->>'email', '@', 2)) = 'algorims.com' then
    return '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Only algorims.com email addresses are allowed.'
    )
  );
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_restrict_signup_to_algorims to supabase_auth_admin;
revoke execute on function public.hook_restrict_signup_to_algorims from authenticated, anon, public;
