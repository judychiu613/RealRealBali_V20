import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // 注册新用户
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage('注册失败: ' + error.message);
        } else if (data.user) {
          setMessage('注册成功！请检查邮箱验证链接。');
        }
      } else {
        // 登录
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage('登录失败: ' + error.message);
        } else if (data.user) {
          setMessage('登录成功！正在跳转...');
          // 等待一下让用户看到成功消息，然后跳转
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1500);
        }
      }
    } catch (error) {
      setMessage('操作失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setMessage(`当前用户: ${user.email} (ID: ${user.id})`);
    } else {
      setMessage('当前未登录');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage('登出失败: ' + error.message);
    } else {
      setMessage('已登出');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '400px', 
      margin: '50px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>🔐 用户认证</h1>
        <a href="/" style={{ color: '#3498db', textDecoration: 'none' }}>← 返回首页</a>
      </header>

      <form onSubmit={handleAuth} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            邮箱:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="输入您的邮箱"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            密码:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="输入您的密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSignUp ? '#2ecc71' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '处理中...' : (isSignUp ? '注册' : '登录')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3498db',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={checkCurrentUser}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          检查当前用户
        </button>
        <button
          onClick={signOut}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          登出
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          backgroundColor: message.includes('失败') || message.includes('错误') ? '#f8d7da' : '#d4edda',
          color: message.includes('失败') || message.includes('错误') ? '#721c24' : '#155724',
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>测试说明:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>注册一个新账户</li>
          <li>登录成功后会自动跳转到管理后台</li>
          <li>我会将您的账户设置为超级管理员</li>
          <li>然后您就可以使用完整的管理功能了</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleLogin;