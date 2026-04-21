import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, MapPin, Home as HomeIcon, ShieldCheck, Settings, BarChart3, ChevronLeft } from 'lucide-react';
import { ROUTE_PATHS, TRANSLATIONS, scrollToTop } from '@/lib/index';
import { SERVICES } from '@/data/index';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';
import { HeroCarousel } from '@/components/HeroCarousel';
import { PropertyCard } from '@/components/PropertyCard';
import { ServiceCard } from '@/components/ServiceCard';
import { AreaExploration } from '@/components/AreaExploration';
import { IMAGES } from '@/assets/images';
import { Button } from '@/components/ui/button';
const iconMap = {
  Home: HomeIcon,
  ShieldCheck,
  Settings,
  BarChart3
};
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
export default function Home() {
  const {
    language
  } = useApp();
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();

  // 数据库状态
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 精选房产区域的引用
  const featuredSectionRef = useRef<HTMLElement>(null);

  // 设置页面标题
  useEffect(() => {
    document.title = 'REAL REAL | 巴厘岛房产';
  }, []);

  // 获取精选房产
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/property_api_complete_2026_03_04_06_00/featured?limit=50&language=' + language, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXNwcGJzeHNseXV6Y2lmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTMxNTQsImV4cCI6MjA4NzIyOTE1NH0.uYXE5mkbGL24gL5Z1n9wxIXtC-P1QuBYGH8M_nvQsOI',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        
        const apiProperties = result.data || [];
        
        const tagsResponse = await supabase
          .from('properties')
          .select('id, slug, tags_zh, tags_en, ownership')
          .eq('is_featured', true);
        
        const formattedProperties = apiProperties.map((property: any) => {
          const tagInfo = tagsResponse.data?.find((t: any) => t.id === property.id);
          return {
            ...property,
            slug: tagInfo?.slug || property.slug,
            tags_zh: tagInfo?.tags_zh || [],
            tags_en: tagInfo?.tags_en || [],
            ownership: tagInfo?.ownership || property.ownership
          };
        });
        
        setFeaturedProperties(formattedProperties);
        // 数据加载完成后重置到第一页
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProperties();
  }, [language]); // 语言切换时重新获取数据

  // 使用 useMemo 优化分页计算，避免状态更新时的问题
  const paginationData = useMemo(() => {
    // API已经返回的是精选房产，不需要再次过滤
    const featuredList = featuredProperties;
    const totalPages = Math.ceil(featuredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayProperties = featuredList.slice(startIndex, endIndex);
    return {
      featuredList,
      totalPages,
      displayProperties
    };
  }, [featuredProperties, currentPage, itemsPerPage]);
  const {
    featuredList,
    totalPages,
    displayProperties
  } = paginationData;

  // 滚动到精选房产区域的函数
  const scrollToFeaturedSection = () => {
    if (featuredSectionRef.current) {
      featuredSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 分页控制函数
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    // 延迟一点滚动，等待状态更新
    setTimeout(scrollToFeaturedSection, 100);
  };
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    setTimeout(scrollToFeaturedSection, 100);
  };
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    setTimeout(scrollToFeaturedSection, 100);
  };
  const handlePropertyClick = (property: any) => {
    navigate(ROUTE_PATHS.PROPERTY_DETAIL(language, property.slug || property.id));
  };
  return (
    <>
      <SEOHead
        title={language === 'zh' ? 'REAL REAL | 巴厘岛房产' : 'REAL REAL | Bali Property'}
        description={language === 'zh' 
          ? '巴厘岛专业房产中介服务，提供别墅、土地等优质房产资源' 
          : 'Professional Bali property agency offering villas, land and premium properties'}
        keywords={language === 'zh'
          ? '巴厘岛房产,巴厘岛别墅,巴厘岛投资,印尼房产'
          : 'Bali property,Bali villa,Bali investment,Indonesia real estate'}
      />
      <main className="flex flex-col pt-20">
      {/* Hero Section */}
      <HeroCarousel properties={featuredList} onPropertyClick={handlePropertyClick} />

      {/* Brand Narrative Section - Using only text-lg and text-sm */}
      <section className="luxury-section bg-background">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={fadeInUp} className="flex flex-col gap-8">
              <div className="space-y-4">
                <span className="text-xs sm:text-sm lg:text-base text-primary/60 tracking-widest uppercase">{t.hero.subtitle}</span>
                <h2 className="text-base sm:text-lg lg:text-xl text-primary font-light uppercase tracking-tight">
                  {t.hero.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-xl leading-relaxed">
                {t.hero.description}
              </p>
              
              <div className="grid grid-cols-2 gap-12 pt-4">
                <div className="space-y-2">
                  <p className="text-base sm:text-lg lg:text-xl font-mono font-light">12+</p>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground uppercase tracking-wider">
                    {language === 'zh' ? '年巴厘岛经验' : 'Years in Bali'}
                  </p>
                </div>
                <div className="space-y-2">
                  
                  
                </div>
              </div>

              <div className="pt-6">
                <Button asChild className="luxury-button px-10 py-6 h-auto text-sm group uppercase tracking-[0.05em]">
                  <Link to={ROUTE_PATHS.ABOUT(language)} onClick={scrollToTop}>
                    {language === 'zh' ? '了解我们的故事' : 'Our Story'}
                    <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            scale: 0.98
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }} className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img src="https://img.realrealbali.com/web/index1.png" alt="Quiet Luxury Interior" className="w-full luxury-image opacity-90 h-[787.3526611328125px] object-cover" />
              <div className="absolute inset-0 border-[24px] border-white/5 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section ref={featuredSectionRef} className="luxury-section bg-secondary/20">
        <div className="luxury-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm lg:text-base text-primary/60 uppercase tracking-widest">{t.propertyCard.featured}</span>
              <h2 className="text-base sm:text-lg lg:text-xl text-primary uppercase">
                {language === 'zh' ? '2026年度 · 精选房产' : '2026 Elite Selection'}
              </h2>
            </div>
            <Button asChild className="luxury-button px-10 py-6 h-auto text-sm group uppercase tracking-[0.05em]">
              <Link to={ROUTE_PATHS.PROPERTIES(language)} onClick={scrollToTop}>
                {language === 'zh' ? '查看全部房产' : 'View All Properties'}
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>

          {loading ? <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div> : error ? <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-destructive mb-4">
                  {language === 'zh' ? '加载失败' : 'Loading failed'}: {error}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  {language === 'zh' ? '重新加载' : 'Reload'}
                </Button>
              </div>
            </div> : <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 md:gap-x-4 gap-y-3 md:gap-y-4">
                {displayProperties.map(property => <div key={property.id}>
                    <PropertyCard property={property} />
                  </div>)}
              </div>
            </div>}
          
          {/* 分页按钮 */}
          {!loading && totalPages > 1 && <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center justify-center w-10 h-10 rounded-none border border-border/20 bg-background hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({
              length: totalPages
            }, (_, i) => i + 1).map(page => <button key={page} onClick={() => handlePageClick(page)} className={`w-10 h-10 rounded-none border transition-colors ${currentPage === page ? 'bg-primary text-primary-foreground border-primary' : 'border-border/20 bg-background hover:bg-secondary/20'}`}>
                    {page}
                  </button>)}
              </div>
              
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="flex items-center justify-center w-10 h-10 rounded-none border border-border/20 bg-background hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>}
        </div>
      </section>

      {/* Detailed Area Exploration */}
      <AreaExploration />

      {/* Services Section */}
      <section className="luxury-section bg-background">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }} className="space-y-12">
              <div className="space-y-4">
                <span className="text-xs sm:text-sm lg:text-base text-primary/60 uppercase tracking-widest">{t.services.subtitle}</span>
                <h2 className="text-base sm:text-lg lg:text-xl text-primary uppercase">
                  {t.services.title}
                </h2>
              </div>
              
              <div className="space-y-8">
                {SERVICES.slice(0, 4).map((service, index) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap];
                return <motion.div key={service.id} initial={{
                  opacity: 0,
                  y: 16
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }} className="flex items-start gap-6 group cursor-pointer" onClick={() => navigate(ROUTE_PATHS.ABOUT(language))}>
                      <div className="w-10 h-10 bg-black/5 flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base sm:text-lg lg:text-xl font-light transition-colors group-hover:text-black">
                          {service.title?.[language] || service.title?.zh || service.title?.en || ''}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed transition-colors group-hover:text-black/70">
                          {service.description?.[language] || service.description?.zh || service.description?.en || ''}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </motion.div>;
              })}
              </div>

              <div className="pt-8">
                <Button asChild variant="outline" className="luxury-button-outline px-6 sm:px-8 py-4 sm:py-5 h-auto text-xs sm:text-sm lg:text-base uppercase tracking-widest">
                  <Link to={ROUTE_PATHS.ABOUT(language)} onClick={scrollToTop}>
                    {language === 'zh' ? '了解更多服务' : 'Learn More Services'}
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            scale: 0.98
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1]
          }} className="relative aspect-[4/5] overflow-hidden">
              <img src="https://img.realrealbali.com/web/index2.jpg" alt="Professional Services" className="w-full luxury-image h-[810.3251953125px] object-cover" />
              <div className="absolute inset-0 border-[24px] border-white/5 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Call to Action */}
      <section className="luxury-section bg-background relative overflow-hidden border-t border-border">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.02] pointer-events-none">
           <img src={IMAGES.MINIMALIST_INTERIOR_6} className="w-full h-full object-cover" alt="" />
        </div>

        <div className="luxury-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={fadeInUp} className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-lg text-primary uppercase tracking-tight">
              {language === 'zh' ? '开启您的投资之旅' : 'Start Your Investment Journey'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {language === 'zh' ? '无论是寻求高回报的投资物业，还是梦想中的度假别墅，我们的专家团队随时为您待命。' : 'Whether seeking high-yield investment assets or your dream holiday villa, our expert team is at your service.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6">
              
              
              <Button asChild className="luxury-button flex-1 py-8 text-sm tracking-[0.1em] uppercase">
                <Link to={ROUTE_PATHS.CONTACT(language)} onClick={scrollToTop}>{t.nav.contact}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}