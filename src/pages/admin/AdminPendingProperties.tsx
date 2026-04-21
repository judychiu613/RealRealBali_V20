import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Building2,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface PendingProperty {
  id: string;
  title_zh: string;
  title_en: string;
  description_zh?: string;
  description_en?: string;
  type_id: string;
  price_usd: number;
  price_cny?: number;
  price_idr?: number;
  area_id: string;
  bedrooms?: number;
  bathrooms?: number;
  building_area?: number;
  land_area?: number;
  ownership?: string;
  tags_zh?: string;
  tags_en?: string;
  amenities_zh?: string;
  amenities_en?: string;
  is_featured?: boolean;
  created_at: string;
  created_by: string;
  approval_status: string;
}

const AdminPendingProperties: React.FC = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          id, title_zh, title_en, description_zh, description_en,
          type_id, price_usd, price_cny, price_idr, area_id,
          bedrooms, bathrooms, building_area, land_area, ownership,
          tags_zh, tags_en, amenities_zh, amenities_en, is_featured,
          created_at, created_by, approval_status
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setProperties(data || []);
    } catch (err: any) {
      console.error('Error fetching pending properties:', err);
      setError(err.message || 'Failed to fetch pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (propertyId: string, action: 'approve' | 'reject', reason?: string) => {
    if (!isSuperAdmin) {
      setError('只有超级管理员可以审批房源');
      return;
    }

    try {
      setActionLoading(propertyId);
      
      const updateData: any = {
        approval_status: action === 'approve' ? 'approved' : 'rejected',
        approved_by: adminUser?.id,
        approved_at: new Date().toISOString(),
        updated_by: adminUser?.id,
        updated_at: new Date().toISOString()
      };

      if (action === 'approve') {
        updateData.status = 'available';
        updateData.is_published = true;
      } else {
        updateData.status = 'draft';
        updateData.is_published = false;
        updateData.rejection_reason = reason || '';
      }

      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId);

      if (updateError) {
        throw updateError;
      }

      // 刷新列表
      await fetchPendingProperties();
      
      // 重置状态
      setSelectedProperty(null);
      setRejectionReason('');
      setShowRejectDialog(false);

    } catch (err: any) {
      console.error('Error approving property:', err);
      setError(err.message || 'Failed to process approval');
    } finally {
      setActionLoading(null);
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
    switch (typeId) {
      case 'villa': return '别墅';
      case 'land': return '土地';
      default: return typeId;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-8">
        <p>只有超级管理员可以访问此页面</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">待审核房源</h1>
        <Badge variant="secondary" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {properties.length} 个待审核
        </Badge>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPendingProperties}
              className="mt-2"
            >
              重试
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无待审核房源</h3>
            <p className="text-gray-500">所有房源都已处理完毕</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <Badge variant="outline">{getTypeLabel(property.type_id)}</Badge>
                      {property.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">精选</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {property.title_zh}
                    </h3>
                    <p className="text-gray-600 mb-2">{property.title_en}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.area_id}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(property.created_at)}
                      </div>
                    </div>

                    {/* 房源详情 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">价格:</span>
                        <p className="font-medium">{formatPrice(property.price_usd)}</p>
                      </div>
                      {property.type_id === 'villa' && (
                        <>
                          <div>
                            <span className="text-gray-500">卧室:</span>
                            <p className="font-medium">{property.bedrooms || 0} 间</p>
                          </div>
                          <div>
                            <span className="text-gray-500">浴室:</span>
                            <p className="font-medium">{property.bathrooms || 0} 间</p>
                          </div>
                          <div>
                            <span className="text-gray-500">建筑面积:</span>
                            <p className="font-medium">{property.building_area || 0} ㎡</p>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-gray-500">土地面积:</span>
                        <p className="font-medium">{property.land_area || 0} ㎡</p>
                      </div>
                      <div>
                        <span className="text-gray-500">产权:</span>
                        <p className="font-medium">{property.ownership === 'freehold' ? '永久产权' : '租赁产权'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  {/* 查看详情 */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{property.title_zh}</DialogTitle>
                        <DialogDescription>{property.title_en}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">描述</h4>
                          <p className="text-sm text-gray-600">{property.description_zh}</p>
                          <p className="text-sm text-gray-500 mt-1">{property.description_en}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">标签</h4>
                          <p className="text-sm text-gray-600">{property.tags_zh}</p>
                          <p className="text-sm text-gray-500">{property.tags_en}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">设施</h4>
                          <p className="text-sm text-gray-600">{property.amenities_zh}</p>
                          <p className="text-sm text-gray-500">{property.amenities_en}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* 审批按钮 */}
                  <div className="flex gap-2 ml-auto">
                    {/* 拒绝 */}
                    <Dialog open={showRejectDialog && selectedProperty?.id === property.id} onOpenChange={setShowRejectDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={actionLoading === property.id}
                          onClick={() => setSelectedProperty(property)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          拒绝
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>拒绝房源</DialogTitle>
                          <DialogDescription>
                            请说明拒绝 "{property.title_zh}" 的原因
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="请输入拒绝原因..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowRejectDialog(false);
                              setRejectionReason('');
                              setSelectedProperty(null);
                            }}
                          >
                            取消
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleApproval(property.id, 'reject', rejectionReason)}
                            disabled={!rejectionReason.trim() || actionLoading === property.id}
                          >
                            {actionLoading === property.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            确认拒绝
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* 通过 */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={actionLoading === property.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          通过
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认通过</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要通过房源 "{property.title_zh}" 的审核吗？通过后房源将会发布上线。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApproval(property.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === property.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            确认通过
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingProperties;