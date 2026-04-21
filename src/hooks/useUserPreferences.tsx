import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface UserPreferences {
  preferred_language: 'zh' | 'en';
  preferred_currency: 'USD' | 'CNY' | 'IDR';
  country_code: string | null;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  preferred_language: 'zh',
  preferred_currency: 'CNY',
  country_code: null,
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: async () => {},
  loading: false,
});

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider = ({ children }: UserPreferencesProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  // 简化版本：只使用localStorage
  const getLocalPreferences = (): UserPreferences => {
    try {
      const stored = localStorage.getItem('user_preferences');
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error reading preferences from localStorage:', error);
    }
    return defaultPreferences;
  };

  const saveLocalPreferences = (prefs: UserPreferences) => {
    try {
      localStorage.setItem('user_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    saveLocalPreferences(updatedPreferences);
  };

  // 初始化
  useEffect(() => {
    const localPrefs = getLocalPreferences();
    setPreferences(localPrefs);
  }, []);

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        loading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

// 货币格式化工具函数
export const formatPrice = (price: number, currency: 'USD' | 'CNY' | 'IDR') => {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    CNY: new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }),
    IDR: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }),
  };

  return formatters[currency].format(price);
};

// 语言文本工具函数
export const getLocalizedText = (
  text: { zh: string; en: string } | string,
  language: 'zh' | 'en'
): string => {
  if (typeof text === 'string') {
    return text;
  }
  return text[language] || text.zh || text.en || '';
};