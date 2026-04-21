select
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
from information_schema.table_constraints tc
left join information_schema.key_column_usage kcu
on tc.constraint_name = kcu.constraint_name
where tc.table_schema = 'public'
and tc.table_name = 'user_profiles';