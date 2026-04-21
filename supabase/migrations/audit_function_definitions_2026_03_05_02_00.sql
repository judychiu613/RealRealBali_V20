select pg_get_functiondef(p.oid)
from pg_proc p
join pg_namespace n on p.pronamespace = n.oid
where n.nspname = 'public';