import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, BedDouble, Bath, Square, Home, Play, Pause, ChevronDown } from 'lucide-react';
import { Property, formatPriceWithCurrency, formatDatabasePrice, formatLandPrice, ROUTE_PATHS, getAreaNameById } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface HeroCarouselProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

/**
 * 采用都会极简主义比例的静奢风房产轮播组件
 * 严格遵循 2026 年设计规范
 */
export function HeroCarousel({
  properties,
  onPropertyClick
}: HeroCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const {
    currency,
    language,
    t
  } = useApp();
  const currentProperty = properties[currentIndex];
  useEffect(() => {
    if (!isAutoPlaying || properties.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % properties.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, properties.length]);
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
  };
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % properties.length);
  };
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // 触摸事件处理
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // 如果没有房产数据，显示加载状态
  if (!properties || properties.length === 0) {
    return <section className="relative h-[75vh] min-h-[600px] max-h-[800px] overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </section>;
  }
  if (!currentProperty) return null;
  const title = currentProperty.title?.[language] || currentProperty.title?.['en'] || currentProperty.title?.zh || '';
  const description = currentProperty.description?.[language] || currentProperty.description?.['en'] || currentProperty.description?.zh || '';
  const location = currentProperty.area_id ? getAreaNameById(currentProperty.area_id, language) : (currentProperty.location?.[language] || currentProperty.location?.['en'] || currentProperty.location?.zh || '');
  const type = currentProperty.type?.[language] || currentProperty.type?.['en'] || currentProperty.type?.zh || '';
  return <section className="relative h-[75vh] min-h-[600px] max-h-[800px] overflow-hidden bg-background -mt-12 md:-mt-20" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {/* 背景图像层 */}
      <AnimatePresence>
        <motion.div key={`bg-${currentIndex}`} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }} className="absolute inset-0">
          <img src={currentProperty.image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* 内容层 */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="luxury-container w-full">
          <div className="max-w-3xl pt-24 sm:pt-20 md:pt-24">
            <motion.div key={`content-${currentIndex}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}>
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                {currentProperty.featured && <Badge className="bg-black/80 text-white border-none text-[11px] font-medium px-1.5 py-0.5 !rounded-none whitespace-nowrap shadow-sm">
                    {t('propertyCard.featured')}
                  </Badge>}
                
                {/* 显示数据库中的标签，最多3个 - 黑底白字，自适应宽度，横向排列 */}
                {currentProperty.tags && currentProperty.tags.slice(0, 3).map((tag, index) => <Badge key={index} className="bg-black/80 text-white border-none text-[11px] font-medium px-1.5 py-0.5 !rounded-none whitespace-nowrap shadow-sm" style={{
                width: 'fit-content',
                minWidth: 'auto'
              }}>
                    {tag}
                  </Badge>)}
                
                {/* 如果没有tags，则显示类型 */}
                {(!currentProperty.tags || currentProperty.tags.length === 0) && <Badge className="bg-black/80 text-white border-black/90 text-xs font-medium px-2 py-1 whitespace-nowrap !rounded-none">
                    {type}
                  </Badge>}
              </div>

              {/* 标题使用大号字体比例 */}
              <h1 className="text-2xl sm:text-4xl md:text-6xl uppercase font-semibold tracking-[0.1em] mb-3 sm:mb-4 text-white leading-tight">
                {title}
              </h1>
              
              {/* 描述使用小号辅助文字 */}
              <p className="text-xs sm:text-sm text-white/80 mb-4 sm:mb-6 max-w-xl line-clamp-2">
                {description}
              </p>

              <div className="flex items-center gap-2 mb-4 sm:mb-6 text-white/90">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs tracking-[0.08em] uppercase">{location}</span>
              </div>

              {/* 核心指标 - 紧凑布局 */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 sm:mb-8 py-3 sm:py-4">
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                  <span className="text-sm sm:text-lg font-mono text-white">{currentProperty.bedrooms}</span>
                  <span className="text-xs text-white/60">{t('propertyCard.bedrooms')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                  <span className="text-sm sm:text-lg font-mono text-white">{currentProperty.bathrooms}</span>
                  <span className="text-xs text-white/60">{t('propertyCard.bathrooms')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                  <span className="text-sm sm:text-lg font-mono text-white">{currentProperty.buildingArea}m²</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Square className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                  <span className="text-sm sm:text-lg font-mono text-white">{currentProperty.landArea}m²</span>
                </div>
              </div>

              {/* 价格与操作区 */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-12 sm:mb-8">
                <div className="flex flex-col">
                  <span className="text-xs text-white/90 mb-1 font-medium tracking-wider uppercase drop-shadow-md">{t('common.currency')}</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-mono tracking-tight text-white font-bold drop-shadow-xl">
                    {currentProperty.type?.en === 'Land' || currentProperty.type?.zh === '土地' ?
                  // 土地类型显示单价/are
                  currency === 'CNY' && currentProperty.priceCNY ? formatLandPrice(currentProperty.priceCNY, currentProperty.landArea || 100, 'CNY', language) : currency === 'IDR' && currentProperty.priceIDR ? formatLandPrice(currentProperty.priceIDR, currentProperty.landArea || 100, 'IDR', language) : formatLandPrice(currentProperty.priceUSD || currentProperty.price, currentProperty.landArea || 100, 'USD', language) :
                  // 非土地类型显示总价
                  currency === 'CNY' && currentProperty.priceCNY ? formatDatabasePrice(currentProperty.priceCNY, 'CNY', language) : currency === 'IDR' && currentProperty.priceIDR ? formatDatabasePrice(currentProperty.priceIDR, 'IDR', language) : formatDatabasePrice(currentProperty.priceUSD || currentProperty.price, 'USD', language)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {/* 查看详情按钮 */}
                  <Button 
                    onClick={() => onPropertyClick(currentProperty)}
                    className="bg-white/90 hover:bg-white text-black border-none shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl px-6 py-3 text-sm font-medium tracking-wide uppercase !rounded-none"
                  >
                    {language === 'zh' ? '查看详情' : 'View Details'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 轮播导航控制 - 移动到右侧中间位置 */}
      {properties.length > 1 && <>
          {/* 左右箭头按钮 - 放在右侧显眼位置 */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
            <button onClick={goToPrevious} className="w-12 h-12 bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToNext} className="w-12 h-12 bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* 底部控制区域 */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            <div className="flex items-center gap-2">
              <button onClick={toggleAutoPlay} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex gap-2">
                {properties.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`h-1 transition-all duration-500 ${index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/30'}`} />)}
              </div>
            </div>
          </div>
        </>}
      
      {/* 向下滚动引导文字 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <button onClick={() => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        nextSection?.scrollIntoView({
          behavior: 'smooth'
        });
      }} className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border border-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 text-xs tracking-wider uppercase font-light">
          {t('common.scrollToLearnMore')}
        </button>
      </div>

      {/* 进度条 */}
      {isAutoPlaying && properties.length > 1 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground/5 z-30">
          <motion.div className="h-full bg-foreground/20" initial={{
        width: '0%'
      }} animate={{
        width: '100%'
      }} transition={{
        duration: 8,
        ease: 'linear'
      }} key={currentIndex} />
        </div>}
    </section>;
}