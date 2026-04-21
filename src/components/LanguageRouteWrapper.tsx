/**
 * 语言路由包装器
 * 负责校验 URL 中的语言参数，并同步到 Context
 */
import { useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { isSupportedLanguage, type SupportedLanguage } from '@/lib/languageUtils';

export function LanguageRouteWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. 校验 lang 参数
    if (!isSupportedLanguage(lang)) {
      // 无效语言：重定向到当前语言版本
      const fallbackLang = language || 'zh';
      const pathWithoutLang = location.pathname.replace(/^\/[^/]*/, '');
      const newPath = `/${fallbackLang}${pathWithoutLang}${location.search}${location.hash}`;
      
      console.warn(`[LanguageRouteWrapper] Invalid language "${lang}", redirecting to ${newPath}`);
      navigate(newPath, { replace: true });
      return;
    }

    // 2. URL 语言与 Context 不一致：以 URL 为准（单向同步）
    if (lang !== language) {
      console.log(`[LanguageRouteWrapper] Syncing language from URL: ${lang}`);
      setLanguage(lang);
    }
  }, [lang, language, setLanguage, navigate, location.pathname, location.search, location.hash]);

  // 语言校验通过，渲染子路由
  if (!isSupportedLanguage(lang)) {
    return null; // 等待重定向
  }

  return <Outlet />;
}
