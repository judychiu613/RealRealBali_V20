import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODES, CountryCode } from '@/data/countryCodes';
import { useApp } from '@/contexts/AppContext';

interface CountryCodeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CountryCodeSelector({ value, onValueChange, className }: CountryCodeSelectorProps) {
  const { language } = useApp();
  
  // 找到当前选中的国家
  const selectedCountry = COUNTRY_CODES.find(country => country.dialCode === value);
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-32 ${className}`}>
        <SelectValue>
          {selectedCountry && (
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="text-sm font-mono">{selectedCountry.dialCode}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {COUNTRY_CODES.map((country) => (
          <SelectItem key={country.code} value={country.dialCode}>
            <div className="flex items-center gap-3 w-full">
              <span className="text-base">{country.flag}</span>
              <span className="text-sm font-mono min-w-[60px]">{country.dialCode}</span>
              <span className="text-sm flex-1 truncate">
                {country.name[language]}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}