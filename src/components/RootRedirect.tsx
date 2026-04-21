/**
 * 根路径智能重定向组件
 * 根据用户偏好、浏览器语言或默认语言重定向到对应的语言版本
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type SupportedLanguage } from '@/lib/languageUtils';

function detectPreferredLanguage(): SupportedLanguage {
  // 1. 优先读取用户偏好
  const savedLang = localStorage.getItem('app_language');
  if (savedLang === 'zh' || savedLang === 'en') {
    console.log(`[RootRedirect] Using saved language: ${savedLang}`);
    return savedLang;
  }

  // 2. 检测浏览器语言
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    console.log(`[RootRedirect] Detected browser language: zh`);
    return 'zh';
  }
  if (browserLang.startsWith('en')) {
    console.log(`[RootRedirect] Detected browser language: en`);
    return 'en';
  }

  // 3. 默认中文
  console.log(`[RootRedirect] Using default language: zh`);
  return 'zh';
}

export function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const preferredLang = detectPreferredLanguage();
    console.log(`[RootRedirect] Redirecting to /${preferredLang}/`);
    navigate(`/${preferredLang}/`, { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
