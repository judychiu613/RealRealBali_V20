import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LOCATION_FILTERS } from '@/lib/index';

interface AreaLabel {
  zh: string;
  en: string;
}

interface ChildArea {
  id: string;
  label: AreaLabel;
}

interface ParentArea {
  id: string;
  label: AreaLabel;
  children?: ChildArea[];
}

interface AreasContextType {
  areas: ParentArea[];
  loading: boolean;
  getAreaNameById: (areaId: string, language: 'zh' | 'en') => string;
}

const AreasContext = createContext<AreasContextType | undefined>(undefined);

export function AreasProvider({ children }: { children: ReactNode }) {
  const [areas, setAreas] = useState<ParentArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        
        // 从 property_areas_map 表获取区域数据
        const { data: areasData, error } = await supabase
          .from('property_areas_map')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching areas:', error);
          setAreas([]);
          return;
        }

        // 构建层级结构
        const parentAreas = areasData?.filter(area => area.parent_id === null) || [];
        const childAreas = areasData?.filter(area => area.parent_id !== null) || [];

        const hierarchicalAreas = parentAreas.map(parent => ({
          id: parent.id,
          label: {
            zh: parent.name_zh,
            en: parent.name_en
          },
          children: childAreas
            .filter(child => child.parent_id === parent.id)
            .map(child => ({
              id: child.id,
              label: {
                zh: child.name_zh,
                en: child.name_en
              }
            }))
        }));

        // 按指定顺序排列一级区域
        const desiredOrder = [
          '西海岸核心区',
          '南部悬崖区',
          '西部新兴增长区',
          '乌布及中部区域',
          '东巴厘岛',
          '北巴厘岛',
          '离岛区域'
        ];

        const sortedAreas = hierarchicalAreas.sort((a, b) => {
          const indexA = desiredOrder.indexOf(a.label.zh);
          const indexB = desiredOrder.indexOf(b.label.zh);

          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

        setAreas(sortedAreas);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  // 根据 area_id 获取区域名称（只返回二级区域名称）
  const getAreaNameById = (areaId: string, language: 'zh' | 'en'): string => {
    // 清理 areaId，去除空格和换行符
    const cleanAreaId = areaId?.trim();
    
    // 如果数据还在加载或为空，使用静态数据作为后备
    const areasToUse = areas.length > 0 ? areas : LOCATION_FILTERS;
    
    // 遍历所有一级分类
    for (const parentArea of areasToUse) {
      // 检查是否是一级分类ID（不应该直接显示一级分类）
      if (parentArea.id === cleanAreaId) {
        return parentArea.label?.[language] || parentArea.label?.zh || parentArea.label?.en || cleanAreaId;
      }

      // 检查二级区域
      if (parentArea.children) {
        for (const childArea of parentArea.children) {
          if (childArea.id === cleanAreaId) {
            // 只返回二级区域名称
            return childArea.label?.[language] || childArea.label?.zh || childArea.label?.en || cleanAreaId;
          }
        }
      }
    }

    // 如果没找到，返回原始ID
    return cleanAreaId;
  };

  return (
    <AreasContext.Provider value={{ areas, loading, getAreaNameById }}>
      {children}
    </AreasContext.Provider>
  );
}

export function useAreas() {
  const context = useContext(AreasContext);
  if (context === undefined) {
    throw new Error('useAreas must be used within an AreasProvider');
  }
  return context;
}
