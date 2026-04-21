import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Building2, 
  Landmark, 
  ChevronDown, 
  FilterX,
  Tag
} from 'lucide-react';
import { 
  Property, 
  PropertyTag, 
  TRANSLATIONS, 
  Language,
  LOCATION_FILTERS,
  PROPERTY_TYPE_FILTERS,
  FilterOption
} from '@/lib/index';
import { supabase } from '@/integrations/supabase/client';
import { PropertyCard } from '@/components/PropertyCard';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Animation Variants
 */
const springTransition = { type: 'spring', stiffness: 300, damping: 30 };
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springTransition }
};

export default function Properties() {
  const { language } = useApp();
  const t = TRANSLATIONS[language as Language];
  
  // 数据库状态
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从数据库获取房产数据
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/property_api_updated_2026_02_21_18_00/properties`, {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXNwcGJzeHNseXV6Y2lmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTMxNTQsImV4cCI6MjA4NzIyOTE1NH0.uYXE5mkbGL24gL5Z1n9wxIXtC-P1QuBYGH8M_nvQsOI`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        

        setProperties(result.data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<PropertyTag[]>([]);
  
  // 新增：房间数量和土地面积筛选
  const [minBedrooms, setMinBedrooms] = useState<string>('');
  const [minLandArea, setMinLandArea] = useState<string>('');
  const [maxLandArea, setMaxLandArea] = useState<string>('');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // 二级筛选展开状态
  const [expandedLocationGroups, setExpandedLocationGroups] = useState<string[]>([]);
  const [expandedTypeGroups, setExpandedTypeGroups] = useState<string[]>([]);

  // Extract dynamic filter options from data
  const locations = useMemo(() => {
    const locs = properties.map(p => 
      typeof p.location === 'string' ? p.location : p.location[language as Language]
    );
    return Array.from(new Set(locs));
  }, [properties, language]);

  const types = useMemo(() => {
    const typs = properties.map(p => 
      typeof p.type === 'string' ? p.type : p.type[language as Language]
    );
    return Array.from(new Set(typs));
  }, [properties, language]);

  const allTags: PropertyTag[] = [
    '靠海滩500米', '海景房', '自然风景房', '私人沙滩', '山景房', '稻田景观', '市中心', '高尔夫球场', '温泉度假村'
  ];

  // 辅助函数：检查房产是否匹配二级筛选条件
  const matchesFilterOptions = (propertyValue: string, selectedIds: string[], filterOptions: FilterOption[]) => {
    if (selectedIds.length === 0) return true;
    
    // 检查是否匹配一级或二级选项
    for (const selectedId of selectedIds) {
      // 查找匹配的选项
      for (const option of filterOptions) {
        // 检查一级匹配
        if (option.id === selectedId && 
            (option.label[language as Language].toLowerCase() === propertyValue.toLowerCase() ||
             option.label.zh.toLowerCase() === propertyValue.toLowerCase() ||
             option.label.en.toLowerCase() === propertyValue.toLowerCase())) {
          return true;
        }
        
        // 检查二级匹配
        if (option.children) {
          for (const child of option.children) {
            if (child.id === selectedId && 
                (child.label[language as Language].toLowerCase() === propertyValue.toLowerCase() ||
                 child.label.zh.toLowerCase() === propertyValue.toLowerCase() ||
                 child.label.en.toLowerCase() === propertyValue.toLowerCase())) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  };

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const title = typeof property.title === 'string' ? property.title : property.title[language as Language];
      const location = typeof property.location === 'string' ? property.location : property.location[language as Language];
      const type = typeof property.type === 'string' ? property.type : property.type[language as Language];

      const matchesSearch = 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = matchesFilterOptions(location, selectedLocations, LOCATION_FILTERS);
      const matchesType = matchesFilterOptions(type, selectedTypes, PROPERTY_TYPE_FILTERS);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(property.status);
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => property.tags?.includes(tag));
      
      // 新增：房间数量筛选
      const matchesBedrooms = !minBedrooms || property.bedrooms >= parseInt(minBedrooms);
      
      // 新增：土地面积筛选
      const matchesMinLandArea = !minLandArea || property.landArea >= parseInt(minLandArea);
      const matchesMaxLandArea = !maxLandArea || property.landArea <= parseInt(maxLandArea);

      return matchesSearch && matchesLocation && matchesType && matchesStatus && matchesTags && matchesBedrooms && matchesMinLandArea && matchesMaxLandArea;
    });
  }, [properties, searchQuery, selectedLocations, selectedTypes, selectedStatuses, selectedTags, minBedrooms, minLandArea, maxLandArea, language]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocations([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    // 新增：清除房间数量和土地面积筛选
    setMinBedrooms('');
    setMinLandArea('');
    setMaxLandArea('');
    setExpandedLocationGroups([]);
    setExpandedTypeGroups([]);
  };

  const handleTagToggle = (tag: PropertyTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // 处理二级筛选的展开/收起
  const toggleLocationGroup = (groupId: string) => {
    setExpandedLocationGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleTypeGroup = (groupId: string) => {
    setExpandedTypeGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 处理二级筛选选择
  const handleFilterOptionToggle = (optionId: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelected(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const activeFilterCount = [
    selectedLocations.length > 0,
    selectedTypes.length > 0,
    selectedStatuses.length > 0,
    selectedTags.length > 0,
    // 新增：计算房间数量和土地面积筛选
    !!minBedrooms,
    !!minLandArea,
    !!maxLandArea
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Page Header */}
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-4xl"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase !rounded-none border-primary/20 font-mono">
              {language === 'zh' ? '全球资产配置 · 2026' : 'GLOBAL ASSET PORTFOLIO · 2026'}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight luxury-heading leading-[1.1]">
              {language === 'zh' ? (
                <>
                  探索巴厘岛的<span className="italic text-muted-foreground">静谧居所</span>
                </>
              ) : (
                <>
                  Explore Bali's <span className="italic text-muted-foreground">Sanctuaries</span>
                </>
              )}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              {language === 'zh' 
                ? '从乌鲁瓦图的断崖视界到乌布的梯田秘境，我们为您精选巴厘岛最具投资价值与美学底蕴的房产资源。' 
                : 'From the cliff-top vistas of Uluwatu to the hidden rice terraces of Ubud, we curate Bali\'s most valuable and aesthetic properties.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Search & Filter Control Bar */}
      <section className="sticky top-[64px] z-40 bg-background/80 backdrop-blur-xl border-y border-border transition-all duration-300">
        <div className="container mx-auto px-4 py-1.5 md:px-6 md:py-3">
          {/* Mobile: Two-row layout, Desktop: Single-row layout */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            {/* First row on mobile: Search and Filter buttons */}
            <div className="flex flex-row gap-2 md:gap-6 items-center justify-between md:justify-start">
            {/* Search Toggle */}
            <Button
              variant="outline"
              className="h-7 w-7 md:h-9 md:w-9 border-border rounded-none hover:bg-accent luxury-interactive p-0 flex items-center justify-center flex-shrink-0"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-3 w-3 md:h-4 md:w-4" />
            </Button>

              {/* Filter Toggle */}
              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="outline"
                  className="h-7 md:h-9 px-2 md:px-4 border-border rounded-none hover:bg-accent font-light tracking-wide text-xs md:text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">{language === 'zh' ? '高级筛选' : 'Filters'}</span>
                  <span className="sm:hidden">{language === 'zh' ? '筛选' : 'Filter'}</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 md:ml-2 bg-primary text-primary-foreground text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-mono">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`ml-1 md:ml-2 h-2.5 w-2.5 md:h-3 md:w-3 transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                <div className="hidden md:flex items-center gap-2 md:gap-4 border-l border-border pl-3 md:pl-6">
                  <span className="text-xs md:text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
                    {filteredProperties.length} {language === 'zh' ? '项' : 'Results'}
                  </span>
                </div>
              </div>
            </div>

            {/* Second row: Active Filters Display (visible on all devices) */}
            {(selectedLocations.length > 0 || selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedTags.length > 0 || minBedrooms || minLandArea || maxLandArea) && (
              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide pt-2 md:pt-0">
              {selectedLocations.map((location) => (
                <Badge
                  key={`location-${location}`}
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {location}
                  <button
                    onClick={() => handleLocationToggle(location)}
                    className="ml-1 hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
              {selectedTypes.map((type) => (
                <Badge
                  key={`type-${type}`}
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-secondary/50 text-foreground border-border hover:bg-secondary/70 transition-colors"
                >
                  <Building2 className="w-3 h-3" />
                  {type}
                  <button
                    onClick={() => handleTypeToggle(type)}
                    className="ml-1 hover:bg-secondary/80 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
              {selectedStatuses.map((status) => (
                <Badge
                  key={`status-${status}`}
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-accent/50 text-accent-foreground border-accent hover:bg-accent/70 transition-colors"
                >
                  <Landmark className="w-3 h-3" />
                  {status}
                  <button
                    onClick={() => handleStatusToggle(status)}
                    className="ml-1 hover:bg-accent/80 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
              {selectedTags.map((tag) => (
                <Badge
                  key={`tag-${tag}`}
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 hover:bg-muted/80 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
              
              {/* 新增：房间数量筛选显示 */}
              {minBedrooms && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-blue/10 text-blue-600 border-blue/20 hover:bg-blue/20 transition-colors"
                >
                  <Building2 className="w-3 h-3" />
                  {minBedrooms}+ {language === 'zh' ? '房间' : 'Bedrooms'}
                  <button
                    onClick={() => setMinBedrooms('')}
                    className="ml-1 hover:bg-blue/30 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              )}
              
              {/* 新增：土地面积筛选显示 */}
              {(minLandArea || maxLandArea) && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap bg-green/10 text-green-600 border-green/20 hover:bg-green/20 transition-colors"
                >
                  <Landmark className="w-3 h-3" />
                  {minLandArea && maxLandArea 
                    ? `${minLandArea}-${maxLandArea}${language === 'zh' ? '平米' : 'sqm'}` 
                    : minLandArea 
                      ? `${minLandArea}+${language === 'zh' ? '平米' : 'sqm'}` 
                      : `<${maxLandArea}${language === 'zh' ? '平米' : 'sqm'}`
                  }
                  <button
                    onClick={() => {
                      setMinLandArea('');
                      setMaxLandArea('');
                    }}
                    className="ml-1 hover:bg-green/30 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              )}
            </div>
            )}
          </div>
          
          {/* Expandable Search Input */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-border pt-2 md:pt-4 mt-2 md:mt-4"
              >
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder={language === 'zh' ? '搜索项目名称或地段...' : 'Search by name or location...'}
                    className="pl-9 md:pl-12 h-8 md:h-12 bg-muted/20 border-none rounded-none focus-visible:ring-1 focus-visible:ring-primary/20 text-xs md:text-sm font-light"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expandable Advanced Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {/* Filter Panel Header with Close Button */}
                <div className="flex justify-between items-center py-4 border-t border-border mt-6">
                  <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
                    {language === 'zh' ? '高级筛选' : 'Advanced Filters'}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFilterOpen(false)} 
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-10 py-8">
                  {/* Location Selector - 二级筛选 */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {language === 'zh' ? '区域范围' : 'LOCATION'}
                    </label>
                    <div className="space-y-2">
                      {LOCATION_FILTERS.map((locationGroup) => (
                        <div key={locationGroup.id} className="space-y-2">
                          {/* 一级选项 */}
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`location-group-${locationGroup.id}`}
                              checked={selectedLocations.includes(locationGroup.id)}
                              onCheckedChange={() => handleFilterOptionToggle(locationGroup.id, setSelectedLocations)}
                              className="rounded-none"
                            />
                            <button
                              onClick={() => toggleLocationGroup(locationGroup.id)}
                              className="flex items-center gap-2 text-sm lg:text-base font-medium cursor-pointer hover:text-primary transition-colors flex-1 text-left"
                            >
                              <ChevronDown className={`w-3 h-3 transition-transform ${
                                expandedLocationGroups.includes(locationGroup.id) ? 'rotate-180' : ''
                              }`} />
                              {locationGroup.label[language as Language]}
                            </button>
                          </div>
                          
                          {/* 二级选项 */}
                          {expandedLocationGroups.includes(locationGroup.id) && locationGroup.children && (
                            <div className="ml-6 space-y-2">
                              {locationGroup.children.map((child) => (
                                <div key={child.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`location-${child.id}`}
                                    checked={selectedLocations.includes(child.id)}
                                    onCheckedChange={() => handleFilterOptionToggle(child.id, setSelectedLocations)}
                                    className="rounded-none"
                                  />
                                  <label
                                    htmlFor={`location-${child.id}`}
                                    className="text-sm font-light cursor-pointer hover:text-primary transition-colors"
                                  >
                                    {child.label[language as Language]}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Type Selector - 二级筛选 */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-3 h-3" /> {language === 'zh' ? '房产类型' : 'TYPE'}
                    </label>
                    <div className="space-y-2">
                      {PROPERTY_TYPE_FILTERS.map((typeGroup) => (
                        <div key={typeGroup.id} className="space-y-2">
                          {/* 一级选项 */}
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`type-group-${typeGroup.id}`}
                              checked={selectedTypes.includes(typeGroup.id)}
                              onCheckedChange={() => handleFilterOptionToggle(typeGroup.id, setSelectedTypes)}
                              className="rounded-none"
                            />
                            <button
                              onClick={() => toggleTypeGroup(typeGroup.id)}
                              className="flex items-center gap-2 text-sm lg:text-base font-medium cursor-pointer hover:text-primary transition-colors flex-1 text-left"
                            >
                              <ChevronDown className={`w-3 h-3 transition-transform ${
                                expandedTypeGroups.includes(typeGroup.id) ? 'rotate-180' : ''
                              }`} />
                              {typeGroup.label[language as Language]}
                            </button>
                          </div>
                          
                          {/* 二级选项 */}
                          {expandedTypeGroups.includes(typeGroup.id) && typeGroup.children && (
                            <div className="ml-6 space-y-2">
                              {typeGroup.children.map((child) => (
                                <div key={child.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`type-${child.id}`}
                                    checked={selectedTypes.includes(child.id)}
                                    onCheckedChange={() => handleFilterOptionToggle(child.id, setSelectedTypes)}
                                    className="rounded-none"
                                  />
                                  <label
                                    htmlFor={`type-${child.id}`}
                                    className="text-sm font-light cursor-pointer hover:text-primary transition-colors"
                                  >
                                    {child.label[language as Language]}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-4">
                    <label className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2 text-muted-foreground">
                      <Landmark className="w-3 h-3" /> {language === 'zh' ? '产权形式' : 'OWNERSHIP'}
                    </label>
                    <div className="space-y-3">
                      {['Leasehold', 'Freehold'].map((status) => (
                        <div key={status} className="flex items-center space-x-3">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => handleStatusToggle(status)}
                            className="rounded-none"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm lg:text-base font-light cursor-pointer hover:text-primary transition-colors"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 新增：房间数量筛选 */}
                <div className="space-y-4">
                  <label className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-3 h-3" /> {language === 'zh' ? '房间数量' : 'BEDROOMS'}
                  </label>
                  <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                    <SelectTrigger className="w-full h-9 text-sm border-border/50 focus:border-primary transition-colors">
                      <SelectValue placeholder={language === 'zh' ? '最少房间数' : 'Min Bedrooms'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{language === 'zh' ? '不限' : 'Any'}</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 新增：土地面积筛选 */}
                <div className="space-y-4">
                  <label className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2 text-muted-foreground">
                    <Landmark className="w-3 h-3" /> {language === 'zh' ? '土地面积' : 'LAND AREA'}
                  </label>
                  <div className="space-y-3">
                    <Select value={minLandArea} onValueChange={setMinLandArea}>
                      <SelectTrigger className="w-full h-9 text-sm border-border/50 focus:border-primary transition-colors">
                        <SelectValue placeholder={language === 'zh' ? '最小面积 (平米)' : 'Min Area (sqm)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{language === 'zh' ? '不限' : 'Any'}</SelectItem>
                        <SelectItem value="200">200+ {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="400">400+ {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="600">600+ {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="800">800+ {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="1000">1000+ {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={maxLandArea} onValueChange={setMaxLandArea}>
                      <SelectTrigger className="w-full h-9 text-sm border-border/50 focus:border-primary transition-colors">
                        <SelectValue placeholder={language === 'zh' ? '最大面积 (平米)' : 'Max Area (sqm)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{language === 'zh' ? '不限' : 'Any'}</SelectItem>
                        <SelectItem value="500">500 {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="800">800 {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="1000">1000 {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="1500">1500 {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                        <SelectItem value="2000">2000 {language === 'zh' ? '平米' : 'sqm'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tag Selection Row */}
                <div className="py-8 border-t border-border/50">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-6">
                    {language === 'zh' ? '特色标签检索' : 'PROPERTY FEATURES'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-5 py-2 text-[11px] tracking-wide border transition-all duration-300 font-light ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10'
                            : 'bg-transparent text-muted-foreground border-border hover:border-primary/40'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-6 pb-8 pt-4 border-t border-border/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="mr-2 h-3 w-3" /> {language === 'zh' ? '重置筛选' : 'Reset Filters'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsFilterOpen(false)} 
                    className="text-[10px] uppercase tracking-[0.2em] border-border hover:bg-accent transition-colors px-4 py-2"
                  >
                    <ChevronDown className="mr-2 h-3 w-3 rotate-180" /> 
                    {language === 'zh' ? '收起筛选' : 'Collapse Filters'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Grid */}
      <section className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {language === 'zh' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-destructive mb-4">
                {language === 'zh' ? '加载失败' : 'Loading failed'}: {error}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {language === 'zh' ? '重新加载' : 'Reload'}
              </Button>
            </div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property.id} variants={staggerItem}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-48 text-center"
          >
            <div className="w-24 h-24 bg-muted/20 flex items-center justify-center mb-10 luxury-border">
              <FilterX className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-3xl font-light mb-6 tracking-tight">
              {language === 'zh' ? '未找到符合条件的房产' : 'No properties match your criteria'}
            </h3>
            <p className="text-muted-foreground max-w-md font-light leading-relaxed mb-10">
              {language === 'zh' 
                ? '抱歉，目前没有房产完全符合您的筛选要求。您可以尝试减少过滤项，或联系我们的顾问获取未公开房源。' 
                : 'Apologies, no properties currently match your specific filters. Try reducing the criteria or contact our consultants for off-market listings.'}
            </p>
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="h-14 px-12 rounded-none border-primary/20 hover:border-primary tracking-[0.2em] text-xs uppercase transition-all"
            >
              {language === 'zh' ? '清除所有筛选器' : 'Clear All Filters'}
            </Button>
          </motion.div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="bg-primary text-primary-foreground p-16 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--primary-foreground)_1px,_transparent_1px)] bg-[length:32px_32px]" />
          
          <div className="max-w-2xl text-center lg:text-left relative z-10">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight leading-[1.1]">
              {language === 'zh' ? (
                <>
                  定制您的<br />独家资产方案
                </>
              ) : (
                <>
                  Bespoke Asset<br />Advisory
                </>
              )}
            </h2>
            <p className="text-primary-foreground/70 text-xl font-light leading-relaxed">
              {language === 'zh' 
                ? '我们的专家团队根据您的投资预期与生活方式，在全岛搜寻未上市的高质量物业资源。' 
                : 'Our elite team curates high-quality off-market listings based on your investment goals and lifestyle preferences.'}
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-16 px-14 text-xs tracking-[0.3em] uppercase rounded-none luxury-button bg-white text-black border-none hover:bg-white/90 transition-all"
            >
              {language === 'zh' ? '联系私人顾问' : 'Contact Consultant'}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
