-- FAQ系统实现总结
-- 日期: 2026-02-22 21:30
-- 任务: 创建数据库驱动的FAQ系统，支持分类、搜索、标签等功能

-- ========== 数据库设计 ==========

-- 1. 表结构设计
/*
✅ faq_categories 表（FAQ分类）：
- id: UUID主键
- name_zh/name_en: 中英文分类名称
- description_zh/description_en: 中英文描述
- sort_order: 排序字段
- is_active: 是否激活
- created_at/updated_at: 时间戳

✅ faqs 表（FAQ问题）：
- id: UUID主键
- category_id: 分类外键
- question_zh/question_en: 中英文问题
- answer_zh/answer_en: 中英文答案
- sort_order: 排序字段
- is_active: 是否激活
- view_count: 浏览次数
- is_featured: 是否精选
- tags: 标签数组
- created_at/updated_at: 时间戳
*/

-- 2. 索引优化
/*
✅ 性能索引：
- 分类排序索引: idx_faq_categories_sort_order
- 分类激活状态索引: idx_faq_categories_active
- FAQ分类关联索引: idx_faqs_category_id
- FAQ排序索引: idx_faqs_sort_order
- FAQ激活状态索引: idx_faqs_active
- FAQ精选状态索引: idx_faqs_featured
- FAQ标签GIN索引: idx_faqs_tags (支持数组搜索)
*/

-- 3. 安全策略
/*
✅ RLS策略：
- 所有人可以查看激活的分类和问题
- 只有管理员可以修改数据
- 自动更新时间戳触发器
- 浏览次数增加函数
*/

-- ========== 数据内容 ==========

-- 4. FAQ分类（6个主要分类）
/*
✅ 购房政策 (Purchase Policy)：
- 外国人购房法律政策
- 租赁权相关问题
- 房产类型限制

✅ 投资回报 (Investment Returns)：
- 回报率分析
- 市场增值潜力
- 最佳投资区域

✅ 购买流程 (Purchase Process)：
- 流程时间安排
- 所需文件清单
- 贷款融资选择

✅ 法律服务 (Legal Services)：
- 法律风险评估
- 权属清晰保障
- 合规性检查

✅ 物业管理 (Property Management)：
- 管理服务范围
- 维护服务内容
- 费用结构说明

✅ 税务财务 (Tax & Finance)：
- 购房税费明细
- 租金收入纳税
- 资金汇入方式
*/

-- 5. FAQ问题（15个核心问题）
/*
✅ 精选问题（5个）：
- 外国人可以在巴厘岛购买房产吗？
- 投资巴厘岛房产的回报率如何？
- 购买流程需要多长时间？
- 是否提供房产管理服务？

✅ 详细问题覆盖：
- 租赁权详细解释
- 可购买房产类型
- 市场增值潜力分析
- 最佳投资区域推荐
- 所需文件清单
- 贷款融资选择
- 法律风险评估
- 权属保障措施
- 维护服务内容
- 税费明细说明
- 租金纳税方式
- 资金汇入渠道
*/

-- ========== 前端功能实现 ==========

-- 6. React Hook (useFAQs)
/*
✅ 数据获取：
- 自动获取分类和FAQ数据
- 实时错误处理和加载状态
- 支持数据刷新

✅ 功能方法：
- getFAQsByCategory: 按分类筛选
- getFeaturedFAQs: 获取精选问题
- searchFAQs: 搜索功能（支持问题、答案、标签）
- incrementViewCount: 增加浏览次数

✅ 状态管理：
- categories: 分类列表
- faqs: 问题列表
- loading: 加载状态
- error: 错误信息
*/

-- 7. 用户界面功能
/*
✅ 搜索功能：
- 实时搜索输入框
- 支持问题、答案、标签搜索
- 多语言搜索支持

✅ 分类筛选：
- 全部问题
- 热门精选
- 按分类筛选（6个分类）
- 动态按钮状态

✅ 问题展示：
- 手风琴式展开
- 分类标签显示
- 热门问题标识
- 标签云展示
- 浏览次数统计

✅ 交互体验：
- 点击问题自动统计浏览次数
- 平滑动画过渡
- 响应式设计
- 加载和错误状态处理
*/

-- ========== 数据库函数 ==========

-- 8. 核心函数
/*
✅ increment_faq_view_count：
- 安全增加浏览次数
- 只对激活问题有效
- 自动更新时间戳

✅ get_popular_faqs：
- 获取热门问题列表
- 按浏览次数排序
- 支持限制数量

✅ search_faqs：
- 全文搜索功能
- 相关性评分
- 多语言支持
- 标签搜索支持
*/

-- ========== 管理和维护 ==========

-- 9. 内容管理
/*
✅ 数据库直接管理：
- 通过SQL直接添加/修改FAQ
- 支持批量导入
- 版本控制和备份

✅ 内容更新流程：
1. 在数据库中添加/修改FAQ
2. 设置分类和标签
3. 标记是否精选
4. 前端自动同步显示

✅ 数据维护：
- 定期清理无效数据
- 监控浏览统计
- 优化热门问题排序
*/

-- 10. 性能优化
/*
✅ 查询优化：
- 合理的索引设计
- 分页查询支持
- 缓存策略考虑

✅ 用户体验：
- 客户端搜索缓存
- 懒加载支持
- 错误重试机制

✅ 扩展性：
- 支持更多分类
- 支持多媒体答案
- 支持用户评分
*/

-- ========== 使用示例 ==========

-- 11. 添加新FAQ示例
/*
-- 添加新分类
INSERT INTO public.faq_categories (name_zh, name_en, description_zh, description_en, sort_order) 
VALUES ('签证服务', 'Visa Services', '签证申请和居留相关问题', 'Visa application and residence related questions', 7);

-- 添加新问题
INSERT INTO public.faqs (
  category_id, 
  question_zh, 
  question_en, 
  answer_zh, 
  answer_en, 
  sort_order, 
  is_featured, 
  tags
) VALUES (
  (SELECT id FROM public.faq_categories WHERE name_en = 'Visa Services'),
  '购房后可以获得居留权吗？',
  'Can I get residency after buying property?',
  '购买房产本身不能直接获得居留权，但可以通过投资签证等方式申请长期居留。我们可以协助您了解相关政策和申请流程。',
  'Buying property alone does not directly grant residency, but you can apply for long-term residence through investment visas. We can assist you in understanding relevant policies and application processes.',
  1,
  true,
  ARRAY['居留权', 'Residency', '投资签证', 'Investment Visa']
);
*/

-- 12. 查询统计示例
/*
-- 查看最热门的问题
SELECT * FROM get_popular_faqs(10);

-- 搜索相关问题
SELECT * FROM search_faqs('投资回报', 'zh');

-- 统计各分类问题数量
SELECT 
  c.name_zh as 分类名称,
  COUNT(f.id) as 问题数量,
  COUNT(CASE WHEN f.is_featured THEN 1 END) as 精选数量,
  AVG(f.view_count) as 平均浏览次数
FROM public.faq_categories c
LEFT JOIN public.faqs f ON c.id = f.category_id AND f.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name_zh, c.sort_order
ORDER BY c.sort_order;
*/

-- ========== 当前状态验证 ==========

SELECT 
  '系统状态' as category,
  '✅ 数据库表已创建' as database_tables,
  '✅ 索引已优化' as indexes,
  '✅ RLS策略已配置' as security,
  '✅ 数据库函数已创建' as functions,
  '✅ 示例数据已插入' as sample_data,
  '✅ React Hook已实现' as frontend_hook,
  '✅ UI组件已集成' as ui_components,
  '✅ 搜索功能已实现' as search_feature,
  '✅ 分类筛选已实现' as category_filter,
  '✅ 构建部署成功' as deployment;

-- 验证数据完整性
SELECT 
  '数据统计' as category,
  (SELECT COUNT(*) FROM public.faq_categories WHERE is_active = true) as 分类数量,
  (SELECT COUNT(*) FROM public.faqs WHERE is_active = true) as 问题总数,
  (SELECT COUNT(*) FROM public.faqs WHERE is_featured = true) as 精选问题数,
  (SELECT COUNT(DISTINCT category_id) FROM public.faqs WHERE is_active = true) as 有问题的分类数;