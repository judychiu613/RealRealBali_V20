-- 测试收藏功能的数据库操作

-- 1. 验证user_favorites_map表是否正确创建
SELECT 
  '表结构验证' as category,
  column_name as 字段名,
  data_type as 数据类型,
  is_nullable as 可为空,
  column_default as 默认值
FROM information_schema.columns 
WHERE table_name = 'user_favorites_map' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 检查RLS策略
SELECT 
  '安全策略' as category,
  policyname as 策略名称,
  permissive as 权限类型,
  roles as 适用角色,
  cmd as 命令类型,
  qual as 条件
FROM pg_policies 
WHERE tablename = 'user_favorites_map';

-- 3. 检查索引
SELECT 
  '索引检查' as category,
  indexname as 索引名称,
  indexdef as 索引定义
FROM pg_indexes 
WHERE tablename = 'user_favorites_map' 
AND schemaname = 'public';

-- 4. 测试插入操作（模拟收藏）
-- 注意：这个测试需要有真实的用户ID，所以可能会失败，这是正常的
-- INSERT INTO public.user_favorites_map (user_id, property_id) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test_property_1');

-- 5. 查看当前收藏数据
SELECT 
  '当前收藏数据' as category,
  COUNT(*) as 收藏总数,
  COUNT(DISTINCT user_id) as 收藏用户数,
  COUNT(DISTINCT property_id) as 被收藏房源数
FROM public.user_favorites_map;

-- 6. 检查是否有重复收藏的约束
SELECT 
  '唯一约束检查' as category,
  conname as 约束名称,
  contype as 约束类型,
  pg_get_constraintdef(oid) as 约束定义
FROM pg_constraint 
WHERE conrelid = 'public.user_favorites_map'::regclass;

-- 7. 验证外键关系
SELECT 
  '外键关系' as category,
  tc.constraint_name as 约束名称,
  tc.table_name as 表名,
  kcu.column_name as 列名,
  ccu.table_name as 引用表,
  ccu.column_name as 引用列
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'user_favorites_map';