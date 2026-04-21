import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { BedDouble, Bath, Maximize, Home, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Property, TRANSLATIONS, formatPriceWithCurrency, formatDatabasePrice, formatLandPrice, ROUTE_PATHS } from '@/lib/index';
import { usePropertyTags } from '@/hooks/usePropertyTags';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAreas } from '@/contexts/AreasContext';
import { useSimpleViewTracking } from '@/hooks/useViewTracking';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
  showFavoriteButton?: boolean; // 控制是否显示收藏按钮
}

/**
 * 房产展示卡片组件
 * 严格遵循统一字号规范：仅使用 text-lg 与 text-sm
 * 采用静奢极简风设计，支持多语言切换与动态货币转换
 */
export function PropertyCard({
  property,
  showFavoriteButton = true
}: PropertyCardProps) {
  const {
    language,
    currency
  } = useApp();
  const { getAreaNameById } = useAreas();
  const { user } = useAuth();
  
  // 收藏功能 - 使用直接Supabase操作
  const addToFavorites = async (propertyId: string) => {
    try {
      if (!user) return { error: 'User not logged in' };
      
      console.log('Adding to favorites:', propertyId, 'for user:', user.id);
      
      const { error } = await supabase
        .from('user_favorites_map')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });
      
      if (error) {
        console.error('Error adding to favorites:', error);
        return { error };
      }
      
      console.log('Successfully added to favorites:', propertyId);
      return { error: null };
    } catch (error) {
      console.error('Exception adding to favorites:', error);
      return { error };
    }
  };
  
  const removeFromFavorites = async (propertyId: string) => {
    try {
      if (!user) return { error: 'User not logged in' };
      
      console.log('Removing from favorites:', propertyId, 'for user:', user.id);
      
      const { error } = await supabase
        .from('user_favorites_map')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (error) {
        console.error('Error removing from favorites:', error);
        return { error };
      }
      
      console.log('Successfully removed from favorites:', propertyId);
      return { error: null };
    } catch (error) {
      console.error('Exception removing from favorites:', error);
      return { error };
    }
  };
  
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language].propertyCard;
  
  // 标签翻译
  const { getTagName, getTagKeyFromChineseName } = usePropertyTags(language);

  // 图片切换状态
  const images = property.images || [property.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // 移动端滑动状态
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 收藏状态
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [realDescription, setRealDescription] = useState<{zh: string, en: string} | null>(null);

  // 浏览追踪
  useSimpleViewTracking(property.id, 'listing');

  // 获取真实数据库描述
  useEffect(() => {
    const fetchRealDescription = async () => {
      try {
        const response = await fetch('https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/all_descriptions_2026_03_04_14_00');
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const record = result.data.find((r: any) => r.id === property.id);
          if (record && (record.description_zh || record.description_en)) {
            setRealDescription({
              zh: record.description_zh || '',
              en: record.description_en || ''
            });
            console.log('Got real description for', property.id, ':',
              { zh: record.description_zh, en: record.description_en });
          }
        }
      } catch (error) {
        console.error('Error fetching description:', error);
      }
    };
    
    fetchRealDescription();
  }, [property.id]);

  // 检查收藏状态 - 使用直接Supabase查询
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsLiked(false);
        return;
      }
      
      try {
        console.log('Checking favorite status for property:', property.id, 'user:', user.id);
        
        // 直接查询user_favorites_map表
        const { data, error } = await supabase
          .from('user_favorites_map')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking favorite status:', error);
          setIsLiked(false);
          return;
        }
        
        const isFavorited = !!data;
        setIsLiked(isFavorited);
        console.log('Favorite status for', property.id, ':', isFavorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsLiked(false);
      }
    };
    
    checkFavorite();
  }, [property.id, user]);

  // 收藏状态现在直接使用缓存，无需 useEffect
  // 处理收藏功能
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡到卡片点击

    console.log('Favorite button clicked', { user: !!user, property: property.id, isLiked });

    if (!user) {
      // 未登录用户引导到登录页面，携带当前页面信息
      const currentPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!property) return;
    
    setFavoriteLoading(true);
    try {
      if (isLiked) {
        console.log('Removing from favorites:', property.id);
        const { error } = await removeFromFavorites(property.id);
        if (error) {
          console.error('Error removing from favorites:', error);
        } else {
          console.log('Successfully removed from favorites:', property.id);
          setIsLiked(false); // Update local state
        }
      } else {
        console.log('Adding to favorites:', property.id);
        const { error } = await addToFavorites(property.id);
        if (error) {
          console.error('Error adding to favorites:', error);
        } else {
          console.log('Successfully added to favorites:', property.id);
          setIsLiked(true); // Update local state
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 切换到上一张图片
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    setImageError(false);
    setImageLoading(true);
  };

  // 切换到下一张图片
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    setImageError(false);
    setImageLoading(true);
  };
  
  // 移动端滑动处理函数
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
    
    if (isLeftSwipe && images.length > 1) {
      // 左滑，下一张
      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
      setImageError(false);
      setImageLoading(true);
    }
    
    if (isRightSwipe && images.length > 1) {
      // 右滑，上一张
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
      setImageError(false);
      setImageLoading(true);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: "-50px"
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group h-full cursor-pointer"
      onClick={() => navigate(ROUTE_PATHS.PROPERTY_DETAIL(language, property.slug || property.id))}
    >
      {/* 移动端间距移至卡片底部 */}
      <Card className="h-full overflow-hidden bg-transparent border-none shadow-none flex flex-col md:flex-col">
        {/* 视觉封面区域 */}
        <div 
          className="relative aspect-video overflow-hidden bg-muted md:block" 
          onTouchStart={onTouchStart} 
          onTouchMove={onTouchMove} 
          onTouchEnd={onTouchEnd}
        >
          {/* 移动端滑动支持 */}
          {imageLoading && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-sm">加载中...</div>
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mb-2">
                <Home className="w-6 h-6 text-muted-foreground/60" />
              </div>
              <div className="text-muted-foreground text-sm font-light">
                {language === 'zh' ? '图片暂时不可用' : 'Image temporarily unavailable'}
              </div>
            </div>
          ) : (
            <motion.img
              src={images[currentImageIndex]}
              alt={property.title?.[language] || property.title?.zh || property.title?.en || ''}
              className="h-full w-full object-cover luxury-image"
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                // 尝试下一张图片，如果所有图片都失败则显示错误
                if (currentImageIndex < images.length - 1) {
                  setCurrentImageIndex(prev => prev + 1);
                  setImageLoading(true);
                } else {
                  setImageError(true);
                  setImageLoading(false);
                }
                console.error('Image failed to load:', images[currentImageIndex]);
              }}
              whileHover={{
                scale: 1.05
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }}
            />
          )}

          {/* 图片切换按钮 - 仅在有多张图片时显示 */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white text-black border-none shadow-sm rounded-none flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white text-black border-none shadow-sm rounded-none flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20"
              >
                <ChevronRight className="w-3 h-3" />
              </button>

              {/* 图片指示器 */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                      setImageError(false);
                      setImageLoading(true);
                    }}
                    className={`w-1 h-1 rounded-none transition-colors duration-300 cursor-pointer ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 状态标签 - 使用tags-zh/tags-en字段 */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
            <div className="flex gap-1">
              {(() => {
                const tags = [];
                
                // 添加精选推荐标签
                if (property.featured) {
                  tags.push(
                    <div key="featured" className="bg-black text-white text-xs px-1.5 py-0.5 font-medium">
                      {t.featured}
                    </div>
                  );
                }
                
                // 添加tags_zh或tags_en标签，总数不超过3个
                // 使用数据库中的真实标签数据
                const propertyTags = language === 'zh' 
                  ? (property.tags_zh || property.tags || [])
                  : (property.tags_en || property.tags || []);
                if (propertyTags && Array.isArray(propertyTags)) {
                  const remainingSlots = 3 - tags.length;
                  propertyTags.slice(0, remainingSlots).forEach((tag, index) => {
                    tags.push(
                      <div key={`tag-${index}`} className="bg-black text-white text-xs px-1.5 py-0.5 font-medium">
                        {tag}
                      </div>
                    );
                  });
                }
                
                return tags;
              })()}
            </div>
          </div>

          {/* 收藏按钮 - 右上角实心爱心设计 */}
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-pink-500 rounded-full flex items-center justify-center transition-all duration-200 z-20 shadow-md"
            >
              {favoriteLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent" />
              ) : (
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
              )}
            </button>
          )}
        </div>

        <CardContent className="p-0 flex-1 flex flex-col justify-between">
          {/* 标题与位置 - 左右对齊，與圖片对齊 */}
          <div className="px-0 pt-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-medium text-foreground line-clamp-1 flex-1">
                {property.title?.[language] || property.title?.zh || property.title?.en || ''}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                <MapPin className="w-3 h-3 opacity-60" />
                <span className="text-xs md:text-sm lg:text-base tracking-normal">
                  {property.area_id ? getAreaNameById(property.area_id, language) : property.location?.[language] || property.location?.zh || property.location?.en || ''}
                </span>
              </div>
            </div>
            
            {/* 房源描述 - 位于标题下方 */}
            <div className="mb-1">
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {(() => {
                  // 使用获取到的真实描述
                  if (realDescription) {
                    const desc = language === 'zh' ? realDescription.zh : realDescription.en;
                    if (desc) {
                      return desc;
                    }
                  }
                  
                  // 如果没有真实描述，显示默认内容
                  const isLandType = property.type_id === 'land' || 
                                   (typeof property.type === 'object' && property.type?.en === 'Land');
                  return language === 'zh' 
                    ? (isLandType ? '默认: 这是一块优质的土地' : '默认: 这是一处精美的别墅')
                    : (isLandType ? 'Default: This is a premium land' : 'Default: This is a beautiful villa');
                })()}
              </p>
            </div>
          </div>

          {/* 核心参数矩阵 - 根据房产类型显示不同信息，與圖片对齊 */}
          <div className="px-0 mb-1">
            {(() => {
              const isLand = property.type_id === 'land' || 
                            (typeof property.type === 'object' && property.type?.en === 'Land') || 
                            (typeof property.type === 'string' && (property.type as string).toLowerCase() === 'land');
              
              if (isLand) {
                // 土地类型：只显示土地面积
                return (
                  <div className="grid grid-cols-1 gap-x-1 md:gap-x-2 py-0 md:py-0.5">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Maximize className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="text-xs md:text-sm font-medium">{property.landArea}m²</span>
                    </div>
                  </div>
                );
              } else {
                // 房产类型：显示房间数、浴室数、建筑面积、土地面积
                return (
                  <div className="grid grid-cols-4 gap-x-1 md:gap-x-2 py-0 md:py-0.5">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <BedDouble className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="text-xs md:text-sm font-medium">{property.bedrooms}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Bath className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="text-xs md:text-sm font-medium">{property.bathrooms}</span>
                    </div>

                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Home className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="text-xs md:text-sm font-medium">{property.buildingArea}m²</span>
                    </div>

                    <div className="flex items-center gap-1 md:gap-1.5 justify-end">
                      <Maximize className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="text-xs md:text-sm font-medium">{property.landArea}m²</span>
                    </div>
                  </div>
                );
              }
          })()}
          </div>
          
        </CardContent>

        {/* 底部价格与动作栏 - 左右对齊 */}
        <CardFooter className="px-0 pb-4 md:pb-2 pt-1"> {/* 移动端底部间距优化 */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs md:text-sm font-medium font-mono text-foreground">
              {/* 根据房产类型显示不同的价格格式 */}
              {property.type?.en === 'Land' || property.type?.zh === '土地' ?
                // 土地类型也显示总价
                currency === 'CNY' && property.priceCNY ? 
                  formatDatabasePrice(property.priceCNY, 'CNY', language) :
                currency === 'IDR' && property.priceIDR ? 
                  formatDatabasePrice(property.priceIDR, 'IDR', language) :
                  formatDatabasePrice(property.priceUSD || property.price, 'USD', language) :
                // 非土地类型显示总价
                currency === 'CNY' && property.priceCNY ? 
                  formatDatabasePrice(property.priceCNY, 'CNY', language) :
                currency === 'IDR' && property.priceIDR ? 
                  formatDatabasePrice(property.priceIDR, 'IDR', language) :
                  formatDatabasePrice(property.priceUSD || property.price, 'USD', language)
              }
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              {(property.ownership?.toLowerCase() === 'freehold') ? t.freehold : t.leasehold}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}