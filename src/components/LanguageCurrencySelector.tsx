import React, { useState } from 'react';
import { Globe, ChevronDown, CircleDollarSign, Check, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { switchLanguageInPath } from '@/lib/languageUtils';
// import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CURRENCIES, Language, Currency } from '@/lib/index';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

/**
 * 语言选项配置
 */
const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

/**
 * 优雅的语言与货币选择器组件
 * 采用都会极简主义风格，提供流畅的交互体验
 */
export function LanguageCurrencySelector() {
  const { language, currency, setLanguage, setCurrency, t } = useApp();
  // const { updatePreferences } = useUserPreferences();
  const [showCurrencyWarning, setShowCurrencyWarning] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<Currency | null>(null);

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const currentCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = async (newLanguage: Language) => {
    const currentFullPath = `${location.pathname}${location.search}${location.hash}`;
    const newPath = switchLanguageInPath(currentFullPath, newLanguage);
    
    console.log(`[LanguageSelector] Switching from ${language} to ${newLanguage}`);
    console.log(`[LanguageSelector] Current path: ${currentFullPath}`);
    console.log(`[LanguageSelector] New path: ${newPath}`);
    
    // 导航到新路径（触发 URL 变化，LanguageRouteWrapper 会自动同步到 Context）
    navigate(newPath, { replace: true });
    
    // 同时更新用户偏好设置
    // await updatePreferences({ preferred_language: newLanguage });
  };

  const handleCurrencyChange = async (newCurrency: Currency) => {
    // 如果切换到IDR且当前不是IDR，直接切换
    if (newCurrency === 'IDR' && currency !== 'IDR') {
      setCurrency(newCurrency);
      // await updatePreferences({ preferred_currency: newCurrency });
    } else if (currency === 'IDR' && newCurrency !== 'IDR') {
      // 从 IDR 切换到其他货币时显示警告
      setPendingCurrency(newCurrency);
      setShowCurrencyWarning(true);
    } else if (currency !== 'IDR' && newCurrency !== 'IDR') {
      // 非IDR之间的切换也显示警告
      setPendingCurrency(newCurrency);
      setShowCurrencyWarning(true);
    } else {
      // 其他情况直接切换
      setCurrency(newCurrency);
      // await updatePreferences({ preferred_currency: newCurrency });
    }
  };

  const confirmCurrencyChange = async () => {
    if (pendingCurrency) {
      setCurrency(pendingCurrency);
      // await updatePreferences({ preferred_currency: pendingCurrency });
      setPendingCurrency(null);
    }
    setShowCurrencyWarning(false);
  };

  const cancelCurrencyChange = () => {
    setPendingCurrency(null);
    setShowCurrencyWarning(false);
  };

  return (
    <div className="flex items-center gap-0.5 sm:gap-2">
      {/* 语言选择器 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase hover:bg-black/5 transition-all duration-300"
          >
            <span>{currentLanguage.name}</span>
            <ChevronDown className="w-2.5 h-2.5 ml-0.5 sm:ml-1 opacity-40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 p-1 border border-border/20 luxury-glass">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center justify-between cursor-pointer text-[11px] py-2 px-3 transition-colors duration-200",
                language === lang.code ? "bg-primary/5 font-semibold" : "hover:bg-primary/5"
              )}
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="w-3 h-3 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 视觉分割线 */}
      <div className="w-px h-4 bg-border/40 mx-1" />

      {/* 货币选择器 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase hover:bg-black/5 transition-all duration-300"
          >
            <span className="font-mono">{currency}</span>
            <ChevronDown className="w-2.5 h-2.5 ml-0.5 sm:ml-1 opacity-40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1 border border-border/20 luxury-glass">
          {CURRENCIES.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={cn(
                "flex items-center justify-between cursor-pointer text-[11px] py-2.5 px-3 transition-colors duration-200",
                currency === curr.code ? "bg-primary/5 font-semibold" : "hover:bg-primary/5"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[12px]">{curr.code}</span>
                <span className="text-[10px] text-muted-foreground uppercase opacity-70">
                  {curr.label.split(' - ')[1]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/60 font-mono">{curr.symbol}</span>
                {currency === curr.code && <Check className="w-3 h-3 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 货币切换提醒弹窗 */}
      <AlertDialog open={showCurrencyWarning} onOpenChange={setShowCurrencyWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {t('common.currencyWarningTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              {t('common.currencyWarningMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCurrencyChange}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCurrencyChange}>
              {t('common.understand')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}