import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyTag {
  tag_key: string;
  name: string;
  category: string;
  sort_order: number;
}

export function usePropertyTags(language: 'zh' | 'en' = 'zh') {
  const [tags, setTags] = useState<PropertyTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, [language]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .rpc('get_property_tags', { language_code: language });

      if (fetchError) {
        throw fetchError;
      }

      setTags(data || []);
    } catch (err) {
      console.error('Error fetching property tags:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      
      // 提供fallback数据
      const fallbackTags: PropertyTag[] = [
        { tag_key: 'beach_500m', name: language === 'zh' ? '靠海滩500米' : 'Within 500m of Beach', category: 'location', sort_order: 1 },
        { tag_key: 'ocean_view', name: language === 'zh' ? '海景房' : 'Ocean View', category: 'location', sort_order: 2 },
        { tag_key: 'nature_view', name: language === 'zh' ? '自然风景房' : 'Nature View', category: 'location', sort_order: 3 },
        { tag_key: 'private_beach', name: language === 'zh' ? '私人沙滩' : 'Private Beach', category: 'location', sort_order: 4 },
        { tag_key: 'mountain_view', name: language === 'zh' ? '山景房' : 'Mountain View', category: 'location', sort_order: 5 },
        { tag_key: 'rice_field_view', name: language === 'zh' ? '稻田景观' : 'Rice Field View', category: 'location', sort_order: 6 },
        { tag_key: 'city_center', name: language === 'zh' ? '市中心' : 'City Center', category: 'location', sort_order: 7 },
        { tag_key: 'golf_course', name: language === 'zh' ? '高尔夫球场' : 'Golf Course', category: 'amenity', sort_order: 10 },
        { tag_key: 'hot_spring_resort', name: language === 'zh' ? '温泉度假村' : 'Hot Spring Resort', category: 'amenity', sort_order: 11 }
      ];
      setTags(fallbackTags);
    } finally {
      setLoading(false);
    }
  };

  // 根据分类获取标签
  const getTagsByCategory = (category: string) => {
    return tags.filter(tag => tag.category === category);
  };

  // 根据tag_key获取标签名称
  const getTagName = (tagKey: string) => {
    const tag = tags.find(t => t.tag_key === tagKey);
    return tag?.name || tagKey;
  };

  // 将中文标签转换为tag_key（用于向后兼容）
  const getTagKeyFromChineseName = (chineseName: string) => {
    const tagMap: Record<string, string> = {
      '靠海滩500米': 'beach_500m',
      '海景房': 'ocean_view',
      '自然风景房': 'nature_view',
      '私人沙滩': 'private_beach',
      '山景房': 'mountain_view',
      '稻田景观': 'rice_field_view',
      '市中心': 'city_center',
      '高尔夫球场': 'golf_course',
      '温泉度假村': 'hot_spring_resort',
      '生态建筑': 'eco_building',
      '瑜伽空间': 'yoga_space',
      '冲浪': 'surfing',
      '私人花园': 'private_garden',
      '私人码头': 'private_dock',
      '直升机停机坪': 'helipad',
      '私人瀑布': 'private_waterfall',
      '无边际泳池': 'infinity_pool',
      '管家服务': 'butler_service',
      '艺术工作室': 'art_studio',
      '高天花板': 'high_ceiling',
      '水上运动': 'water_sports',
      '禅意花园': 'zen_garden',
      '茶室': 'tea_room',
      '历史建筑': 'historic_building',
      '私人博物馆': 'private_museum',
      '湖景房': 'lake_view'
    };
    return tagMap[chineseName] || chineseName;
  };

  return {
    tags,
    loading,
    error,
    getTagsByCategory,
    getTagName,
    getTagKeyFromChineseName,
    refetch: fetchTags
  };
}