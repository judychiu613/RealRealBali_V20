import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Eye, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  BarChart3
} from 'lucide-react';
import { useAdminAuth, useAdminAPI } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  publishedProperties: number;
  featuredProperties: number;
}

interface RecentActivity {
  id: string;
  action: string;
  property_title: string;
  created_at: string;
  performer_name: string;
}

const AdminDashboard: React.FC = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const { callAdminAPI } = useAdminAPI();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取房源统计
      const statsResponse = await callAdminAPI('property-stats');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // 获取最近活动（仅超级管理员）
      if (isSuperAdmin) {
        const activityResponse = await callAdminAPI('approval-logs?limit=10');
        if (activityResponse.success) {
          setRecentActivity(activityResponse.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const actionConfig = {
      approve: { label: '通过', variant: 'default' as const, icon: CheckCircle },
      reject: { label: '拒绝', variant: 'destructive' as const, icon: XCircle },
      submit: { label: '提交', variant: 'secondary' as const, icon: Clock },
      resubmit: { label: '重新提交', variant: 'outline' as const, icon: AlertCircle }
    };
    const config = actionConfig[action as keyof typeof actionConfig] || actionConfig.submit;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>加载仪表板数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            欢迎回来，{adminUser?.full_name || adminUser?.email}
          </h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin ? '超级管理员' : '房源管理员'} • 今天是 {new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/properties/new')}>
          <Plus className="w-4 h-4 mr-2" />
          添加新房源
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总房源数</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
              <p className="text-xs text-muted-foreground">
                已发布: {stats?.publishedProperties || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待审核</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.pendingProperties || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                需要审核的房源
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已通过</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.approvedProperties || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                审核通过的房源
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">特色房源</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.featuredProperties || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                推荐展示的房源
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 快速操作和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/properties')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                管理房源
              </Button>
              
              {isSuperAdmin && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/pending')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    审核房源 {stats?.pendingProperties ? `(${stats.pendingProperties})` : ''}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    用户管理
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/analytics')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    数据分析
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  暂无最近活动
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getActionBadge(activity.action)}
                          <span className="text-sm font-medium">
                            {activity.property_title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activity.performer_name} • {new Date(activity.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isSuperAdmin && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => navigate('/admin/logs')}
                    >
                      查看所有活动
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;