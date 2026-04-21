-- 确保收藏表存在并有正确的RLS策略
-- 检查表是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_favorites_2026_02_21_06_55') THEN
        -- 创建收藏表
        CREATE TABLE public.user_favorites_2026_02_21_06_55 (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            property_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, property_id)
        );
        
        -- 启用RLS
        ALTER TABLE public.user_favorites_2026_02_21_06_55 ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 删除现有策略并重新创建
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites_2026_02_21_06_55;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites_2026_02_21_06_55;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites_2026_02_21_06_55;

-- 创建RLS策略
CREATE POLICY "Users can view own favorites" 
ON public.user_favorites_2026_02_21_06_55 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" 
ON public.user_favorites_2026_02_21_06_55 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" 
ON public.user_favorites_2026_02_21_06_55 
FOR DELETE 
USING (auth.uid() = user_id);

-- 创建索引以提高性能
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites_2026_02_21_06_55(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON public.user_favorites_2026_02_21_06_55(property_id);