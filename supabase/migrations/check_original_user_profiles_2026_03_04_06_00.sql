-- 1. 检查原有的user_profiles_2026_02_21_06_55表是否存在及其结构
SELECT 
    'Original table check' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE '%user_profiles%'
ORDER BY table_name;

-- 2. 如果原表存在，查看其结构
SELECT 
    'Original table structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles_2026_02_21_06_55' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. 查看原表的数据
SELECT 
    'Original table data' as info,
    COUNT(*) as total_records
FROM user_profiles_2026_02_21_06_55;

-- 4. 查看原表的前几条数据样本
SELECT 
    'Sample data' as info,
    id,
    email,
    full_name,
    preferred_language,
    preferred_currency,
    country_code,
    phone_number,
    created_at
FROM user_profiles_2026_02_21_06_55 
LIMIT 3;