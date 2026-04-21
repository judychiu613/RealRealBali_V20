import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 常用国家电话区号
const COUNTRY_CODES = [
  { code: '+86', country: '中国', flag: '🇨🇳', countryEn: 'China' },
  { code: '+62', country: '印度尼西亚', flag: '🇮🇩', countryEn: 'Indonesia' },
  { code: '+1', country: '美国', flag: '🇺🇸', countryEn: 'United States' },
  { code: '+44', country: '英国', flag: '🇬🇧', countryEn: 'United Kingdom' },
  { code: '+81', country: '日本', flag: '🇯🇵', countryEn: 'Japan' },
  { code: '+82', country: '韩国', flag: '🇰🇷', countryEn: 'South Korea' },
  { code: '+65', country: '新加坡', flag: '🇸🇬', countryEn: 'Singapore' },
  { code: '+60', country: '马来西亚', flag: '🇲🇾', countryEn: 'Malaysia' },
  { code: '+66', country: '泰国', flag: '🇹🇭', countryEn: 'Thailand' },
  { code: '+84', country: '越南', flag: '🇻🇳', countryEn: 'Vietnam' },
  { code: '+63', country: '菲律宾', flag: '🇵🇭', countryEn: 'Philippines' },
  { code: '+91', country: '印度', flag: '🇮🇳', countryEn: 'India' },
  { code: '+61', country: '澳大利亚', flag: '🇦🇺', countryEn: 'Australia' },
  { code: '+33', country: '法国', flag: '🇫🇷', countryEn: 'France' },
  { code: '+49', country: '德国', flag: '🇩🇪', countryEn: 'Germany' },
];

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  language?: 'zh' | 'en';
}

export function PhoneInput({ 
  value = '', 
  onChange, 
  placeholder = '',
  className = '',
  error = false,
  language = 'zh'
}: PhoneInputProps) {
  // 解析当前值中的区号和号码
  const parsePhoneValue = (phoneValue: string) => {
    const countryCode = COUNTRY_CODES.find(cc => phoneValue.startsWith(cc.code));
    if (countryCode) {
      return {
        countryCode: countryCode.code,
        phoneNumber: phoneValue.slice(countryCode.code.length).trim()
      };
    }
    return {
      countryCode: '+86', // 默认中国区号
      phoneNumber: phoneValue
    };
  };

  const { countryCode, phoneNumber } = parsePhoneValue(value);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);

  const handleCountryCodeChange = (newCountryCode: string) => {
    setSelectedCountryCode(newCountryCode);
    const newValue = `${newCountryCode} ${phoneNumber}`.trim();
    onChange?.(newValue);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    const newValue = `${selectedCountryCode} ${newPhoneNumber}`.trim();
    onChange?.(newValue);
  };

  const selectedCountry = COUNTRY_CODES.find(cc => cc.code === selectedCountryCode);

  return (
    <div className="flex">
      {/* 国家区号选择器 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`h-12 px-3 rounded-none border-x-0 border-t-0 border-b bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-all flex items-center gap-2 shrink-0 ${
              error ? 'border-destructive' : 'border-border'
            }`}
          >
            <span className="text-lg">{selectedCountry?.flag}</span>
            <span className="text-sm font-medium">{selectedCountryCode}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {COUNTRY_CODES.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => handleCountryCodeChange(country.code)}
              className="flex items-center gap-3 py-2"
            >
              <span className="text-lg">{country.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{country.code}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'zh' ? country.country : country.countryEn}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 电话号码输入框 */}
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-3 focus-visible:ring-0 focus-visible:border-primary transition-all flex-1 ${
          error ? 'border-destructive' : 'border-border'
        } ${className}`}
      />
    </div>
  );
}