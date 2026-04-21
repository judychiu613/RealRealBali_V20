-- 创建用户浏览追踪表
CREATE TABLE IF NOT EXISTS public.user_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 用户信息
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 注册用户ID，可为空（非注册用户）
  session_id TEXT NOT NULL, -- 会话ID，用于追踪非注册用户
  
  -- 浏览内容
  property_id TEXT NOT NULL, -- 房源ID
  page_type TEXT NOT NULL DEFAULT 'listing', -- 页面类型：listing(列表页), detail(详情页)
  
  -- 用户设备和环境信息
  user_agent TEXT, -- 用户代理字符串
  ip_address INET, -- IP地址
  referrer TEXT, -- 来源页面
  
  -- 地理位置信息（可选）
  country TEXT, -- 国家
  city TEXT, -- 城市
  
  -- 浏览行为数据
  view_duration INTEGER DEFAULT 0, -- 浏览时长（秒）
  scroll_depth DECIMAL(5,2) DEFAULT 0, -- 滚动深度百分比
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_views_user_id ON public.user_views(user_id);
CREATE INDEX IF NOT EXISTS idx_user_views_session_id ON public.user_views(session_id);
CREATE INDEX IF NOT EXISTS idx_user_views_property_id ON public.user_views(property_id);
CREATE INDEX IF NOT EXISTS idx_user_views_created_at ON public.user_views(created_at);
CREATE INDEX IF NOT EXISTS idx_user_views_page_type ON public.user_views(page_type);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_user_views_user_property ON public.user_views(user_id, property_id);
CREATE INDEX IF NOT EXISTS idx_user_views_session_property ON public.user_views(session_id, property_id);

-- 启用行级安全策略
ALTER TABLE public.user_views ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：允许所有人插入浏览记录
CREATE POLICY "Allow insert user views" ON public.user_views
  FOR INSERT WITH CHECK (true);

-- 创建RLS策略：用户只能查看自己的浏览记录
CREATE POLICY "Users can view own records" ON public.user_views
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
  );

-- 创建RLS策略：允许更新浏览时长等信息
CREATE POLICY "Allow update user views" ON public.user_views
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
  );

-- 创建触发器函数：自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_user_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_user_views_updated_at ON public.user_views;
CREATE TRIGGER trigger_update_user_views_updated_at
  BEFORE UPDATE ON public.user_views
  FOR EACH ROW
  EXECUTE FUNCTION update_user_views_updated_at();

-- 验证表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_views' 
AND table_schema = 'public'
ORDER BY ordinal_position;