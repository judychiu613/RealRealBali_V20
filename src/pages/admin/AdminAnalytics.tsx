import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAdminAPI } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserAnalytics {
  totalUsers: number;
  totalUniqueVisitors: number;
  totalRegisteredVisitors: number;
  dailyAnalytics: Array<{
    date: string;
    totalViews: number;
    uniqueVisitors: number;
    registeredVisitors: number;
    registeredRatio: number;
  }>;
}

interface DeviceAnalytics {
  deviceTypes: Record<string, number>;
  deviceSubtypes: Record<string, number>;
  browsers: Record<string, number>;
  registeredUserDevices: Record<string, number>;
  anonymousUserDevices: Record<string, number>;
}

const AdminAnalytics: React.FC = () => {
  const { callAdminAPI } = useAdminAPI();
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [deviceAnalytics, setDeviceAnalytics] = useState<DeviceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userResult, deviceResult] = await Promise.all([
        callAdminAPI(`user-analytics?days=${selectedPeriod}`),
        callAdminAPI('device-analytics')
      ]);

      setUserAnalytics(userResult.data);
      setDeviceAnalytics(deviceResult.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'iphone':
      case 'android':
        return <Smartphone className="w-5 h-5" />;
      case 'ipad':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getDeviceLabel = (deviceType: string) => {
    switch (deviceType) {
      case 'iphone': return 'iPhone';
      case 'android': return 'Android';
      case 'ipad': return 'iPad';
      case 'desktop': return '桌面端';
      case 'mobile': return '移动端';
      default: return deviceType;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={fetchAnalytics}>重试</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和时间筛选 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-500 mt-1">网站和小程序用户行为分析</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">近7天</SelectItem>
              <SelectItem value="30">近30天</SelectItem>
              <SelectItem value="90">近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            刷新数据
          </Button>
        </div>
      </div>

      {/* 用户分析概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">注册用户总数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAnalytics?.totalUsers || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">独立访客数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAnalytics?.totalUniqueVisitors || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">注册用户访客</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAnalytics?.totalRegisteredVisitors || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 设备分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 设备类型分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>设备类型分布</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceAnalytics && Object.entries(deviceAnalytics.deviceTypes).map(([type, count]) => {
                const total = Object.values(deviceAnalytics.deviceTypes).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(type)}
                      <span className="font-medium">{getDeviceLabel(type)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {percentage}%
                      </span>
                      <span className="text-sm text-gray-500 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 移动设备细分 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>移动设备细分</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceAnalytics && Object.entries(deviceAnalytics.deviceSubtypes).map(([subtype, count]) => {
                const total = Object.values(deviceAnalytics.deviceSubtypes).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={subtype} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(subtype)}
                      <span className="font-medium">{getDeviceLabel(subtype)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {percentage}%
                      </span>
                      <span className="text-sm text-gray-500 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 浏览器分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>浏览器分布</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deviceAnalytics && Object.entries(deviceAnalytics.browsers)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([browser, count]) => {
                const total = Object.values(deviceAnalytics.browsers).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={browser} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{browser}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* 注册用户 vs 匿名用户设备使用情况 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>注册用户设备使用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deviceAnalytics && Object.entries(deviceAnalytics.registeredUserDevices).map(([device, count]) => {
                const total = Object.values(deviceAnalytics.registeredUserDevices).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device)}
                      <span>{getDeviceLabel(device)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>匿名用户设备使用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deviceAnalytics && Object.entries(deviceAnalytics.anonymousUserDevices).map(([device, count]) => {
                const total = Object.values(deviceAnalytics.anonymousUserDevices).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device)}
                      <span>{getDeviceLabel(device)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 日访问趋势 */}
      {userAnalytics?.dailyAnalytics && userAnalytics.dailyAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>日访问趋势</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 简化的趋势图表 - 使用条形图 */}
              <div className="space-y-2">
                {userAnalytics.dailyAnalytics.slice(-14).map((day, index) => {
                  const maxViews = Math.max(...userAnalytics.dailyAnalytics.map(d => d.totalViews));
                  const percentage = maxViews > 0 ? (day.totalViews / maxViews) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="flex items-center space-x-4">
                      <div className="w-20 text-xs text-gray-500">
                        {new Date(day.date).toLocaleDateString('zh-CN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex-1 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <motion.div 
                            className="bg-primary h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.05 }}
                          />
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium">{day.totalViews}</span>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-xs text-gray-500">
                            {day.registeredVisitors}注册
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalytics;