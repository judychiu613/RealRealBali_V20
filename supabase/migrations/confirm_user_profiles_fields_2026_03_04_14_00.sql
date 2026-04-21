-- 确认user_profiles表中是否包含指定的字段名称
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('full_name', 'country_code', 'phone_number', 'preferred_language', 'preferred_currency')
ORDER BY column_name;