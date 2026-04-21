import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { BALI_AREAS } from '@/data/index';
import { cn } from '@/lib/utils';
import { springPresets } from '@/lib/motion';

/**
 * 重新设计的区域探索组件 - 卡片式布局
 * 支持悬停效果和移动端滑动
 */
export function AreaExploration() {
  const { language } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 检查滚动状态
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  // 滚动控制
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // 触摸滑动支持
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canScrollRight) {
      scrollRight();
    }
    if (isRightSwipe && canScrollLeft) {
      scrollLeft();
    }
  };

  return (
    <section className="luxury-section bg-background overflow-hidden border-t border-border/40" id="areas">
      <div className="luxury-container">
        {/* Header Section */}
        <div className="flex flex-col mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[1px] w-10 bg-primary/30" />
            <span className="luxury-caption text-primary/50 tracking-[0.1em] font-medium">
              {language === 'zh' ? '地理志' : 'REGIONAL GUIDE'}
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl lg:text-5xl luxury-heading font-light tracking-tight leading-[1.1]"
            >
              {language === 'zh' ? '巴厘岛顶级区域概览' : 'Premier Regions of Bali'}
            </motion.h2>

            {/* 桌面端滚动按钮 */}
            <div className="hidden md:flex items-center gap-4 pb-1">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={cn(
                  "group p-3 md:p-4 border border-primary/10 hover:border-primary/40 transition-colors",
                  !canScrollLeft && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={cn(
                  "group p-3 md:p-4 border border-primary/10 hover:border-primary/40 transition-colors",
                  !canScrollRight && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* 卡片式区域展示 */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {BALI_AREAS.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex-shrink-0 w-80 md:w-96 h-80 md:h-96 overflow-hidden cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 背景图片 */}
                <div className="absolute inset-0">
                  <img
                    src={area.image}
                    alt={area.name[language]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* 默认渐变蒙层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* 悬停时的黑色蒙层 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/70"
                />

                {/* 底部基本信息（始终显示） */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-white/60 tracking-wider">
                      {area.index}
                    </span>
                    <div className="h-px flex-1 bg-white/20" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                    {area.name[language]}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-mono">
                      {area.coordinates.lat.toFixed(2)}°S, {area.coordinates.lng.toFixed(2)}°E
                    </span>
                  </div>
                </div>

                {/* 悬停时显示的详细信息 */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center items-center text-center"
                    >
                      <div className="space-y-4 max-w-xs">
                        <h3 className="text-2xl md:text-3xl font-light text-white">
                          {area.name?.[language] || area.name?.zh || area.name?.en || ''}
                        </h3>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed">
                          {area.description?.[language] || area.description?.zh || area.description?.en || ''}
                        </p>
                        <div className="space-y-2">
                          {(area.highlights?.[language] || area.highlights?.zh || area.highlights?.en || []).slice(0, 3).map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-white/80">
                              <div className="w-1 h-1 bg-white/60 rounded-full" />
                              <span className="text-xs md:text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                        <button className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group">
                          <span>{language === 'zh' ? '探索房产' : 'Explore Properties'}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* 移动端滑动提示 */}
          <div className="md:hidden mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {language === 'zh' ? '左右滑动查看更多区域' : 'Swipe to explore more regions'}
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}