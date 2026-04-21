import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ROUTE_PATHS, Language } from '@/lib';

interface ServiceData {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: React.ReactNode;
}

/**
 * Redesigned ServiceCard with elegant hover effects and a mouse-tracking spotlight.
 * Guides users directly to the main services page as per requirement.
 */
export function ServiceCard({ service }: { service: any }) {
  const { language } = useApp();
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const typedService = service as ServiceData;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      500px circle at ${mouseX}px ${mouseY}px,
      rgba(0, 0, 0, 0.04),
      transparent 80%
    )
  `;

  const handleClick = () => {
    navigate(ROUTE_PATHS.ABOUT(language));
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer overflow-hidden border border-black/5 bg-white p-10 transition-all duration-700 hover:border-black/10"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlightBackground }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Icon Container */}
        <div className="mb-10">
          <div className="flex h-14 w-14 items-center justify-center bg-secondary text-primary transition-all duration-500 ease-out group-hover:bg-primary group-hover:text-primary-foreground group-hover:-translate-y-1 group-hover:rotate-6">
            <div className="h-7 w-7 transition-transform duration-500 group-hover:scale-110">
              {typedService.icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="luxury-heading mb-4 text-2xl tracking-tight transition-colors duration-500 group-hover:text-primary">
            {typedService.title?.[language as Language] || typedService.title?.zh || typedService.title?.en || ''}
          </h3>
          <p className="luxury-body text-base leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-foreground/80">
            {typedService.description?.[language as Language] || typedService.description?.zh || typedService.description?.en || ''}
          </p>
        </div>

        {/* Bottom Action Area */}
        <div className="mt-12 flex items-center justify-between border-t border-black/5 pt-6">
          <span className="luxury-caption text-[10px] text-muted-foreground transition-colors duration-500 group-hover:text-primary">
            {language === 'zh' ? '了解专业详情' : 'LEARN MORE'}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          </div>
        </div>
      </div>

      {/* Elegant Border Animation */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary/30 transition-all duration-1000 ease-out group-hover:w-full" />
    </motion.div>
  );
}
