-- 创建创始人信件表
CREATE TABLE IF NOT EXISTS public.founder_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_zh TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_zh TEXT NOT NULL,
    content_en TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL DEFAULT 'Alex Chen',
    author_title_zh VARCHAR(100) NOT NULL DEFAULT '创始人 & CEO',
    author_title_en VARCHAR(100) NOT NULL DEFAULT 'Founder & CEO',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_founder_letters_active ON public.founder_letters(is_active);
CREATE INDEX IF NOT EXISTS idx_founder_letters_order ON public.founder_letters(display_order);

-- 启用 RLS
ALTER TABLE public.founder_letters ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：所有人可以查看活跃的信件
CREATE POLICY "Anyone can view active founder letters" ON public.founder_letters
    FOR SELECT USING (is_active = true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_founder_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_founder_letters_updated_at
    BEFORE UPDATE ON public.founder_letters
    FOR EACH ROW
    EXECUTE FUNCTION update_founder_letters_updated_at();

-- 插入创始人的信件内容
INSERT INTO public.founder_letters (
    title_zh,
    title_en,
    content_zh,
    content_en,
    author_name,
    author_title_zh,
    author_title_en,
    is_active,
    display_order
) VALUES (
    '让跨境置业更透明、更高效，也更安心',
    'Making cross-border property investment more transparent, efficient, and secure',
    '我们创办这家巴厘岛房地产服务公司，源于自己在巴厘岛投资的真实经历。

真正参与到跨境置业之后，我们发现，难点往往不在"买"或"卖"本身，而在于信息结构的差异——法律体系、税务规则、产权逻辑、公司架构安排，都与中国市场截然不同。巴厘岛是一个充满机会，但也相当复杂的投资环境。一个理想的收益结果，往往不是一蹴而就，而是需要在每一个环节中反复确认、逐步推进。

语言与文化差异，并不是简单的翻译问题，而是理解深度与风险判断的问题。信息不对称所带来的，往往不是效率下降，而是潜在的决策风险。

正因如此，我们决定建立一个以中文客户为核心、同时深度融入巴厘岛本地市场生态的房地产平台。

我们也清楚，中文市场并不是一个被充分覆盖的成熟板块。许多本地卖方中介和开发商高度重视这个市场，但并未系统配备中文服务能力。因此，我们创立了 Real Real，以第三方身份参与多个卖方机构的涉中文交易流程，协助买卖双方在跨境交易中实现更顺畅的沟通与协作。

在不增加买卖双方佣金成本的前提下，我们与巴厘岛几乎所有头部卖方中介机构及开发商建立长期合作关系，确保房源信息的完整性与交易路径的透明度。我们不仅是信息的传递者，更参与交易结构的梳理与风险节点的把控。

同时，我们整合了许多中文客户在跨境置业过程中实际需要、但在当地市场较少被系统整合的专业资源——包括驻印尼的中文律师、财务与税务顾问团队。这些资源并非替代本地体系，而是帮助客户更清晰地理解规则，更有信心地做出决策。

我们长期深耕房地产领域，这是我们的专业所在。我们熟悉交易逻辑、投资模型与法律框架，也理解资产配置背后的长期视角。我们希望将更高效的执行力、更清晰的流程管理与更高质量的服务标准带入这个市场。

我们相信，真正的价值不在语言本身，而在于专业判断、结构理解与责任意识。

我们的目标，是成为中文客户在巴厘岛进行资产配置时，值得长期信赖的合作伙伴——让跨境置业更透明、更高效，也更安心。',
    'We founded this Bali real estate service company based on our own real investment experience in Bali.

After truly participating in cross-border property investment, we discovered that the challenges often lie not in "buying" or "selling" itself, but in the differences in information structure - legal systems, tax rules, property rights logic, and corporate structure arrangements are all completely different from the Chinese market. Bali is an investment environment full of opportunities, but also quite complex. An ideal return result is often not achieved overnight, but requires repeated confirmation and gradual progress at every step.

Language and cultural differences are not simply translation issues, but matters of understanding depth and risk assessment. Information asymmetry often brings not decreased efficiency, but potential decision-making risks.

For this reason, we decided to establish a real estate platform centered on Chinese-speaking clients while deeply integrated into the local Bali market ecosystem.

We also understand that the Chinese market is not a fully covered mature segment. Many local seller agencies and developers highly value this market, but have not systematically equipped themselves with Chinese service capabilities. Therefore, we founded Real Real to participate as a third party in the Chinese-related transaction processes of multiple seller institutions, assisting buyers and sellers in achieving smoother communication and collaboration in cross-border transactions.

Without increasing commission costs for buyers and sellers, we have established long-term partnerships with almost all leading seller agencies and developers in Bali to ensure the completeness of property information and transparency of transaction paths. We are not only information transmitters, but also participate in transaction structure organization and risk point control.

At the same time, we have integrated many professional resources that Chinese clients actually need in the cross-border property investment process, but are rarely systematically integrated in the local market - including Chinese lawyers stationed in Indonesia, financial and tax advisory teams. These resources do not replace the local system, but help clients understand the rules more clearly and make decisions with more confidence.

We have long been deeply involved in the real estate field, which is our expertise. We are familiar with transaction logic, investment models and legal frameworks, and also understand the long-term perspective behind asset allocation. We hope to bring more efficient execution, clearer process management and higher quality service standards to this market.

We believe that true value lies not in language itself, but in professional judgment, structural understanding and sense of responsibility.

Our goal is to become a long-term trusted partner for Chinese clients in asset allocation in Bali - making cross-border property investment more transparent, efficient, and secure.',
    'Alex Chen',
    '创始人 & CEO',
    'Founder & CEO',
    true,
    1
);

-- 验证数据插入
SELECT 
    id,
    title_zh,
    title_en,
    LEFT(content_zh, 100) || '...' as content_zh_preview,
    LEFT(content_en, 100) || '...' as content_en_preview,
    author_name,
    author_title_zh,
    author_title_en,
    is_active,
    created_at
FROM public.founder_letters
WHERE is_active = true
ORDER BY display_order;