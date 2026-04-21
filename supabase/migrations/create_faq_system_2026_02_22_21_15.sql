-- 创建FAQ常见问题数据库表
-- 日期: 2026-02-22 21:15

-- 1. 创建FAQ分类表
CREATE TABLE IF NOT EXISTS public.faq_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建FAQ问题表
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.faq_categories(id) ON DELETE CASCADE,
  question_zh TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_zh TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[], -- 标签数组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_faq_categories_sort_order ON public.faq_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_categories_active ON public.faq_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON public.faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON public.faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_featured ON public.faqs(is_featured);
CREATE INDEX IF NOT EXISTS idx_faqs_tags ON public.faqs USING GIN(tags);

-- 4. 启用RLS
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 5. 创建RLS策略 - 所有人可以查看，只有管理员可以修改
CREATE POLICY "Anyone can view faq categories" ON public.faq_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

-- 6. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 创建触发器
CREATE TRIGGER update_faq_categories_updated_at 
  BEFORE UPDATE ON public.faq_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
  BEFORE UPDATE ON public.faqs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. 插入FAQ分类数据
INSERT INTO public.faq_categories (name_zh, name_en, description_zh, description_en, sort_order) VALUES
('购房政策', 'Purchase Policy', '关于外国人在巴厘岛购房的法律政策', 'Legal policies for foreigners buying property in Bali', 1),
('投资回报', 'Investment Returns', '房产投资收益和回报相关问题', 'Property investment income and return related questions', 2),
('购买流程', 'Purchase Process', '房产购买的具体流程和步骤', 'Specific procedures and steps for property purchase', 3),
('法律服务', 'Legal Services', '法律咨询和合规相关问题', 'Legal consultation and compliance related questions', 4),
('物业管理', 'Property Management', '房产管理和维护相关服务', 'Property management and maintenance related services', 5),
('税务财务', 'Tax & Finance', '税务、财务和资金相关问题', 'Tax, finance and funding related questions', 6);

-- 9. 插入FAQ问题数据
INSERT INTO public.faqs (category_id, question_zh, question_en, answer_zh, answer_en, sort_order, is_featured, tags) VALUES

-- 购房政策类
((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Policy'), 
'外国人可以在巴厘岛购买房产吗？', 
'Can foreigners buy property in Bali?',
'外国人可以通过租赁权（Leasehold）方式购买房产，通常为25-30年，可续期。我们提供完整的法律咨询服务，确保您的投资安全合规。此外，外国人也可以通过设立印尼公司（PT PMA）的方式获得房产所有权。',
'Foreigners can purchase property through Leasehold arrangements, typically 25-30 years with renewal options. We provide comprehensive legal consultation to ensure your investment is secure and compliant. Additionally, foreigners can also obtain property ownership by establishing an Indonesian company (PT PMA).',
1, true, ARRAY['租赁权', 'Leasehold', '外国人', 'Foreigners']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Policy'), 
'什么是租赁权（Leasehold）？', 
'What is Leasehold?',
'租赁权是外国人在印尼获得土地使用权的主要方式，初始期限通常为25年，可以续期25年，总计最长50年。租赁权持有人享有土地的使用权、建设权和转让权。',
'Leasehold is the primary way for foreigners to obtain land use rights in Indonesia, with an initial term of typically 25 years, renewable for another 25 years, totaling a maximum of 50 years. Leasehold holders enjoy land use rights, construction rights, and transfer rights.',
2, false, ARRAY['租赁权', 'Leasehold', '土地使用权', 'Land Use Rights']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Policy'), 
'外国人可以购买哪些类型的房产？', 
'What types of properties can foreigners buy?',
'外国人可以购买公寓（Apartment）、别墅（Villa）、商业地产等。但不能直接购买土地所有权（Freehold），需要通过租赁权或公司持有的方式。',
'Foreigners can purchase apartments, villas, commercial properties, etc. However, they cannot directly purchase freehold land ownership and need to do so through leasehold or company ownership.',
3, false, ARRAY['公寓', 'Apartment', '别墅', 'Villa', '商业地产', 'Commercial']),

-- 投资回报类
((SELECT id FROM public.faq_categories WHERE name_en = 'Investment Returns'), 
'投资巴厘岛房产的回报率如何？', 
'What are the returns on Bali property investment?',
'根据地段和房产类型，年租金回报率通常在6-12%之间。热门区域如水明漾、乌布的高端别墅回报率可达10-15%。我们的专业团队会根据您的投资目标，为您推荐最适合的投资机会。',
'Depending on location and property type, annual rental yields typically range from 6-12%. High-end villas in popular areas like Seminyak and Ubud can achieve returns of 10-15%. Our professional team will recommend the most suitable investment opportunities based on your investment goals.',
1, true, ARRAY['回报率', 'Returns', '租金收益', 'Rental Income']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Investment Returns'), 
'巴厘岛房产市场的增值潜力如何？', 
'What is the appreciation potential of Bali property market?',
'巴厘岛房产市场在过去10年平均年增值率为8-12%。随着基础设施改善、旅游业发展和国际投资者增加，预计未来5-10年仍有良好的增值空间。',
'Bali property market has averaged 8-12% annual appreciation over the past 10 years. With infrastructure improvements, tourism development, and increasing international investors, good appreciation potential is expected for the next 5-10 years.',
2, false, ARRAY['增值', 'Appreciation', '市场潜力', 'Market Potential']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Investment Returns'), 
'什么区域的投资回报最好？', 
'Which areas offer the best investment returns?',
'水明漾、库塔、乌布是投资回报最佳的区域。水明漾适合高端度假租赁，库塔适合大众旅游市场，乌布适合文化体验型客户。我们会根据您的预算和投资策略推荐最适合的区域。',
'Seminyak, Kuta, and Ubud are the areas with the best investment returns. Seminyak is suitable for high-end vacation rentals, Kuta for mass tourism market, and Ubud for cultural experience customers. We will recommend the most suitable area based on your budget and investment strategy.',
3, false, ARRAY['投资区域', 'Investment Areas', '水明漾', 'Seminyak', '乌布', 'Ubud']),

-- 购买流程类
((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Process'), 
'购买流程需要多长时间？', 
'How long does the purchase process take?',
'完整的购买流程通常需要4-8周，包括尽职调查、法律审核、资金安排等步骤。我们会全程协助您完成每个环节，确保流程顺利进行。',
'The complete purchase process typically takes 4-8 weeks, including due diligence, legal review, and financing arrangements. We assist you through every step of the process to ensure smooth proceedings.',
1, true, ARRAY['购买流程', 'Purchase Process', '时间', 'Timeline']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Process'), 
'购买房产需要准备哪些文件？', 
'What documents are needed to purchase property?',
'需要准备护照、签证、银行资信证明、资金来源证明、印尼税号（NPWP）等。我们会提供详细的文件清单，并协助您准备所有必要文件。',
'You need to prepare passport, visa, bank credit certificate, proof of funds, Indonesian tax number (NPWP), etc. We will provide a detailed document checklist and assist you in preparing all necessary documents.',
2, false, ARRAY['文件', 'Documents', '护照', 'Passport', '税号', 'NPWP']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Purchase Process'), 
'可以贷款购买房产吗？', 
'Can I get a mortgage to buy property?',
'外国人在印尼获得银行贷款较为困难，通常需要支付全款。但我们可以协助您联系提供外国人贷款服务的银行，或推荐其他融资方案。',
'It is difficult for foreigners to obtain bank loans in Indonesia, and full payment is usually required. However, we can assist you in contacting banks that provide loan services to foreigners or recommend other financing options.',
3, false, ARRAY['贷款', 'Mortgage', '融资', 'Financing']),

-- 法律服务类
((SELECT id FROM public.faq_categories WHERE name_en = 'Legal Services'), 
'购买房产有哪些法律风险？', 
'What are the legal risks of buying property?',
'主要风险包括土地权属争议、建筑许可问题、税务合规等。我们的法律团队会进行全面的尽职调查，确保所有法律文件齐全有效，最大程度降低投资风险。',
'Main risks include land ownership disputes, building permit issues, tax compliance, etc. Our legal team conducts comprehensive due diligence to ensure all legal documents are complete and valid, minimizing investment risks.',
1, false, ARRAY['法律风险', 'Legal Risks', '尽职调查', 'Due Diligence']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Legal Services'), 
'如何确保房产权属清晰？', 
'How to ensure clear property ownership?',
'我们会检查土地证书（Certificate of Title）、建筑许可证（IMB）、环境许可等所有相关文件，确保房产权属清晰无争议。同时会在国土局进行权属查询验证。',
'We will check all relevant documents including Certificate of Title, Building Permit (IMB), environmental permits, etc., to ensure clear and undisputed property ownership. We will also conduct ownership verification at the Land Office.',
2, false, ARRAY['权属', 'Ownership', '土地证书', 'Certificate', '建筑许可', 'Building Permit']),

-- 物业管理类
((SELECT id FROM public.faq_categories WHERE name_en = 'Property Management'), 
'是否提供房产管理服务？', 
'Do you provide property management services?',
'是的，我们提供全方位的房产管理服务，包括租赁管理、维护保养、财务报告、客户服务等，让您的投资真正实现被动收入。管理费通常为租金收入的10-15%。',
'Yes, we provide comprehensive property management services including rental management, maintenance, financial reporting, customer service, etc., allowing your investment to generate truly passive income. Management fees are typically 10-15% of rental income.',
1, true, ARRAY['物业管理', 'Property Management', '租赁管理', 'Rental Management']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Property Management'), 
'房产维护包括哪些服务？', 
'What services are included in property maintenance?',
'包括日常清洁、园艺维护、设备检修、安全监控、紧急维修等。我们有专业的维护团队，确保您的房产始终保持最佳状态。',
'Includes daily cleaning, garden maintenance, equipment servicing, security monitoring, emergency repairs, etc. We have a professional maintenance team to ensure your property is always in optimal condition.',
2, false, ARRAY['维护', 'Maintenance', '清洁', 'Cleaning', '园艺', 'Gardening']),

-- 税务财务类
((SELECT id FROM public.faq_categories WHERE name_en = 'Tax & Finance'), 
'购买房产需要缴纳哪些税费？', 
'What taxes and fees are required when buying property?',
'主要包括土地和建筑税（PBB）、印花税、公证费、律师费等。总税费通常为房产价值的3-5%。我们会提供详细的税费清单和计算。',
'Main taxes include Land and Building Tax (PBB), stamp duty, notary fees, lawyer fees, etc. Total taxes and fees are typically 3-5% of property value. We will provide detailed tax lists and calculations.',
1, false, ARRAY['税费', 'Taxes', '印花税', 'Stamp Duty', 'PBB']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Tax & Finance'), 
'租金收入如何纳税？', 
'How to pay taxes on rental income?',
'租金收入需要缴纳个人所得税，税率为10%。我们可以协助您进行税务申报，确保合规经营。',
'Rental income is subject to personal income tax at a rate of 10%. We can assist you with tax filing to ensure compliant operations.',
2, false, ARRAY['租金税', 'Rental Tax', '个人所得税', 'Income Tax']),

((SELECT id FROM public.faq_categories WHERE name_en = 'Tax & Finance'), 
'如何将资金汇入印尼？', 
'How to transfer funds to Indonesia?',
'可以通过银行电汇、外汇兑换等方式。需要提供资金来源证明和相关文件。我们可以推荐可靠的汇款渠道和外汇服务商。',
'You can transfer funds through bank wire transfer, foreign exchange, etc. Proof of funds and related documents are required. We can recommend reliable remittance channels and foreign exchange service providers.',
3, false, ARRAY['资金汇入', 'Fund Transfer', '银行电汇', 'Wire Transfer']);

-- 10. 验证数据插入
SELECT 
  '数据验证' as category,
  (SELECT COUNT(*) FROM public.faq_categories WHERE is_active = true) as 分类数量,
  (SELECT COUNT(*) FROM public.faqs WHERE is_active = true) as 问题数量,
  (SELECT COUNT(*) FROM public.faqs WHERE is_featured = true) as 精选问题数量;