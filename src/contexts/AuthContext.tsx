import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: {
    fullName: string;
    countryCode: string;
    phoneNumber: string;
    preferredLanguage: string;
    preferredCurrency: string;
  }) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // 登录成功后获取用户偏好设置
    if (!error && data.user) {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('preferred_language, preferred_currency')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          // 发送自定义事件通知应用偏好设置
          window.dispatchEvent(new CustomEvent('userPreferencesLoaded', {
            detail: {
              language: profile.preferred_language || 'zh',
              currency: profile.preferred_currency || 'CNY'
            }
          }));
        }
      } catch (err) {
        console.error('Error loading user preferences:', err);
      }
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: {
    fullName: string;
    countryCode: string;
    phoneNumber: string;
    preferredLanguage: string;
    preferredCurrency: string;
  }) => {
    try {
      console.log('Attempting to sign up user:', email, userData);
      
      // 标准Supabase Auth注册
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      console.log('SignUp result:', { 
        user: data.user?.id, 
        session: !!data.session,
        error: error?.message 
      });
      
      if (error) {
        console.error('SignUp error details:', error);
        return { error };
      }
      
      // 注册成功，创建用户配置文件
      if (data.user) {
        console.log('User created successfully, creating profile...');
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            full_name: userData?.fullName || '',
            role: 'user',
            is_active: true,
            preferred_language: userData?.preferredLanguage || 'zh',
            preferred_currency: userData?.preferredCurrency || 'CNY',
            country_code: userData?.countryCode || '',
            phone_number: userData?.phoneNumber || ''
          });
          
        if (profileError) {
          console.warn('Profile creation failed:', profileError.message);
        } else {
          console.log('Profile created successfully');
        }
      }
      
      return { error: null as any, data };
    } catch (err) {
      console.error('SignUp unexpected error:', err);
      return { error: { message: 'Registration failed: ' + (err as Error).message } as any };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};