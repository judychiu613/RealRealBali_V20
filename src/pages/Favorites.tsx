import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Grid, List } from 'lucide-react';
import { Property } from '@/lib/index';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { IMAGES } from '@/assets/images';

export default function Favorites() {
  const { language } = useApp();

  // 设置页面标题
  useEffect(() => {
    document.title = language === 'zh' 
      ? '我的收藏 - REAL REAL'
      : 'My Favorites - REAL REAL';
  }, [language]);
  const { user, loading: authLoading } = useAuth();
  
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshKey, setRefreshKey] = useState(0); // 用于刷新收藏列表

  const translations = {
    zh: {
      title: '我的收藏',
      subtitle: '您收藏的房源',
      noFavorites: '您还没有收藏任何房源',
      noFavoritesDesc: '浏览房源并点击心形图标来收藏您喜欢的房产',
      searchPlaceholder: '搜索收藏的房源...',
      loading: '加载中...',
      browseProperties: '浏览房源',
      found: '找到',
      properties: '个房源'
    },
    en: {
      title: 'My Favorites',
      subtitle: 'Your saved properties',
      noFavorites: 'You haven\'t saved any properties yet',
      noFavoritesDesc: 'Browse properties and click the heart icon to save your favorites',
      searchPlaceholder: 'Search your favorites...',
      loading: 'Loading...',
      browseProperties: 'Browse Properties',
      found: 'Found',
      properties: 'properties'
    }
  };

  const t = translations[language];

  // 根据实际表结构的收藏房源获取函数
  const fetchFavoriteProperties = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('=== 使用实际表结构获取收藏房源 ===');
      setLoading(true);
      
      console.log('用户信息:', { email: user?.email, id: user?.id });
      
      // 步骤 1：获取收藏的 property_id 列表
      console.log('步骤 1: 获取收藏的 property_id 列表...');
      
      const { data: favoriteIds, error: favoritesError } = await supabase
        .from('user_favorites_map')
        .select('property_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (favoritesError) {
        console.error('获取收藏 ID 列表错误:', favoritesError);
        throw favoritesError;
      }
      
      console.log('步骤 1 结果:', {
        count: favoriteIds?.length || 0,
        ids: favoriteIds?.map(item => item.property_id) || []
      });
      
      if (!favoriteIds || favoriteIds.length === 0) {
        console.log('没有找到收藏记录');
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }
      
      // 提取 property_id 列表
      const propertyIds = favoriteIds.map(item => item.property_id);
      
      console.log('步骤 2: 用 property_id 列表查询 properties 表（只使用存在的字段）...');
      
      // 使用与房源页面相同的查询方式（查询所有字段）
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds)
        .eq('is_published', true);
      
      if (propertiesError) {
        console.error('查询 properties 表错误:', propertiesError);
        console.error('错误详情:', {
          code: propertiesError.code,
          message: propertiesError.message,
          details: propertiesError.details,
          hint: propertiesError.hint
        });
        throw propertiesError;
      }
      
      console.log('步骤 2 结果:', {
        count: propertiesData?.length || 0,
        foundIds: propertiesData?.map(p => p.id) || []
      });
      
      if (!propertiesData || propertiesData.length === 0) {
        console.log('没有找到匹配的房源数据');
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }
      
      console.log('步骤 3: 获取区域映射信息...');
      
      // 获取区域映射信息（与 Edge Function 保持一致）
      const { data: areas } = await supabase
        .from('property_areas_map')
        .select('id, name_en, name_zh');
      
      const { data: landZones } = await supabase
        .from('land_zones_map')
        .select('id, name_en, name_zh');
      
      // 按照房源创建时间排序（与 Properties 页面保持一致）
      const sortedProperties = propertiesData.sort((a, b) => {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
      
      console.log('步骤 4: 使用 Edge Function 相同的数据处理逻辑...');
      
      // 获取房源图片的辅助函数（与 Edge Function 相同）
      const getPropertyImages = async (propertyId: string) => {
        const { data: images, error } = await supabase
          .from('property_images')
          .select('image_url, sort_order')
          .eq('property_id', propertyId)
          .order('sort_order', { ascending: true });
        
        if (error) {
          console.error('Error fetching property images:', error);
          return [];
        }
        
        return images || [];
      };
      
      // 使用与 Edge Function 相同的数据处理逻辑
      const processedProperties = await Promise.all(
        sortedProperties.map(async (property: any) => {
          // 获取房源图片
          const propertyImages = await getPropertyImages(property.id);
          const imageUrls = propertyImages.map(img => img.image_url);
          const mainImage = imageUrls[0] || property.image_url || '/images/default-property.jpg';
          
          // 添加图片信息到房源对象
          property.processed_images = imageUrls;
          property.processed_main_image = mainImage;
          
          // 添加区域信息
          const area = areas?.find(a => a.id === property.area_id);
          property.area_name_en = area?.name_en || 'Unknown';
          property.area_name_zh = area?.name_zh || '未知';
          
          // 添加土地区域信息
          const landZone = landZones?.find(lz => lz.id === property.land_zone_id);
          property.land_zone_name_en = landZone?.name_en;
          property.land_zone_name_zh = landZone?.name_zh;
          
          return property;
        })
      );
      
      // 类型映射函数（与 Edge Function 保持一致）
      const getTypeNames = (typeId: string) => {
        switch (typeId) {
          case 'villa':
            return { en: 'Villa', zh: '别墅' };
          case 'land':
            return { en: 'Land', zh: '土地' };
          default:
            return { en: 'Property', zh: '房产' };
        }
      };
      
      // 转换为 Property 类型（使用真实数据库字段）
      const formattedProperties: Property[] = processedProperties.map((property: any) => {
        const typeNames = getTypeNames(property.type_id);
        
        return {
          id: property.id,
          title: {
            zh: property.title_zh || `房源 ${property.id}`,
            en: property.title_en || `Property ${property.id}`
          },
          description: {
            zh: property.description_zh || `这是一个精美的房产。房源编号：${property.id}`,
            en: property.description_en || `This is a beautiful property. Property ID: ${property.id}`
          },
          location: {
            zh: property.area_name_zh || '未知',
            en: property.area_name_en || 'Unknown'
          },
          type: {
            zh: typeNames.zh,
            en: typeNames.en
          },
          // 使用真实数据库字段
          price: property.price_usd || 0,
          priceUSD: property.price_usd || 0,
          priceCNY: property.price_cny || 0,
          priceIDR: property.price_idr || 0,
          area_id: property.area_id || '',
          type_id: property.type_id || '',
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          landArea: property.land_area || 0,
          buildingArea: property.building_area || 0,
          buildYear: property.build_year || 0,
          image: property.processed_main_image || IMAGES.HOUSE_MODERN_1,
          images: property.processed_images.length > 0 ? property.processed_images : [property.processed_main_image || IMAGES.HOUSE_MODERN_1],
          status: property.status || 'Available',
          ownership: property.ownership || 'Freehold',
          leaseholdYears: property.leasehold_years,
          tags: property.tags_zh || ['靠海滩500米', '海景房'],
          featured: property.is_featured || false
        };
      });
      
      console.log('成功获取收藏房源:', {
        method: '使用 Edge Function 相同的数据处理逻辑',
        favoriteCount: favoriteIds.length,
        propertiesFound: formattedProperties.length,
        propertyIds: formattedProperties.map(p => p.id),
        sampleProperty: formattedProperties[0] ? {
          id: formattedProperties[0].id,
          title: formattedProperties[0].title,
          location: formattedProperties[0].location,
          price: formattedProperties[0].price,
          image: formattedProperties[0].image,
          imagesCount: formattedProperties[0].images.length
        } : null
      });
      
      // 设置调试信息
      (window as any).solutionResults = {
        method: 'edge_function_compatible',
        success: true,
        favoriteIds: propertyIds,
        propertiesFound: formattedProperties.length,
        actualFields: ['*', 'property_areas_map', 'land_zones_map', 'property_images'],
        dataProcessing: 'same_as_properties_page_with_images',
        imageProcessing: 'property_images_table_lookup',
        error: null
      };
      
      setFavoriteProperties(formattedProperties);
      
    } catch (error) {
      console.error('获取收藏房源失败:', error);
      console.error('错误详情:', {
        type: typeof error,
        message: (error as any)?.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint
      });
      
      (window as any).solutionResults = {
        method: 'failed',
        success: false,
        error: {
          message: (error as any)?.message || 'Unknown error',
          code: (error as any)?.code || 'Unknown code',
          details: (error as any)?.details || 'No details',
          fullError: error
        }
      };
      
      setFavoriteProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    console.log('=== Favorites page useEffect START ===');
    console.log('State:', { user: !!user, userEmail: user?.email, authLoading });
    
    if (!user) {
      console.log('No user, setting loading to false');
      setLoading(false);
      return;
    }
    
    console.log('User is logged in, 调用修复后的 fetchFavoriteProperties...');
    
    // 直接调用修复后的函数
    fetchFavoriteProperties().catch(error => {
      console.error('Error calling fetchFavoriteProperties:', error);
      setLoading(false);
    });
    
    console.log('=== Favorites page useEffect END ===');
  }, [user]);
  
  // 定期检查收藏列表是否有变化（用户可能在其他页面取消收藏）
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('Refreshing favorites list...');
      fetchFavoriteProperties();
    }, 10000); // 每10秒检查一次
    
    return () => clearInterval(interval);
  }, [user]);

  // 搜索过滤（只搜索 title_zh、title_en）
  const filteredProperties = favoriteProperties.filter(property => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      property.title.zh.toLowerCase().includes(searchLower) ||
      property.title.en.toLowerCase().includes(searchLower)
    );
  });

  // 如果认证还在加载中，显示加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-light text-foreground">
            {language === 'zh' ? '请先登录' : 'Please Login First'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'zh' ? '登录后查看您的收藏' : 'Login to view your favorites'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="luxury-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-3xl md:text-4xl font-light text-foreground">
                {t.title}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {t.subtitle}
            </p>

          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="luxury-container py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        ) : favoriteProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-6"
          >
            <Heart className="w-24 h-24 text-muted-foreground/50 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-foreground">
                {t.noFavorites}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t.noFavoritesDesc}
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/properties'}
              className="mt-6"
            >
              {t.browseProperties}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t.found} {filteredProperties.length} {t.properties}
                </span>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'zh' ? '没有找到匹配的房源' : 'No matching properties found'}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PropertyCard 
                      property={property} 
                      showFavoriteButton={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}