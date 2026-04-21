select
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
from information_schema.triggers
where event_object_table = 'users';