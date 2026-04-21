import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Currency, TRANSLATIONS } from '@/lib/index';

interface AppContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  /**
   * 多语言翻译函数，支持嵌套路径如 'nav.home'
   */
  t: (path: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider 负责全局语言和货币状态的管理与持久化
 * 现在集成了用户偏好设置
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [currency, setCurrencyState] = useState<Currency>('IDR');
  const [isLoaded, setIsLoaded] = useState(false);

  // 客户端挂载后从本地存储恢复设置
  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    const savedCurrency = localStorage.getItem('app_currency') as Currency;

    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }

    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'IDR' || savedCurrency === 'CNY')) {
      setCurrencyState(savedCurrency);
    } else {
      // 如果没有保存的货币设置，默认使用IDR
      setCurrencyState('IDR');
    }
    
    setIsLoaded(true);
    
    // 监听用户偏好设置加载事件
    const handleUserPreferences = (event: CustomEvent) => {
      const { language, currency } = event.detail;
      console.log('Applying user preferences:', { language, currency });
      
      if (language && (language === 'zh' || language === 'en')) {
        setLanguageState(language);
        localStorage.setItem('app_language', language);
        document.documentElement.lang = language;
      }
      
      if (currency && (currency === 'USD' || currency === 'IDR' || currency === 'CNY')) {
        setCurrencyState(currency);
        localStorage.setItem('app_currency', currency);
      }
    };
    
    window.addEventListener('userPreferencesLoaded', handleUserPreferences as EventListener);
    
    return () => {
      window.removeEventListener('userPreferencesLoaded', handleUserPreferences as EventListener);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    console.log(`[AppContext] Setting language to: ${lang}`);
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    // 更改 HTML lang 属性以便无障碍访问
    document.documentElement.lang = lang;
    // ⚠️ 注意：不再主动修改 URL，URL 由路由层控制
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('app_currency', curr);
  };

  /**
   * 递归查找翻译字典中的路径
   */
  const t = (path: string): string => {
    const keys = path.split('.');
    const safeLanguage = (language === 'zh' || language === 'en') ? language : 'zh';
    let result: any = TRANSLATIONS[safeLanguage];

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        // 如果当前语言缺失，尝试回退到英语
        let fallback: any = TRANSLATIONS['en'];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
            fallback = fallback[fallbackKey];
          } else {
            return path;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }

    return typeof result === 'string' ? result : path;
  };

  // 如果还没有加载完成，显示加载状态
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        language: (language === 'zh' || language === 'en') ? language : 'zh',
        currency,
        setLanguage,
        setCurrency,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * 使用应用上下文的 Hook
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}