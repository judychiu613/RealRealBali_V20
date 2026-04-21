-- 用户浏览追踪系统功能总结
-- 日期: 2026-02-22 20:15
-- 功能: 完整的用户浏览行为追踪和分析系统

-- ========== 数据库结构 ==========

-- 1. user_views 表结构验证
SELECT 
  '数据表结构' as category,
  column_name as 字段名,
  data_type as 数据类型,
  is_nullable as 可为空,
  column_default as 默认值
FROM information_schema.columns 
WHERE table_name = 'user_views' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 索引验证
SELECT 
  '数据库索引' as category,
  indexname as 索引名称,
  indexdef as 索引定义
FROM pg_indexes 
WHERE tablename = 'user_views' 
AND schemaname = 'public';

-- ========== 追踪功能说明 ==========

-- 3. 追踪的数据类型
/*
✅ 用户身份追踪：
- user_id: 注册用户的UUID（可为空）
- session_id: 会话ID，用于追踪非注册用户

✅ 浏览内容追踪：
- property_id: 房源ID
- page_type: 页面类型（listing/detail）

✅ 用户环境信息：
- user_agent: 浏览器信息
- ip_address: IP地址
- referrer: 来源页面
- country/city: 地理位置（可选）

✅ 浏览行为数据：
- view_duration: 浏览时长（秒）
- scroll_depth: 滚动深度百分比
- created_at/updated_at: 时间戳

✅ 安全和隐私：
- RLS策略保护用户数据
- 用户只能查看自己的浏览记录
- 支持匿名用户追踪
*/

-- ========== 前端集成 ==========

-- 4. 前端追踪组件
/*
✅ useViewTracking Hook:
- 完整的浏览追踪功能
- 支持滚动深度和浏览时长追踪
- 自动处理页面离开和可见性变化
- 定期更新浏览数据（30秒间隔）

✅ useSimpleViewTracking Hook:
- 简化版本，适用于列表页面
- 减少性能开销

✅ 集成位置：
- PropertyCard: 房源卡片浏览追踪
- PropertyDetail: 详细页面浏览追踪
- 自动会话ID生成和管理
*/

-- ========== 统计分析功能 ==========

-- 5. 数据库分析函数
/*
✅ get_view_analytics_overview():
- 总体浏览统计概览
- 支持时间范围筛选
- 返回JSON格式的统计数据

✅ get_property_view_details():
- 单个房源的详细浏览统计
- 包含每日浏览趋势
- 用户类型分析

✅ get_user_view_history():
- 用户浏览历史记录
- 支持注册用户和会话追踪
*/

-- 6. 统计视图
/*
✅ popular_properties_view:
- 热门房源排行榜
- 包含7天和30天浏览数据

✅ user_activity_view:
- 用户活跃度统计
- 区分注册用户和匿名用户
*/

-- ========== Edge Function API ==========

-- 7. view_analytics_2026_02_22_20_15 API端点
/*
✅ 支持的操作类型：
- overview: 总体统计概览
- property_stats: 房源浏览统计
- user_behavior: 用户行为分析
- daily_stats: 每日浏览统计
- popular_properties: 热门房源排行
- user_segments: 用户分群分析

✅ 查询参数：
- action: 操作类型
- property_id: 房源ID（可选）
- start_date/end_date: 时间范围
- limit: 结果数量限制

✅ 返回格式：
- JSON格式的统计数据
- 包含成功状态和时间戳
- 错误处理和CORS支持
*/

-- ========== 示例查询 ==========

-- 8. 测试浏览统计功能
-- 总体统计
SELECT get_view_analytics_overview();

-- 热门房源（当前数据为空，需要实际浏览后才有数据）
SELECT * FROM popular_properties_view LIMIT 10;

-- 用户活跃度（当前数据为空）
SELECT * FROM user_activity_view LIMIT 10;

-- 验证表是否创建成功
SELECT 
  '表创建验证' as category,
  COUNT(*) as 当前记录数,
  MAX(created_at) as 最新记录时间
FROM public.user_views;

-- ========== 使用说明 ==========

-- 9. 如何使用浏览追踪系统
/*
✅ 自动追踪：
- 用户访问房源列表页面时自动记录
- 用户查看房源详情页面时记录详细行为
- 支持注册用户和匿名用户

✅ 数据查看：
- 管理员可以通过Edge Function API查看统计数据
- 支持多种维度的数据分析
- 实时更新的浏览行为数据

✅ 隐私保护：
- 匿名用户使用会话ID追踪
- 注册用户数据受RLS策略保护
- 不收集敏感个人信息

✅ 性能优化：
- 异步数据记录，不影响页面加载
- 批量更新减少数据库压力
- 智能的更新频率控制
*/

-- 10. 后续扩展建议
/*
✅ 可以添加的功能：
- 地理位置信息（基于IP）
- 设备类型识别（移动端/桌面端）
- 搜索关键词追踪
- 转化漏斗分析
- 用户路径分析
- A/B测试支持
*/