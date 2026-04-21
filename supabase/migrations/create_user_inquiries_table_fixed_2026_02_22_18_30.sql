-- 创建用户咨询表（修复property_id类型）
CREATE TABLE IF NOT EXISTS public.user_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  property_id TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  inquiry_type VARCHAR(50) NOT NULL CHECK (inquiry_type IN ('contact_form', 'property_inquiry')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  preferred_language VARCHAR(10) DEFAULT 'zh',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_inquiries_user_id ON public.user_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_property_id ON public.user_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_inquiry_type ON public.user_inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_status ON public.user_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_created_at ON public.user_inquiries(created_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_inquiries_updated_at 
    BEFORE UPDATE ON public.user_inquiries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略
ALTER TABLE public.user_inquiries ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 用户可以查看自己的咨询记录
CREATE POLICY "Users can view own inquiries" ON public.user_inquiries
    FOR SELECT USING (auth.uid() = user_id);

-- 用户可以创建咨询记录（包括匿名用户）
CREATE POLICY "Users can create inquiries" ON public.user_inquiries
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

-- 用户可以更新自己的咨询记录
CREATE POLICY "Users can update own inquiries" ON public.user_inquiries
    FOR UPDATE USING (auth.uid() = user_id);

-- 添加表注释
COMMENT ON TABLE public.user_inquiries IS '用户咨询表，存储来自联系表单和房源详情页面的用户咨询信息';
COMMENT ON COLUMN public.user_inquiries.inquiry_type IS '咨询类型：contact_form(联系表单) 或 property_inquiry(房源咨询)';
COMMENT ON COLUMN public.user_inquiries.property_id IS '房源ID，仅在房源咨询时有值';
COMMENT ON COLUMN public.user_inquiries.status IS '处理状态：pending(待处理)、contacted(已联系)、closed(已关闭)';
COMMENT ON COLUMN public.user_inquiries.preferred_language IS '用户偏好语言：zh(中文) 或 en(英文)';