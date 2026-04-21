import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  User, 
  Building2,
  CheckCircle,
  XCircle,
  Edit,
  Loader2
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface OperationLog {
  id: string;
  operator_id: string;
  operation_type: string;
  target_type: string;
  target_id: string;
  old_status?: string;
  new_status?: string;
  description: string;
  created_at: string;
  operator_email?: string;
}

const PropertyLogs: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 查询操作日志，如果表不存在则显示空状态
      const { data, error: fetchError } = await supabase
        .from('admin_operation_logs')
        .select(`
          id, operator_id, operation_type, target_type, target_id,
          old_status, new_status, description, created_at
        `)
        .eq('target_type', 'property')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        // 如果表不存在，显示友好提示
        if (fetchError.message.includes('does not exist')) {
          setLogs([]);
        } else {
          throw fetchError;
        }
      } else {
        setLogs(data || []);
      }
    } catch (err: any) {
      console.error('Error fetching logs:', err);
      setError(err.message || 'Failed to fetch operation logs');
    } finally {
      setLoading(false);
    }
  };

  const getOperationIcon = (operationType: string) => {
    switch (operationType) {
      case 'status_change':
        return CheckCircle;
      case 'create':
        return Building2;
      case 'update':
        return Edit;
      case 'delete':
        return XCircle;
      default:
        return FileText;
    }
  };

  const getOperationColor = (operationType: string) => {
    switch (operationType) {
      case 'status_change':
        return 'text-green-600';
      case 'create':
        return 'text-blue-600';
      case 'update':
        return 'text-yellow-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        <h1 className="text-2xl font-bold">房源操作日志</h1>
        <Badge variant="secondary" className="text-sm">
          <FileText className="w-4 h-4 mr-1" />
          {logs.length} 条记录
        </Badge>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLogs}
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
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无操作日志</h3>
            <p className="text-gray-500">房源操作记录将在此显示</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>操作记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log) => {
                const OperationIcon = getOperationIcon(log.operation_type);
                const iconColor = getOperationColor(log.operation_type);
                
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                      <OperationIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(log.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>房源ID: {log.target_id}</span>
                        {log.old_status && log.new_status && (
                          <span>
                            状态: {log.old_status} → {log.new_status}
                          </span>
                        )}
                        <span>操作类型: {log.operation_type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyLogs;