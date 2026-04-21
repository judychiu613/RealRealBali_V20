import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Mail,
  MapPin,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface MemberStats {
  totalMembers: number;
  newMembersThisMonth: number;
  activeMembers: number;
  membersByCountry: { [key: string]: number };
  recentMembers: any[];
}

const MembersAnalytics: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [stats, setStats] = useState<MemberStats>({
    totalMembers: 0,
    newMembersThisMonth: 0,
    activeMembers: 0,
    membersByCountry: {},
    recentMembers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberStats();
  }, []);

  const fetchMemberStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取用户统计数据
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // 计算统计数据
      const totalMembers = profiles?.length || 0;
      const newMembersThisMonth = profiles?.filter(p => 
        new Date(p.created_at) >= thisMonth
      ).length || 0;
      
      const activeMembers = profiles?.filter(p => p.is_active).length || 0;
      
      // 按国家统计
      const membersByCountry: { [key: string]: number } = {};
      profiles?.forEach(profile => {
        const country = profile.country_code || 'Unknown';
        membersByCountry[country] = (membersByCountry[country] || 0) + 1;
      });

      // 最近注册的会员
      const recentMembers = profiles?.slice(0, 10) || [];

      setStats({
        totalMembers,
        newMembersThisMonth,
        activeMembers,
        membersByCountry,
        recentMembers
      });

    } catch (err: any) {
      console.error('Error fetching member stats:', err);
      setError(err.message || 'Failed to fetch member analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCountryName = (countryCode: string) => {
    const countryNames: { [key: string]: string } = {
      'CN': '中国',
      'ID': '印度尼西亚',
      'US': '美国',
      'SG': '新加坡',
      'AU': '澳大利亚',
      'Unknown': '未知'
    };
    return countryNames[countryCode] || countryCode;
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
        <h1 className="text-2xl font-bold">会员分析</h1>
        <Badge variant="secondary" className="text-sm">
          <Users className="w-4 h-4 mr-1" />
          {stats.totalMembers} 位会员
        </Badge>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总会员数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">本月新增</p>
                <p className="text-2xl font-bold text-green-600">{stats.newMembersThisMonth}</p>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">活跃会员</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeMembers}</p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 地区分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              地区分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.membersByCountry)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getCountryName(country)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalMembers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近注册 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              最近注册
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {member.full_name?.charAt(0) || member.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.full_name || '未设置姓名'}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(member.created_at)}</p>
                    <Badge variant={member.is_active ? "default" : "secondary"} className="text-xs">
                      {member.is_active ? '活跃' : '未激活'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembersAnalytics;