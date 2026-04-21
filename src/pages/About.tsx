import React, { useState, useRef, useEffect } from "react";
import { SEOHead } from '@/components/SEOHead';
import { motion } from "framer-motion";
import { ArrowRight, Home, ShieldCheck, Settings, BarChart3, CheckCircle2, HelpCircle, Quote, Plus, Minus, Shield, Award, Users, Search, Tag, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { IMAGES } from "@/assets/images";
import { SERVICES } from "@/data/index";
import { ROUTE_PATHS, TRANSLATIONS } from "@/lib/index";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useFAQs } from "@/hooks/useFAQs";
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />
};
const TEAM_MEMBERS = [{
  id: "1",
  name: "Judy Chiu",
  key: "judy",
  image: "https://img.realrealbali.com/web/founderheadshot-judy.png"
}, {
  id: "2",
  name: "Jacky Chiu",
  key: "jacky",
  image: "https://img.realrealbali.com/web/founderheadshot-jacky.jpg"
}];
const About: React.FC = () => {
  const {
    language
  } = useApp();
  const t = TRANSLATIONS[language];
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // 设置页面标题
  useEffect(() => {
    document.title = language === 'zh' 
      ? '关于我们 - REAL REAL'
      : 'About Us - REAL REAL';
  }, [language]);

  // 使用FAQ Hook
  const {
    categories,
    faqs,
    loading: faqLoading,
    error: faqError,
    incrementViewCount,
    getFAQsByCategory,
    getFeaturedFAQs,
    searchFAQs
  } = useFAQs();

  // 不再需要高度匹配，使用固定正方形

  // 获取要显示的FAQ
  const getDisplayFAQs = () => {
    if (searchQuery.trim()) {
      return searchFAQs(searchQuery, language);
    }
    if (selectedCategory === 'all') {
      return faqs;
    }
    if (selectedCategory === 'featured') {
      return getFeaturedFAQs();
    }
    return getFAQsByCategory(selectedCategory);
  };
  const displayFAQs = getDisplayFAQs();
  return (
    <>
      <SEOHead
        title={language === 'zh' ? '关于我们 - REAL REAL' : 'About Us - REAL REAL'}
        description={language === 'zh'
          ? '了解 REAL REAL，巴厘岛专业房产中介团队，为您提供优质的房产投资服务'
          : 'Learn about REAL REAL, professional Bali property agency team providing quality investment services'}
      />
      <div className="flex flex-col w-full bg-background pt-20">
      {/* Hero Section */}
      

      {/* 1. Founder's Letter - 简约克制风格 */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 max-w-7xl mx-auto" style={{
          gridTemplateRows: 'auto'
        }}>
            
            {/* 左侧 - 创始人的话 */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Quote className="w-6 h-6 text-primary" />
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {language === 'zh' ? '创始人的话' : "Founder's Letter"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
                  {language === 'zh' ? '让跨境置业更透明、更高效，也更安心' : 'Making cross-border property investment more transparent, efficient, and secure'}
                </h2>
              </div>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <div className="space-y-6">
                  {(language === 'zh' ? ['我们创办这家巴厘岛房地产服务公司，源于自己在巴厘岛投资的真实经历。', '真正参与到跨境置业之后，我们发现，难点往往不在“买”或“卖”本身，而在于信息结构的差异——法律体系、税务规则、产权逻辑、公司架构安排，都与中国市场截然不同。巴厘岛是一个充满机会，但也相当复杂的投资环境。一个理想的收益结果，往往不是一蹴而就，而是需要在每一个环节中反复确认、逐步推进。', '语言与文化差异，并不是简单的翻译问题，而是理解深度与风险判断的问题。信息不对称所带来的，往往不是效率下降，而是潜在的决策风险。', '正因如此，我们决定建立一个以中文客户为核心、同时深度融入巴厘岛本地市场生态的房地产平台。', '我们也清楚，中文市场并不是一个被充分覆盖的成熟板块。许多本地卖方中介和开发商高度重视这个市场，但并未系统配备中文服务能力。因此，我们创立了 Real Real，以第三方身份参与多个卖方机构的涉中文交易流程，协助买卖双方在跨境交易中实现更顺畅的沟通与协作。', '在不增加买卖双方佣金成本的前提下，我们与巴厘岛几乎所有头部卖方中介机构及开发商建立长期合作关系，确保房源信息的完整性与交易路径的透明度。我们不仅是信息的传递者，更参与交易结构的梳理与风险节点的把控。', '同时，我们整合了许多中文客户在跨境置业过程中实际需要、但在当地市场较少被系统整合的专业资源——包括驻印尼的中文律师、财务与税务顾问团队。这些资源并非替代本地体系，而是帮助客户更清晰地理解规则，更有信心地做出决策。', '我们长期深耕房地产领域，这是我们的专业所在。我们熟悉交易逻辑、投资模型与法律框架，也理解资产配置背后的长期视角。我们希望将更高效的执行力、更清晰的流程管理与更高质量的服务标准带入这个市场。', '我们相信，真正的价值不在语言本身，而在于专业判断、结构理解与责任意识。', '我们的目标，是成为中文客户在巴厘岛进行资产配置时，值得长期信赖的合作伙伴——让跨境置业更透明、更高效，也更安心。'] : ['We founded this Bali real estate service company based on our own real investment experience in Bali.', 'After truly participating in cross-border property investment, we discovered that the challenges often lie not in "buying" or "selling" itself, but in the differences in information structure - legal systems, tax rules, property rights logic, and corporate structure arrangements are all completely different from the Chinese market. Bali is an investment environment full of opportunities, but also quite complex. An ideal return result is often not achieved overnight, but requires repeated confirmation and gradual progress at every step.', 'Language and cultural differences are not simply translation issues, but matters of understanding depth and risk assessment. Information asymmetry often brings not decreased efficiency, but potential decision-making risks.', 'For this reason, we decided to establish a real estate platform centered on Chinese-speaking clients while deeply integrated into the local Bali market ecosystem.', 'We also understand that the Chinese market is not a fully covered mature segment. Many local seller agencies and developers highly value this market, but have not systematically equipped themselves with Chinese service capabilities. Therefore, we founded Real Real to participate as a third party in the Chinese-related transaction processes of multiple seller institutions, assisting buyers and sellers in achieving smoother communication and collaboration in cross-border transactions.', 'Without increasing commission costs for buyers and sellers, we have established long-term partnerships with almost all leading seller agencies and developers in Bali to ensure the completeness of property information and transparency of transaction paths. We are not only information transmitters, but also participate in transaction structure organization and risk point control.', 'At the same time, we have integrated many professional resources that Chinese clients actually need in the cross-border property investment process, but are rarely systematically integrated in the local market - including Chinese lawyers stationed in Indonesia, financial and tax advisory teams. These resources do not replace the local system, but help clients understand the rules more clearly and make decisions with more confidence.', 'We have long been deeply involved in the real estate field, which is our expertise. We are familiar with transaction logic, investment models and legal frameworks, and also understand the long-term perspective behind asset allocation. We hope to bring more efficient execution, clearer process management and higher quality service standards to this market.', 'We believe that true value lies not in language itself, but in professional judgment, structural understanding and sense of responsibility.', 'Our goal is to become a long-term trusted partner for Chinese clients in asset allocation in Bali - making cross-border property investment more transparent, efficient, and secure.']).map((paragraph, index) => <p key={index} className={index === 0 ? 'text-lg font-light' : ''}>
                      {paragraph}
                    </p>)}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'zh' ? '邱婷' : 'Judy Chiu'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'zh' ? '创始人 & CEO' : 'Founder & CEO'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 右侧 - 照片网格 */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="space-y-4">
              {/* 立即显示图片，不等待加载 */}
              <>
                  {/* 第一张图片 */}
                  <div className="aspect-square overflow-hidden rounded-sm">
                    <img src="https://img.realrealbali.com/web/about1.jpg" alt={language === 'zh' ? '现代建筑美学' : 'Modern Architecture'} className="w-full grayscale hover:grayscale-0 transition-all duration-500 h-[389.328125px] object-cover" />
                  </div>
                  
                  {/* 第二张图片 */}
                  <div className="aspect-square overflow-hidden rounded-sm">
                    <img src="https://img.realrealbali.com/web/about2.jpg" alt={language === 'zh' ? '极简设计理念' : 'Minimalist Design'} className="w-full grayscale hover:grayscale-0 transition-all duration-500 h-[389.328125px] object-cover" />
                  </div>
                  
                  {/* 第三张图片 */}
                  
                </>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Professional Services - 简洁版本 */}
      <section className="py-12" style={{
      backgroundColor: '#B7B7B7'
    }}>
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-light mb-2 tracking-tight">
                  {language === 'zh' ? '专业服务体系' : 'Professional Services'}
                </h2>
                <p className="text-muted-foreground text-base font-light leading-relaxed max-w-2xl">
                  {language === 'zh' ? '从市场分析到交易完成，每个环节都体现专业与品质。' : 'From market analysis to transaction completion, professionalism and quality in every step.'}
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowAllServices(!showAllServices)} className="whitespace-nowrap">
                {showAllServices ? language === 'zh' ? '收起服务' : 'Show Less' : language === 'zh' ? '查看更多服务' : 'View More Services'}
              </Button>
            </div>

            {/* 核心服务展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {SERVICES.slice(0, 4).map((service, index) => <motion.div key={service.id} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="text-center space-y-2">
                  <h3 className="font-semibold text-base tracking-wide">
                    {language === 'zh' ? service.title.zh : service.title.en}
                  </h3>
                </motion.div>)}
            </div>

            {/* 展开的详细服务 */}
            {showAllServices && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: "auto"
          }} exit={{
            opacity: 0,
            height: 0
          }} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/20">
                {SERVICES.map((service, index) => <motion.div key={service.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} className="space-y-2 p-4 bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-sm">
                    <h3 className="font-semibold text-base tracking-wide">
                      {language === 'zh' ? service.title.zh : service.title.en}
                    </h3>
                    <p className="text-black/70 text-sm font-light leading-relaxed">
                      {language === 'zh' ? service.description.zh : service.description.en}
                    </p>
                  </motion.div>)}
              </motion.div>}
          </motion.div>
        </div>
      </section>

      {/* 3. Company Values - 简洁版本 */}
      

      {/* 4. Team Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                {language === 'zh' ? '专业团队' : 'Our Team'}
              </h2>
              
            </div>

            {/* 水平排列：图片1+文字1+图片2+文字2 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
              {TEAM_MEMBERS.map((member, index) => (
                <React.Fragment key={member.id}>
                  {/* 成员头像 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex-shrink-0"
                  >
                    <div className="relative overflow-hidden w-32 h-32 md:w-40 md:h-40 rounded-full">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  </motion.div>
                  
                  {/* 成员介绍 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="text-center md:text-left space-y-2 max-w-xs"
                  >
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {t.about.team.members[member.key as keyof typeof t.about.team.members]?.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.about.team.members[member.key as keyof typeof t.about.team.members]?.bio}
                    </p>
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. FAQ Section - 使用数据库数据 */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                {language === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
              </h2>
              
            </div>

            {/* FAQ 搜索和筛选 */}
            <div className="space-y-6">
              {/* 搜索框 */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder={language === 'zh' ? '搜索问题...' : 'Search questions...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>

              {/* 分类筛选 */}
              <div className="flex flex-wrap justify-center items-center gap-1 text-sm">
                <button onClick={() => setSelectedCategory('all')} className={`px-2 py-1 transition-all duration-200 hover:underline ${selectedCategory === 'all' ? 'text-primary font-medium underline' : 'text-muted-foreground hover:text-foreground'}`}>
                  {language === 'zh' ? '全部' : 'All'}
                </button>
                <span className="text-muted-foreground">|</span>
                <button onClick={() => setSelectedCategory('featured')} className={`px-2 py-1 transition-all duration-200 hover:underline ${selectedCategory === 'featured' ? 'text-primary font-medium underline' : 'text-muted-foreground hover:text-foreground'}`}>
                  {language === 'zh' ? '热门' : 'Popular'}
                </button>
                {categories.map((category, index) => <React.Fragment key={category.id}>
                    <span className="text-muted-foreground">|</span>
                    <button onClick={() => setSelectedCategory(category.id)} className={`px-2 py-1 transition-all duration-200 hover:underline ${selectedCategory === category.id ? 'text-primary font-medium underline' : 'text-muted-foreground hover:text-foreground'}`}>
                      {language === 'zh' ? category.name_zh : category.name_en}
                    </button>
                  </React.Fragment>)}
              </div>
            </div>

            {/* FAQ 列表 */}
            {faqLoading ? <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {language === 'zh' ? '加载中...' : 'Loading...'}
                </p>
              </div> : faqError ? <div className="text-center py-8">
                <p className="text-red-500">
                  {language === 'zh' ? '加载失败，请稍后重试' : 'Failed to load, please try again later'}
                </p>
              </div> : displayFAQs.length === 0 ? <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {language === 'zh' ? '没有找到相关问题' : 'No questions found'}
                </p>
              </div> : <Accordion type="single" collapsible className="w-full">
                {displayFAQs.map(faq => <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/30 last:border-b-0">
                    <AccordionTrigger className="text-left hover:no-underline py-4 px-0" onClick={() => incrementViewCount(faq.id)}>
                      <div className="flex items-start gap-3 w-full">
                        
                        <div className="flex-1 space-y-2">
                          <span className="font-medium">
                            {language === 'zh' ? faq.question_zh : faq.question_en}
                          </span>
                          
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-0 px-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {language === 'zh' ? faq.answer_zh : faq.answer_en}
                      </p>
                    </AccordionContent>
                  </AccordionItem>)}
              </Accordion>}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              {language === 'zh' ? '开启您的巴厘岛投资之旅' : 'Start Your Bali Investment Journey'}
            </h2>
            <p className="text-lg font-light leading-relaxed opacity-90">
              {language === 'zh' ? '让我们成为您在巴厘岛最值得信赖的房产投资合伙人。' : 'Let us become your most trusted property investment partner in Bali.'}
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to={ROUTE_PATHS.CONTACT(language)} className="inline-flex items-center gap-2">
                {language === 'zh' ? '立即咨询' : 'Contact Now'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};
export default About;