import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // 如果已登录，重定向到首页
  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugLogs([]);

    try {
      if (isSignUp) {
        await debugSignUp(email, password);
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError('操作失败，请重试');
      addDebugLog(`CATCH ERROR: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const debugSignUp = async (email: string, password: string) => {
    addDebugLog('=== 调试日志开始 ===');
    
    // 步骤1: 调用的完整代码
    const signUpCode = `supabase.auth.signUp({
  email: "${email}",
  password: "${password}"
})`;
    addDebugLog(`【步骤1】调用的完整代码：\n${signUpCode}`);
    
    // 步骤2: 发送的完整payload
    const payload = {
      email: email,
      password: password
    };
    addDebugLog(`【步骤2】发送的完整 payload JSON：\n${JSON.stringify(payload, null, 2)}`);
    
    // 步骤3: 执行注册
    let supabaseResponse;
    let supabaseError;
    
    try {
      const result = await supabase.auth.signUp({
        email,
        password
      });
      supabaseResponse = result.data;
      supabaseError = result.error;
    } catch (err) {
      supabaseError = err;
    }
    
    // 步骤3: Supabase返回的完整response
    addDebugLog(`【步骤3】Supabase 返回的完整 response JSON：\n${JSON.stringify(supabaseResponse, null, 2)}`);
    
    // 步骤4: error对象完整结构
    addDebugLog(`【步骤4】error 对象完整结构：\n${JSON.stringify(supabaseError, null, 2)}`);
    
    // 步骤5: 检查是否创建 auth.users 记录
    if (supabaseResponse?.user?.id) {
      try {
        const { data: authUser, error: authError } = await supabase
          .from('auth.users')
          .select('id, email, created_at')
          .eq('id', supabaseResponse.user.id)
          .single();
        
        addDebugLog(`【步骤5】是否创建 auth.users 记录：\n查询结果: ${JSON.stringify(authUser, null, 2)}\n查询错误: ${JSON.stringify(authError, null, 2)}`);
      } catch (err) {
        addDebugLog(`【步骤5】auth.users 查询失败：\n${JSON.stringify(err, null, 2)}`);
      }
    } else {
      addDebugLog(`【步骤5】未创建 auth.users 记录 - 无用户ID`);
    }
    
    // 步骤6: 检查触发器
    addDebugLog(`【步骤6】是否触发触发器：已删除所有触发器`);
    
    // 步骤7: user_profiles 插入尝试
    if (supabaseResponse?.user?.id) {
      try {
        const profilePayload = {
          id: supabaseResponse.user.id,
          email: supabaseResponse.user.email || email,
          full_name: '',
          role: 'user',
          is_active: true,
          preferred_language: 'zh',
          preferred_currency: 'CNY'
        };
        
        addDebugLog(`【步骤7】user_profiles 插入尝试 payload：\n${JSON.stringify(profilePayload, null, 2)}`);
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .insert(profilePayload)
          .select()
          .single();
        
        addDebugLog(`【步骤7】user_profiles 插入结果：\n数据: ${JSON.stringify(profileData, null, 2)}\n错误: ${JSON.stringify(profileError, null, 2)}`);
        
        if (!profileError) {
          setError('');
          alert('注册成功！请检查邮箱验证链接。');
          setIsSignUp(false);
        } else {
          setError(`注册失败: ${profileError.message}`);
        }
        
      } catch (err) {
        addDebugLog(`【步骤7】user_profiles 插入异常：\n${JSON.stringify(err, null, 2)}`);
        setError(`配置文件创建失败: ${(err as Error).message}`);
      }
    }
    
    // 步骤8: 数据库返回的完整错误
    if (supabaseError) {
      addDebugLog(`【步骤8】数据库返回的完整错误：\n${JSON.stringify(supabaseError, null, 2)}`);
      setError(supabaseError.message || '注册失败');
    }
    
    addDebugLog('=== 调试日志结束 ===');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? '注册账户' : '登录'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? '创建新的管理员账户' : '登录到巴厘岛房产管理系统'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱地址
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入您的邮箱"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入您的密码"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? '注册' : '登录'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading}
            >
              {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← 返回首页
            </Link>
          </div>

          {isSignUp && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">注册说明:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• 注册成功后，管理员会为您分配相应权限</li>
                <li>• 超级管理员可以管理所有房源和用户</li>
                <li>• 房源管理员可以管理自己的房源</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Debug Panel */}
      <Card className="w-full max-w-4xl mt-6">
        <CardHeader>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDebug(!showDebug)}
            className="w-full flex items-center justify-between"
          >
            <span>Debug Panel</span>
            {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CardHeader>
        {showDebug && (
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
                {debugLogs.length === 0 ? (
                  <div className="text-gray-500">执行注册操作查看调试日志...</div>
                ) : (
                  debugLogs.map((log, index) => (
                    <div key={index} className="mb-2 whitespace-pre-wrap">
                      {log}
                    </div>
                  ))
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDebugLogs([])}
                className="w-full"
              >
                清空日志
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Login;