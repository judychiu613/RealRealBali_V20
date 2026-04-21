-- 为用户资料表添加电话号码相关字段
ALTER TABLE public.user_profiles_2026_02_21_06_55 
ADD COLUMN country_code VARCHAR(10),
ADD COLUMN phone_number VARCHAR(20);

-- 添加注释
COMMENT ON COLUMN public.user_profiles_2026_02_21_06_55.country_code IS '国家区号，如+86, +62等';
COMMENT ON COLUMN public.user_profiles_2026_02_21_06_55.phone_number IS '电话号码（不含国家区号）';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON public.user_profiles_2026_02_21_06_55(country_code, phone_number);

-- 验证表结构
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles_2026_02_21_06_55' 
AND table_schema = 'public'
ORDER BY ordinal_position;