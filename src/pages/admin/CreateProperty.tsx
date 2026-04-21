import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth, useAdminAPI } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyFormData {
  id: string;
  title_zh: string;
  title_en: string;
  description_zh: string;
  description_en: string;
  price_idr: number | '';
  price_usd: number | '';
  price_cny: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  building_area: number | '';
  land_area: number | '';
  area_id: string;
  type_id: string;
  ownership: string;
  latitude: number | string;
  longitude: number | string;
  is_featured: boolean;
  build_year: number | '';
  land_zone_id: string;
  leasehold_years: number | '';
  tags_zh: string;
  tags_en: string;
  amenities_zh: string;
  amenities_en: string;
}

interface AreaOption {
  id: string;
  name_zh: string;
  name_en: string;
  parent_id?: string;
}

interface GroupedAreas {
  [parentId: string]: AreaOption[];
}

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser, isAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 区域和土地分区数据
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [groupedAreas, setGroupedAreas] = useState<GroupedAreas>({});
  const [landZones, setLandZones] = useState<AreaOption[]>([]);

  // 表单数据
  const [formData, setFormData] = useState<PropertyFormData>({
    id: '',
    title_zh: '',
    title_en: '',
    description_zh: '',
    description_en: '',
    price_idr: '',
    price_usd: '',
    price_cny: '',
    bedrooms: '',
    bathrooms: '',
    building_area: '',
    land_area: '',
    area_id: '',
    type_id: 'villa',
    ownership: 'freehold',
    latitude: '',
    longitude: '',
    is_featured: false,
    build_year: '',
    land_zone_id: '',
    leasehold_years: '',
    tags_zh: '',
    tags_en: '',
    amenities_zh: '',
    amenities_en: ''
  });

  // 加载区域和土地分区数据
  useEffect(() => {
    loadAreas();
    loadLandZones();
  }, []);

  const loadAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('property_areas_map')
        .select('id, name_zh, name_en, parent_id')
        .order('name_zh');

      if (error) {
        console.error('Error loading areas:', error);
        return;
      }

      if (data) {
        setAreas(data);
        
        // 按 parent_id 分组
        const grouped: GroupedAreas = {};
        data.forEach(area => {
          if (area.parent_id) {
            if (!grouped[area.parent_id]) {
              grouped[area.parent_id] = [];
            }
            grouped[area.parent_id].push(area);
          }
        });
        setGroupedAreas(grouped);
      }
    } catch (err) {
      console.error('Error loading areas:', err);
    }
  };

  const loadLandZones = async () => {
    try {
      const { data, error } = await supabase
        .from('land_zones_map')
        .select('id, name_zh, name_en')
        .order('name_zh');

      if (error) {
        console.error('Error loading land zones:', error);
        return;
      }

      if (data) {
        setLandZones(data.map(zone => ({
          id: zone.id,
          name_zh: zone.name_zh,
          name_en: zone.name_en
        })));
      }
    } catch (err) {
      console.error('Error loading land zones:', err);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理数字输入框的变化
  const handleNumberChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : value
    }));
  };

  // 格式化价格显示（千分位）
  const formatPrice = (value: number | string): string => {
    if (value === '' || value === 0) return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  // 解析价格（去除千分位）
  const parsePrice = (value: string): string => {
    return value.replace(/,/g, '');
  };

  // 处理价格输入框变化
  const handlePriceChange = (field: keyof PropertyFormData, value: string) => {
    const cleanValue = parsePrice(value);
    setFormData(prev => ({
      ...prev,
      [field]: cleanValue === '' ? '' : cleanValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id.trim()) {
      setError('请填写房源ID');
      return;
    }

    if (!formData.title_zh || !formData.title_en) {
      setError('请填写房源标题（中英文）');
      return;
    }

    // 验证必填的价格字段
    if (!formData.price_usd || formData.price_usd <= 0) {
      setError('请输入有效的USD价格');
      return;
    }

    if (!formData.price_cny || formData.price_cny <= 0) {
      setError('请输入有效的CNY价格');
      return;
    }

    if (!formData.price_idr || formData.price_idr <= 0) {
      setError('请输入有效的IDR价格');
      return;
    }

    // 验证必填的土地面积
    if (!formData.land_area || formData.land_area <= 0) {
      setError('请输入有效的土地面积');
      return;
    }

    if (!formData.area_id) {
      setError('请选择所在区域');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // 检查房源ID是否已存在
      const { data: existingProperty } = await supabase
        .from('properties')
        .select('id')
        .eq('id', formData.id)
        .single();

      if (existingProperty) {
        setError('房源ID已存在，请使用其他ID');
        return;
      }

      // 准备数据
      const propertyData = {
        id: formData.id,
        title_en: formData.title_en,
        title_zh: formData.title_zh,
        description_en: formData.description_en || '',
        description_zh: formData.description_zh || '',
        price_idr: Number(formData.price_idr) || 0,
        price_usd: Number(formData.price_usd),
        price_cny: Number(formData.price_cny) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        building_area: Number(formData.building_area) || 0,
        land_area: Number(formData.land_area) || 0,
        area_id: formData.area_id,
        type_id: formData.type_id || 'villa',
        ownership: formData.ownership || 'freehold',
        latitude: parseFloat(formData.latitude as string) || 0,
        longitude: parseFloat(formData.longitude as string) || 0,
        is_featured: formData.is_featured || false,
        build_year: formData.build_year || new Date().getFullYear(),
        land_zone_id: formData.land_zone_id || '',
        leasehold_years: Number(formData.leasehold_years) || 0,
        // 数组字段 - 将逗号分隔的字符串转换为数组
        tags_en: formData.tags_en ? formData.tags_en.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        tags_zh: formData.tags_zh ? formData.tags_zh.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        amenities_en: formData.amenities_en ? formData.amenities_en.split(',').map(amenity => amenity.trim()).filter(amenity => amenity) : [],
        amenities_zh: formData.amenities_zh ? formData.amenities_zh.split(',').map(amenity => amenity.trim()).filter(amenity => amenity) : [],
        // 系统字段
        status: 'pending',
        is_published: false,
        created_by: adminUser?.id,
        updated_by: adminUser?.id,
        approval_status: 'pending'
      };

      console.log('Property data to insert:', propertyData);

      // 插入房源数据
      const { data: newProperty, error: insertError } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(`创建失败: ${insertError.message}`);
        return;
      }

      setSuccess('房源创建成功！等待审核中...');
      setTimeout(() => {
        navigate('/admin/properties');
      }, 2000);

    } catch (err: any) {
      setError(`错误: ${err.message || '网络错误，请重试'}`);
      console.error('Error creating property:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p>您没有权限访问此页面</p>
        <Button onClick={() => navigate('/admin')} className="mt-4">
          返回管理后台
        </Button>
      </div>
    );
  }

  // 获取一级地址（没有parent_id的）
  const firstLevelAreas = areas.filter(area => !area.parent_id);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/properties')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回房源列表
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <h1 className="text-2xl font-medium text-gray-900">上架新房源</h1>
        </div>

        {error && (
          <Alert className="mb-8 border-red-200/60 bg-red-50/50 backdrop-blur-sm">
            <AlertDescription className="text-red-700 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-8 border-green-200/60 bg-green-50/50 backdrop-blur-sm">
            <AlertDescription className="text-green-700 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 基本信息 */}
          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader className="py-2 px-4 bg-gray-200/80 border-b border-gray-200/40">
              <CardTitle className="text-lg font-medium text-gray-800">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {/* 第一行：房源ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                房源ID <span className="text-red-400">*</span>
                <span className="text-xs text-gray-500 ml-2">💡RR+“年份+11”(2位)+月份(2位)+排序(2位)，如26年3月上架的第1套房，ID为RR370301</span>
              </label>
              <Input
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="例如: RR370301"
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                required
              />
            </div>

            {/* 第二行：房源类型和产权信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  房源类型 <span className="text-red-400">*</span>
                </label>
                <Select 
                  value={formData.type_id} 
                  onValueChange={(value) => handleInputChange('type_id', value)}
                >
                  <SelectTrigger className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors">
                    <SelectValue placeholder="选择房源类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">别墅</SelectItem>
                    <SelectItem value="land">土地</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产权类型 <span className="text-red-400">*</span>
                </label>
                <Select 
                  value={formData.ownership} 
                  onValueChange={(value) => handleInputChange('ownership', value)}
                >
                  <SelectTrigger className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors">
                    <SelectValue placeholder="选择产权类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freehold">永久产权 (Freehold)</SelectItem>
                    <SelectItem value="leasehold">租赁产权 (Leasehold)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.ownership === 'leasehold' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    租赁年限
                  </label>
                  <Input
                    type="number"
                    value={formData.leasehold_years}
                    onChange={(e) => handleNumberChange('leasehold_years', e.target.value)}
                    placeholder="年限"
                    className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                    min="1"
                    max="99"
                  />
                </div>
              )}
            </div>

            {/* 第三行：标题 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题（中文）<span className="text-red-400">*</span>
                </label>
                <Input
                  value={formData.title_zh}
                  onChange={(e) => handleInputChange('title_zh', e.target.value)}
                  placeholder="房源中文标题"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题（英文）<span className="text-red-400">*</span>
                </label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => handleInputChange('title_en', e.target.value)}
                  placeholder="Property English Title"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  required
                />
              </div>
            </div>

            {/* 第四行：描述 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述（中文）
                  <span className="text-xs text-gray-500 ml-2">💡可拖拽右下角调整输入框大小</span>
                </label>
                <Textarea
                  value={formData.description_zh}
                  onChange={(e) => handleInputChange('description_zh', e.target.value)}
                  placeholder="房源详细描述"
                  rows={4}
                  className="resize-both min-h-[100px] border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述（英文）
                  <span className="text-xs text-gray-500 ml-2">💡可拖拽右下角调整输入框大小</span>
                </label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => handleInputChange('description_en', e.target.value)}
                  placeholder="Property detailed description"
                  rows={4}
                  className="resize-both min-h-[100px] border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 价格信息 */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="py-2 px-4 bg-gray-200/80 border-b border-gray-200/40">
            <CardTitle className="text-lg font-medium text-gray-800">价格信息</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Alert className="bg-blue-50/50 border-blue-200/60 backdrop-blur-sm">
              <AlertDescription className="text-blue-700 font-medium">
                💰 {formData.type_id === 'land' ? '土地价格按每are计算（1 are = 100平方米）' : '别墅总价'} ・ 💡 价格输入支持千分位格式化，系统会自动添加逗号分隔符（例如：输入 1500000 显示为 1,500,000）
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USD价格 <span className="text-red-400">*</span> {formData.type_id === 'land' && '(每are)'}
                </label>
                <Input
                  type="text"
                  value={formatPrice(formData.price_usd)}
                  onChange={(e) => handlePriceChange('price_usd', e.target.value)}
                  placeholder="例如: 150,000"
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNY价格 <span className="text-red-400">*</span> {formData.type_id === 'land' && '(每are)'}
                </label>
                <Input
                  type="text"
                  value={formatPrice(formData.price_cny)}
                  onChange={(e) => handlePriceChange('price_cny', e.target.value)}
                  placeholder="例如: 1,000,000"
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IDR价格 <span className="text-red-400">*</span> {formData.type_id === 'land' && '(每are)'}
                </label>
                <Input
                  type="text"
                  value={formatPrice(formData.price_idr)}
                  onChange={(e) => handlePriceChange('price_idr', e.target.value)}
                  placeholder="例如: 2,500,000,000"
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 房源详情 */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="py-2 px-4 bg-gray-200/80 border-b border-gray-200/40">
            <CardTitle className="text-lg font-medium text-gray-800">房源详情</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Alert className="bg-blue-50/50 border-blue-200/60 backdrop-blur-sm">
              <AlertDescription className="text-blue-700 font-medium">
                📝 {formData.type_id === 'land' ? '土地类型只需要填写土地面积，其他字段可不填' : '别墅类型请填写所有相关信息'}
              </AlertDescription>
            </Alert>

            {/* 房源详情一行布局 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  卧室数量
                </label>
                <Input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleNumberChange('bedrooms', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '不需填' : ''}
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  min="0"
                  disabled={formData.type_id === 'land'}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  浴室数量
                </label>
                <Input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleNumberChange('bathrooms', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '不需填' : ''}
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  min="0"
                  disabled={formData.type_id === 'land'}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  建筑面积 (m²)
                </label>
                <Input
                  type="number"
                  value={formData.building_area}
                  onChange={(e) => handleNumberChange('building_area', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '不需填' : ''}
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  min="0"
                  disabled={formData.type_id === 'land'}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  土地面积 (m²) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.land_area}
                  onChange={(e) => handleNumberChange('land_area', e.target.value)}
                  placeholder="必填"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  建造年份
                </label>
                <Input
                  type="number"
                  value={formData.build_year}
                  onChange={(e) => handleNumberChange('build_year', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '不需填' : ''}
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  disabled={formData.type_id === 'land'}
                />
              </div>
            </div>

            {/* 土地分区按钮选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                土地分区
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {landZones.map(zone => (
                  <div key={zone.id} className="flex items-center space-x-2 p-2 bg-white/80 rounded border border-gray-200/60 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                    <Checkbox
                      id={zone.id}
                      checked={formData.land_zone_id === zone.id}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('land_zone_id', zone.id);
                        }
                      }}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 scale-90"
                    />
                    <label 
                      htmlFor={zone.id}
                      className="text-xs cursor-pointer flex-1 font-medium text-gray-700 leading-tight"
                    >
                      {zone.name_zh} ({zone.name_en})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 位置信息 */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="py-2 px-4 bg-gray-200/80 border-b border-gray-200/40">
            <CardTitle className="text-lg font-medium text-gray-800">位置信息</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                所在区域 <span className="text-red-400">*</span>
              </label>
              <div className="space-y-3">
                {firstLevelAreas.map(firstLevel => (
                  <div key={firstLevel.id} className="border border-gray-200/60 rounded-lg p-4 bg-gradient-to-br from-white/80 to-gray-50/40 backdrop-blur-sm">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">
                      {firstLevel.name_zh} <span className="text-gray-500">({firstLevel.name_en})</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {groupedAreas[firstLevel.id]?.map(area => (
                        <div key={area.id} className="flex items-center space-x-2 p-2 bg-white/80 rounded border border-gray-200/60 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                          <Checkbox
                            id={area.id}
                            checked={formData.area_id === area.id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange('area_id', area.id);
                              }
                            }}
                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 scale-90"
                          />
                          <label 
                            htmlFor={area.id}
                            className="text-xs cursor-pointer flex-1 font-medium text-gray-700 leading-tight"
                          >
                            {area.name_zh} ({area.name_en})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 经纬度信息 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-200/40">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  纬度 (Latitude)
                </label>
                <Input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="例如: -8.3405"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  经度 (Longitude)
                </label>
                <Input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="例如: 115.0920"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签和设施 */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="py-2 px-4 bg-gray-200/80 border-b border-gray-200/40">
            <CardTitle className="text-lg font-medium text-gray-800">标签和设施</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Alert className="bg-blue-50/50 border-blue-200/60 backdrop-blur-sm">
              <AlertDescription className="text-blue-700 font-medium">
                🏷️ 请用逗号分隔多个标签和设施，例如：海景,豪华,私人泳池
              </AlertDescription>
            </Alert>

            {/* 标签 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签（中文）
                </label>
                <Input
                  value={formData.tags_zh}
                  onChange={(e) => handleInputChange('tags_zh', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '住宅用地,黄金地段,投资首选' : '海景,豪华,私人泳池'}
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签（英文）
                </label>
                <Input
                  value={formData.tags_en}
                  onChange={(e) => handleInputChange('tags_en', e.target.value)}
                  placeholder={formData.type_id === 'land' ? 'Residential Land,Prime Location,Investment' : 'Ocean View,Luxury,Private Pool'}
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
            </div>

            {/* 设施 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  设施（中文）
                </label>
                <Textarea
                  value={formData.amenities_zh}
                  onChange={(e) => handleInputChange('amenities_zh', e.target.value)}
                  placeholder={formData.type_id === 'land' ? '通水通电,道路通达,规划许可' : '私人泳池,花园,停车场,空调,WiFi'}
                  rows={3}
                  className="resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  设施（英文）
                </label>
                <Textarea
                  value={formData.amenities_en}
                  onChange={(e) => handleInputChange('amenities_en', e.target.value)}
                  placeholder={formData.type_id === 'land' ? 'Water & Electricity,Road Access,Building Permit' : 'Private Pool,Garden,Parking,Air Conditioning,WiFi'}
                  rows={3}
                  className="resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex gap-6 pt-6 pb-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1 h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
            <Save className="w-5 h-5 mr-3" />
            {loading ? '提交中...' : '提交审核'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/properties')}
            disabled={loading}
            className="px-8 h-14 text-base font-medium border-gray-300 hover:bg-gray-50 transition-colors"
          >
            取消
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateProperty;