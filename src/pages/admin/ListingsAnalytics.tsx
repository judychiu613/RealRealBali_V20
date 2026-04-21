import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Eye, 
  Heart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface ListingStats {
  totalListings: number;
  publishedListings: number;
  pendingListings: number;
  averagePrice: number;
  totalViews: number;
  totalFavorites: number;
  topPerformingListings: any[];
  listingsByType: { [key: string]: number };
  listingsByArea: { [key: string]: number };
}

const ListingsAnalytics: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [stats, setStats] = useState<ListingStats>({
    totalListings: 0,
    publishedListings: 0,
    pendingListings: 0,
    averagePrice: 0,
    totalViews: 0,
    totalFavorites: 0,
    topPerformingListings: [],
    listingsByType: {},
    listingsByArea: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListingStats();
  }, []);

  const fetchListingStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取房源数据
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*');

      if (propertiesError) {
        throw propertiesError;
      }

      // 获取浏览数据
      const { data: views, error: viewsError } = await supabase
        .from('user_views')
        .select('property_id');

      // 获取收藏数据
      const { data: favorites, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('property_id');

      // 计算统计数据
      const totalListings = properties?.length || 0;
      const publishedListings = properties?.filter(p => p.status === 'available').length || 0;
      const pendingListings = properties?.filter(p => p.approval_status === 'pending').length || 0;
      
      const averagePrice = properties?.length > 0 
        ? Math.round(properties.reduce((sum, p) => sum + (p.price_usd || 0), 0) / properties.length)
        : 0;

      const totalViews = views?.length || 0;
      const totalFavorites = favorites?.length || 0;

      // 按类型统计
      const listingsByType: { [key: string]: number } = {};
      properties?.forEach(property => {
        const type = property.type_id || 'unknown';
        listingsByType[type] = (listingsByType[type] || 0) + 1;
      });

      // 按区域统计
      const listingsByArea: { [key: string]: number } = {};
      properties?.forEach(property => {
        const area = property.area_id || 'unknown';
        listingsByArea[area] = (listingsByArea[area] || 0) + 1;
      });

      // 计算每个房源的浏览和收藏数
      const propertyStats = properties?.map(property => {
        const viewCount = views?.filter(v => v.property_id === property.id).length || 0;
        const favoriteCount = favorites?.filter(f => f.property_id === property.id).length || 0;
        return {
          ...property,
          viewCount,
          favoriteCount,
          engagementScore: viewCount + favoriteCount * 3 // 收藏权重更高
        };
      }) || [];

      // 排序获取表现最好的房源
      const topPerformingListings = propertyStats
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 5);

      setStats({
        totalListings,
        publishedListings,
        pendingListings,
        averagePrice,
        totalViews,
        totalFavorites,
        topPerformingListings,
        listingsByType,
        listingsByArea
      });

    } catch (err: any) {
      console.error('Error fetching listing stats:', err);
      setError(err.message || 'Failed to fetch listing analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (typeId: string) => {
    const typeLabels: { [key: string]: string } = {
      'villa': '别墅',
      'land': '土地',
      'unknown': '未知'
    };
    return typeLabels[typeId] || typeId;
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-8">
        <p>只有超级管理员可以访问此页面</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">房源表现分析</h1>
        <Badge variant="secondary" className="text-sm">
          <Building2 className="w-4 h-4 mr-1" />
          {stats.totalListings} 个房源
        </Badge>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总房源数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已发布</p>
                <p className="text-2xl font-bold text-green-600">{stats.publishedListings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均价格</p>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(stats.averagePrice)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总浏览量</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 房源类型分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              房源类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.listingsByType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getTypeLabel(type)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalListings) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 区域分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              区域分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.listingsByArea)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([area, count]) => (
                <div key={area} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{area}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalListings) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 表现最佳房源 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            表现最佳房源
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topPerformingListings.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{property.title_zh}</h4>
                    <p className="text-sm text-gray-500">{property.title_en}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getTypeLabel(property.type_id)} • {property.area_id}
                      </span>
                      <span className="text-xs font-medium text-green-600">
                        {formatPrice(property.price_usd)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{property.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{property.favoriteCount}</span>
                  </div>
                  <Badge variant="secondary">
                    评分: {property.engagementScore}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingsAnalytics;