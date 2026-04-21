import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { TRANSLATIONS } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';
import { CountryCodeSelector } from '@/components/CountryCodeSelector';

const UserAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp, user } = useAuth();
  const { language } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';  
  const t = TRANSLATIONS[language];

  // 如果已登录，重定向到指定页面或首页
  React.useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // 注册时的表单验证
    if (isSignUp) {
      if (!fullName.trim()) {
        setError(language === 'zh' ? '请输入用户名' : 'Please enter your name');
        setLoading(false);
        return;
      }
      if (!phoneNumber.trim()) {
        setError(language === 'zh' ? '请输入电话号码' : 'Please enter your phone number');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError(language === 'zh' ? '密码至少需要6位字符' : 'Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      const { error } = isSignUp 
        ? await signUp(email, password, {
            fullName: fullName.trim(),
            countryCode,
            phoneNumber: phoneNumber.trim(),
            preferredLanguage: language,
            preferredCurrency: language === 'zh' ? 'CNY' : 'USD'
          })
        : await signIn(email, password);

      if (error) {
        console.error('Form submission error:', error);
        // 显示更友好的错误信息
        const errorMessage = typeof error === 'string' ? error : (error as any)?.message || '';
        if (errorMessage.includes('User already registered')) {
          setError(language === 'zh' ? '该邮箱已被注册，请直接登录' : 'Email already registered, please sign in');
        } else if (errorMessage.includes('Invalid email')) {
          setError(language === 'zh' ? '邮箱格式不正确' : 'Invalid email format');
        } else if (errorMessage.includes('Password')) {
          setError(language === 'zh' ? '密码不符合要求' : 'Password does not meet requirements');
        } else {
          setError(errorMessage || (language === 'zh' ? '操作失败，请重试' : 'Operation failed, please try again'));
        }
      } else {
        if (isSignUp) {
          setSuccess(language === 'zh' 
            ? '注册成功！请检查邮箱验证链接（如果没有收到，请检查垃圾邮件箱）。配置文件已自动创建。' 
            : 'Registration successful! Please check your email for verification link (also check your spam folder). Profile created automatically.');
          // 清空表单
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFullName('');
          setPhoneNumber('');
          setIsSignUp(false);
        } else {
          // 登录成功，重定向到原页面或首页
          navigate(redirectTo);
        }
      }
    } catch (err) {
      setError(language === 'zh' ? '操作失败，请重试' : 'Operation failed, please try again');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 返回按钮 */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'zh' ? '返回' : 'Back'}
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp 
                ? (language === 'zh' ? '创建账户' : 'Create Account')
                : (language === 'zh' ? '登录账户' : 'Sign In')
              }
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? (language === 'zh' ? '注册账户以收藏房源和管理个人信息' : 'Register to save favorites and manage your profile')
                : (language === 'zh' ? '登录您的账户以访问收藏和个人设置' : 'Sign in to access your favorites and profile')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 注册时的额外字段 */}
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    {language === 'zh' ? '用户名' : 'Full Name'}
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={language === 'zh' ? '请输入用户名' : 'Enter your full name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'zh' ? '电话号码' : 'Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <CountryCodeSelector
                      value={countryCode}
                      onValueChange={setCountryCode}
                      className="flex-shrink-0"
                    />
                    <Input
                      type="tel"
                      placeholder={language === 'zh' ? '请输入电话号码' : 'Enter phone number'}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {language === 'zh' ? '邮箱地址' : 'Email Address'}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'zh' ? '请输入邮箱地址' : 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {language === 'zh' ? '密码' : 'Password'}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'zh' ? '请输入密码' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* 注册时的确认密码字段 */}
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    {language === 'zh' ? '确认密码' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={language === 'zh' ? '请再次输入密码' : 'Confirm your password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {isSignUp && (
                <Alert>
                  <AlertDescription className="text-gray-600">
                    {language === 'zh' 
                      ? <>
                          💡 小贴士：注册成功后，您会收到邮箱验证邮件，<span className="text-red-600 font-medium">请登录邮箱查收并点击确认完成注册</span>。如未收到，请检查垃圾邮件箱。
                        </>
                      : <>
                          💡 Tip: After registration, you will receive an email verification. <span className="text-red-600 font-medium">Please check your email and click the confirmation link to complete registration</span>. If not received, please check your spam folder.
                        </>
                    }
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp 
                  ? (language === 'zh' ? '注册账户' : 'Create Account')
                  : (language === 'zh' ? '登录' : 'Sign In')
                }
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  // 清空表单
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
                  setPhoneNumber('');
                }}
                className="text-sm"
              >
                {isSignUp 
                  ? (language === 'zh' ? '已有账户？点击登录' : 'Already have an account? Sign in')
                  : (language === 'zh' ? '没有账户？点击注册' : "Don't have an account? Sign up")
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuth;