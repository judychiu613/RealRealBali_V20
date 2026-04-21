import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Home,
  MapPin,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  Calendar,
  Eye,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  BarChart3,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useAdminAuth, useAdminAPI } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title_zh: string;
  title_en: string;
  type_id: string;
  area_id: string;
  area_name_zh?: string;
  area_name_en?: string;
  price_usd: number;
  price_cny: number;
  price_idr: number;
  bedrooms: number;
  bathrooms: number;
  building_area: number;
  land_area: number;
  latitude: number;
  longitude: number;
  status: string;
  approval_status: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  images?: string[];
}

interface PropertyStats {
  total: number;
  villas: number;
  lands: number;
  apartments: number;
  areaDistribution: { [key: string]: { count: number; name_zh: string; name_en: string } };
  priceDistribution: {
    under100k: number;
    between100k300k: number;
    between300k500k: number;
    over500k: number;
  };
}

const AdminProperties: React.FC = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const { callAdminAPI } = useAdminAPI();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 筛选和排序状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriceRange, setFilterPriceRange] = useState('all');
  const [sortField, setSortField] = useState<'price_usd' | 'building_area' | 'land_area' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      


      // 从数据库查询房源和区域映射数据，然后在前端进行关联
      const [propertiesResult, areasMapResult] = await Promise.all([
        supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('property_areas_map')
          .select('id, name_zh, name_en')
      ]);

      const { data: propertiesData, error: propertiesError } = propertiesResult;
      const { data: areasMapData, error: areasMapError } = areasMapResult;

      if (areasMapError) {
        console.error('Areas map error:', areasMapError);
        setError('获取区域映射失败：' + areasMapError.message);
        return;
      }

      // 创建区域映射表
      const areasMap = new Map();
      (areasMapData || []).forEach(area => {
        areasMap.set(area.id, {
          name_zh: area.name_zh || area.id,
          name_en: area.name_en || area.id
        });
      });

      // 处理房源数据，添加区域信息
      const formattedProperties = (propertiesData || []).map(property => {
        const areaInfo = areasMap.get(property.area_id);
        
        return {
          ...property,
          area_name_zh: areaInfo ? areaInfo.name_zh : (property.area_id || '未知区域'),
          area_name_en: areaInfo ? areaInfo.name_en : (property.area_id || 'Unknown Area')
        };
      });

      setProperties(formattedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('获取房源列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // 查询房源数据和区域映射数据用于统计
      const [propertiesResult, areasMapResult] = await Promise.all([
        supabase
          .from('properties')
          .select('type_id, area_id, price_usd'),
        supabase
          .from('property_areas_map')
          .select('id, name_zh, name_en')
      ]);

      const { data: propertiesData, error: propertiesError } = propertiesResult;
      const { data: areasMapData, error: areasMapError } = areasMapResult;

      if (propertiesError) {
        console.error('Stats error:', propertiesError);
        return;
      }

      if (areasMapError) {
        console.error('Areas map error:', areasMapError);
        return;
      }

      // 创建区域映射表
      const areasMap = new Map();
      (areasMapData || []).forEach(area => {
        areasMap.set(area.id, {
          name_zh: area.name_zh || area.id,
          name_en: area.name_en || area.id
        });
      });

      const properties = propertiesData || [];
      
      // 计算统计数据
      const stats: PropertyStats = {
        total: properties.length,
        villas: properties.filter(p => p.type_id === 'villa').length,
        lands: properties.filter(p => p.type_id === 'land').length,
        apartments: properties.filter(p => p.type_id === 'apartment').length,
        areaDistribution: {},
        priceDistribution: {
          under100k: properties.filter(p => p.price_usd < 100000).length,
          between100k300k: properties.filter(p => p.price_usd >= 100000 && p.price_usd < 300000).length,
          between300k500k: properties.filter(p => p.price_usd >= 300000 && p.price_usd < 500000).length,
          over500k: properties.filter(p => p.price_usd >= 500000).length
        }
      };

      // 计算区域分布（使用中英文格式）
      properties.forEach(property => {
        const areaId = property.area_id;
        
        if (areaId && !stats.areaDistribution[areaId]) {
          const areaInfo = areasMap.get(areaId);
          
          stats.areaDistribution[areaId] = {
            count: 0,
            name_zh: areaInfo ? areaInfo.name_zh : areaId,
            name_en: areaInfo ? areaInfo.name_en : areaId
          };
        }
        
        if (areaId) {
          stats.areaDistribution[areaId].count++;
        }
      });

      setStats(stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // 筛选和排序逻辑
  const filteredAndSortedProperties = React.useMemo(() => {
    let filtered = properties.filter(property => {
      // 搜索筛选
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!property.title_zh.toLowerCase().includes(searchLower) && 
            !property.title_en.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // 区域筛选
      if (filterArea !== 'all' && property.area_id !== filterArea) {
        return false;
      }
      
      // 类型筛选
      if (filterType !== 'all' && property.type_id !== filterType) {
        return false;
      }
      
      // 状态筛选
      if (filterStatus !== 'all') {
        if (filterStatus === 'published' && !property.is_published) return false;
        if (filterStatus === 'pending' && property.approval_status !== 'pending') return false;
        if (filterStatus === 'rejected' && property.approval_status !== 'rejected') return false;
      }
      
      // 价格区间筛选
      if (filterPriceRange !== 'all') {
        const price = property.price_usd;
        if (filterPriceRange === 'under100k' && price >= 100000) return false;
        if (filterPriceRange === '100k-300k' && (price < 100000 || price >= 300000)) return false;
        if (filterPriceRange === '300k-500k' && (price < 300000 || price >= 500000)) return false;
        if (filterPriceRange === 'over500k' && price < 500000) return false;
      }
      
      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'price_usd':
          aValue = a.price_usd;
          bValue = b.price_usd;
          break;
        case 'building_area':
          aValue = a.building_area || 0;
          bValue = b.building_area || 0;
          break;
        case 'land_area':
          aValue = a.land_area || 0;
          bValue = b.land_area || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [properties, searchTerm, filterArea, filterType, filterStatus, filterPriceRange, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (property: Property) => {
    if (property.is_published) {
      return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1 whitespace-nowrap">在售</Badge>;
    } else if (property.approval_status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-2 py-1 whitespace-nowrap">待审核</Badge>;
    } else if (property.approval_status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1 whitespace-nowrap">已拒绝</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-2 py-1 whitespace-nowrap">草稿</Badge>;
    }
  };

  const getTypeLabel = (typeId: string) => {
    const types: { [key: string]: { zh: string; en: string } } = {
      villa: { zh: '别墅', en: 'Villa' },
      land: { zh: '土地', en: 'Land' },
      apartment: { zh: '公寓', en: 'Apartment' }
    };
    return types[typeId] || { zh: typeId, en: typeId };
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const formatArea = (area: number) => {
    return area ? `${area.toLocaleString()}m²` : '-';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const calculateDaysInStock = (dateString: string) => {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 价格分布图组件
  const PriceDistributionChart = ({ distribution }: { distribution: PropertyStats['priceDistribution'] }) => {
    const total = distribution.under100k + distribution.between100k300k + distribution.between300k500k + distribution.over500k;
    const maxCount = Math.max(distribution.under100k, distribution.between100k300k, distribution.between300k500k, distribution.over500k);
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">价格分布（美元）</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { label: '<100K', count: distribution.under100k, color: 'bg-blue-200' },
            { label: '100K-300K', count: distribution.between100k300k, color: 'bg-blue-300' },
            { label: '300K-500K', count: distribution.between300k500k, color: 'bg-blue-400' },
            { label: '>500K', count: distribution.over500k, color: 'bg-blue-500' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="h-16 flex items-end justify-center mb-1">
                <div 
                  className={`${item.color} rounded-t transition-all duration-500`}
                  style={{ 
                    height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                    minHeight: item.count > 0 ? '8px' : '0px',
                    width: '100%'
                  }}
                />
              </div>
              <div className="text-gray-600">{item.label}</div>
              <div className="font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>加载房源数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">房源列表</h1>
          <p className="text-gray-600 mt-1">管理和查看所有房源信息</p>
        </div>
        <Button onClick={() => navigate('/admin/properties/create')} className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          上架新房源
        </Button>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 总房源数量 */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">总房源</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-700 mt-1">套房源</p>
                </div>
                <div className="w-12 h-12 bg-blue-200/50 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 别墅数量 */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">别墅</p>
                  <p className="text-2xl font-bold text-green-900">{stats.villas}</p>
                  <p className="text-xs text-green-700 mt-1">套别墅</p>
                </div>
                <div className="w-12 h-12 bg-green-200/50 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 土地数量 */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">土地</p>
                  <p className="text-2xl font-bold text-amber-900">{stats.lands}</p>
                  <p className="text-xs text-amber-700 mt-1">块土地</p>
                </div>
                <div className="w-12 h-12 bg-amber-200/50 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 价格分布 */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <PriceDistributionChart distribution={stats.priceDistribution} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 区域分布 */}
      {stats && Object.keys(stats.areaDistribution).length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              区域分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.areaDistribution).map(([areaId, area]) => (
                <div key={areaId} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-900">
                    {area.name_zh}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({area.name_en})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {area.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 筛选和搜索 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 搜索 */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索房源标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 区域筛选 */}
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger>
                <SelectValue placeholder="选择区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有区域</SelectItem>
                {stats && Object.entries(stats.areaDistribution).map(([areaId, area]) => (
                  <SelectItem key={areaId} value={areaId}>
                    {area.name_zh} ({area.name_en})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 类型筛选 */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="房源类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="villa">别墅</SelectItem>
                <SelectItem value="land">土地</SelectItem>
                <SelectItem value="apartment">公寓</SelectItem>
              </SelectContent>
            </Select>

            {/* 状态筛选 */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="房源状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="published">在售</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>

            {/* 价格区间筛选 */}
            <Select value={filterPriceRange} onValueChange={setFilterPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="价格区间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有价格</SelectItem>
                <SelectItem value="under100k">&lt; $100K</SelectItem>
                <SelectItem value="100k-300k">$100K - $300K</SelectItem>
                <SelectItem value="300k-500k">$300K - $500K</SelectItem>
                <SelectItem value="over500k">&gt; $500K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 房源表格 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              房源列表 ({filteredAndSortedProperties.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-20">缩略图</TableHead>
                  <TableHead className="min-w-48">房源标题</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>卧室/浴室</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('building_area')}
                  >
                    <div className="flex items-center gap-1">
                      建筑面积
                      {sortField === 'building_area' && (
                        sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('land_area')}
                  >
                    <div className="flex items-center gap-1">
                      土地面积
                      {sortField === 'land_area' && (
                        sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('price_usd')}
                  >
                    <div className="flex items-center gap-1">
                      价格
                      {sortField === 'price_usd' && (
                        sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      在库天数
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProperties.map((property) => {
                  const typeInfo = getTypeLabel(property.type_id);
                  return (
                    <TableRow key={property.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title_zh}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{property.title_zh}</div>
                          <div className="text-sm text-gray-500">{property.title_en}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{property.area_name_zh}</div>
                          <div className="text-gray-500">{property.area_name_en}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{typeInfo.zh}</div>
                          <div className="text-gray-500">{typeInfo.en}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(property)}
                      </TableCell>
                      <TableCell>
                        {property.type_id === 'land' ? (
                          <span className="text-gray-400 text-sm">-</span>
                        ) : (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4 text-gray-400" />
                              <span>{property.bedrooms || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4 text-gray-400" />
                              <span>{property.bathrooms || 0}</span>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {formatArea(property.building_area)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {formatArea(property.land_area)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">{formatPrice(property.price_usd)}</div>
                          <div className="text-gray-500">¥{(property.price_cny / 10000).toFixed(0)}万</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {calculateDaysInStock(property.created_at)}天
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          查看
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredAndSortedProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无房源</h3>
              <p className="text-gray-500 mb-6">没有找到符合条件的房源</p>
              <Button onClick={() => navigate('/admin/properties/create')}>
                上架第一套房源
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;