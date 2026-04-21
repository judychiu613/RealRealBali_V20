-- 检查user_favorites_map表是否存在
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'user_favorites_map' 
AND table_schema = 'public';

-- 如果表不存在，创建它
CREATE TABLE IF NOT EXISTS public.user_favorites_map (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保同一用户不能重复收藏同一房源
  UNIQUE(user_id, property_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites_map(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON public.user_favorites_map(property_id);

-- 启用RLS
ALTER TABLE public.user_favorites_map ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：用户只能管理自己的收藏
CREATE POLICY IF NOT EXISTS "Users can manage own favorites" ON public.user_favorites_map
  FOR ALL USING (auth.uid() = user_id);

-- 验证表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_favorites_map' 
AND table_schema = 'public'
ORDER BY ordinal_position;