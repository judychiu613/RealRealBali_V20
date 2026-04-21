import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p>请先登录查看个人资料</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              个人资料
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-700">邮箱地址</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-700">用户ID</label>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-700">注册时间</label>
                  <p className="text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">账户功能</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  查看收藏的房源
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  浏览历史
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  账户设置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}