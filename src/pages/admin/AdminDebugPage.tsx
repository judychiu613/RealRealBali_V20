import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth, useAdminAPI } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminDebugPage: React.FC = () => {
  const { user, session } = useAuth();
  const { adminUser, isSuperAdmin, isAdmin } = useAdminAuth();
  const { callAdminAPI } = useAdminAPI();
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testAPI = async (testName: string, endpoint: string, options?: any) => {
    try {
      setLoading(testName);
      const result = await callAdminAPI(endpoint, options);
      setResults((prev: Record<string, any>) => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults((prev: Record<string, any>) => ({
        ...prev, 
        [testName]: { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        } 
      }));
    } finally {
      setLoading(null);
    }
  };

  const testBasicAPI = async () => {
    try {
      setLoading('basic');
      const response = await fetch('https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/db_test_api_2026_03_04_06_00');
      const data = await response.json();
      setResults((prev: Record<string, any>) => ({ ...prev, basic: data }));
    } catch (error) {
      setResults((prev: Record<string, any>) => ({
        ...prev, 
        basic: { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        } 
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">管理员API调试</h1>
        
        {/* 用户信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>当前用户信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>用户ID:</strong> {user?.id || '未登录'}</p>
              <p><strong>邮箱:</strong> {user?.email || '未知'}</p>
              <p><strong>会话状态:</strong> {session ? '已认证' : '未认证'}</p>
              <p><strong>管理员用户:</strong> {adminUser ? `${adminUser.full_name} (${adminUser.role})` : '非管理员'}</p>
              <p><strong>权限:</strong> {isSuperAdmin ? '超级管理员' : isAdmin ? '房源管理员' : '无管理权限'}</p>
            </div>
          </CardContent>
        </Card>

        {/* API测试按钮 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Button 
            onClick={testBasicAPI}
            disabled={loading === 'basic'}
            variant="outline"
          >
            {loading === 'basic' ? '测试中...' : '基础API测试'}
          </Button>
          
          <Button 
            onClick={() => testAPI('properties', 'properties')}
            disabled={loading === 'properties'}
            variant="outline"
          >
            {loading === 'properties' ? '测试中...' : '获取所有房源'}
          </Button>
          
          <Button 
            onClick={() => testAPI('my-properties', 'my-properties')}
            disabled={loading === 'my-properties'}
            variant="outline"
          >
            {loading === 'my-properties' ? '测试中...' : '获取我的房源'}
          </Button>
          
          <Button 
            onClick={() => testAPI('property-stats', 'property-stats')}
            disabled={loading === 'property-stats'}
            variant="outline"
          >
            {loading === 'property-stats' ? '测试中...' : '房源统计'}
          </Button>
          
          <Button 
            onClick={() => testAPI('approval-logs', 'approval-logs?limit=5')}
            disabled={loading === 'approval-logs'}
            variant="outline"
          >
            {loading === 'approval-logs' ? '测试中...' : '审批日志'}
          </Button>
          
          <Button 
            onClick={() => testAPI('test-auth', 'test-auth')}
            disabled={loading === 'test-auth'}
            variant="outline"
          >
            {loading === 'test-auth' ? '测试中...' : '认证测试'}
          </Button>
        </div>

        {/* 测试结果 */}
        <div className="space-y-4">
          {Object.entries(results).map(([testName, result]) => (
            <Card key={testName}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {testName} 测试结果
                  {(result as any)?.success ? (
                    <span className="ml-2 text-green-600">✅</span>
                  ) : (
                    <span className="ml-2 text-red-600">❌</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDebugPage;