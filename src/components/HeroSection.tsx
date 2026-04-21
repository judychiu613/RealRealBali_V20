import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Bed, Bath, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property, ROUTE_PATHS, formatPrice } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';

interface HeroSectionProps {
  property: Property;
}

export function HeroSection({ property }: HeroSectionProps) {
  const { language } = useApp();
  
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          src={property.image}
          alt={property.title.zh}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="luxury-container relative z-10 flex h-full flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-4xl">
          {/* Subtitle / Brand Mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="luxury-caption text-white/70">
              精选全球顶尖奢华地产
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="luxury-heading text-5xl text-white md:text-7xl lg:text-8xl"
          >
            {property.title.zh}
          </motion.h1>

          {/* Property Short Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-6 text-white/90 md:gap-12"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-mono text-sm tracking-wider uppercase">{property.location.zh}</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 opacity-70" />
                <span className="font-mono text-sm">{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 opacity-70" />
                <span className="font-mono text-sm">{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 opacity-70" />
                <span className="font-mono text-sm">{property.buildingArea}m²</span>
              </div>
            </div>
          </motion.div>

          {/* Price & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-center"
          >
            <div className="flex flex-col">
              <span className="luxury-caption text-white/50">指导价格</span>
              <span className="text-3xl font-light text-white">
                {formatPrice(property.price, 'USD')}
              </span>
            </div>

            <Link
              to={ROUTE_PATHS.PROPERTIES(language)}
              className="luxury-button flex items-center gap-3 px-10 py-5 text-sm font-medium transition-all hover:gap-5"
            >
              <span>立即探索</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute right-12 bottom-12 hidden flex-col items-center gap-4 lg:flex"
      >
        <div className="h-24 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        <span className="luxury-caption origin-bottom-right -rotate-90 text-white/30 whitespace-nowrap">
          SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}
