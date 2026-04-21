/**
 * 全球国家区号数据
 * 包含世界各国的国家代码、区号、国旗和国家名称
 */

export interface CountryCode {
  code: string;        // 国家代码 (ISO 3166-1 alpha-2)
  dialCode: string;    // 电话区号
  flag: string;        // 国旗 emoji
  name: {
    zh: string;        // 中文名称
    en: string;        // 英文名称
  };
}

export const COUNTRY_CODES: CountryCode[] = [
  // 亚洲
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: { zh: '中国', en: 'China' } },
  { code: 'ID', dialCode: '+62', flag: '🇮🇩', name: { zh: '印度尼西亚', en: 'Indonesia' } },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: { zh: '新加坡', en: 'Singapore' } },
  { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: { zh: '马来西亚', en: 'Malaysia' } },
  { code: 'TH', dialCode: '+66', flag: '🇹🇭', name: { zh: '泰国', en: 'Thailand' } },
  { code: 'VN', dialCode: '+84', flag: '🇻🇳', name: { zh: '越南', en: 'Vietnam' } },
  { code: 'PH', dialCode: '+63', flag: '🇵🇭', name: { zh: '菲律宾', en: 'Philippines' } },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: { zh: '日本', en: 'Japan' } },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: { zh: '韩国', en: 'South Korea' } },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: { zh: '印度', en: 'India' } },
  { code: 'HK', dialCode: '+852', flag: '🇭🇰', name: { zh: '香港', en: 'Hong Kong' } },
  { code: 'TW', dialCode: '+886', flag: '🇹🇼', name: { zh: '台湾', en: 'Taiwan' } },
  { code: 'MO', dialCode: '+853', flag: '🇲🇴', name: { zh: '澳门', en: 'Macau' } },
  
  // 北美洲
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: { zh: '美国', en: 'United States' } },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: { zh: '加拿大', en: 'Canada' } },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: { zh: '墨西哥', en: 'Mexico' } },
  
  // 欧洲
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: { zh: '英国', en: 'United Kingdom' } },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: { zh: '德国', en: 'Germany' } },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: { zh: '法国', en: 'France' } },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: { zh: '意大利', en: 'Italy' } },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: { zh: '西班牙', en: 'Spain' } },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: { zh: '荷兰', en: 'Netherlands' } },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: { zh: '瑞士', en: 'Switzerland' } },
  { code: 'AT', dialCode: '+43', flag: '🇦🇹', name: { zh: '奥地利', en: 'Austria' } },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: { zh: '比利时', en: 'Belgium' } },
  { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: { zh: '瑞典', en: 'Sweden' } },
  { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: { zh: '挪威', en: 'Norway' } },
  { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: { zh: '丹麦', en: 'Denmark' } },
  { code: 'FI', dialCode: '+358', flag: '🇫🇮', name: { zh: '芬兰', en: 'Finland' } },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: { zh: '俄罗斯', en: 'Russia' } },
  { code: 'PL', dialCode: '+48', flag: '🇵🇱', name: { zh: '波兰', en: 'Poland' } },
  { code: 'CZ', dialCode: '+420', flag: '🇨🇿', name: { zh: '捷克', en: 'Czech Republic' } },
  { code: 'HU', dialCode: '+36', flag: '🇭🇺', name: { zh: '匈牙利', en: 'Hungary' } },
  { code: 'GR', dialCode: '+30', flag: '🇬🇷', name: { zh: '希腊', en: 'Greece' } },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: { zh: '葡萄牙', en: 'Portugal' } },
  { code: 'IE', dialCode: '+353', flag: '🇮🇪', name: { zh: '爱尔兰', en: 'Ireland' } },
  
  // 大洋洲
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: { zh: '澳大利亚', en: 'Australia' } },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: { zh: '新西兰', en: 'New Zealand' } },
  
  // 中东
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: { zh: '阿联酋', en: 'United Arab Emirates' } },
  { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: { zh: '沙特阿拉伯', en: 'Saudi Arabia' } },
  { code: 'QA', dialCode: '+974', flag: '🇶🇦', name: { zh: '卡塔尔', en: 'Qatar' } },
  { code: 'KW', dialCode: '+965', flag: '🇰🇼', name: { zh: '科威特', en: 'Kuwait' } },
  { code: 'BH', dialCode: '+973', flag: '🇧🇭', name: { zh: '巴林', en: 'Bahrain' } },
  { code: 'OM', dialCode: '+968', flag: '🇴🇲', name: { zh: '阿曼', en: 'Oman' } },
  { code: 'IL', dialCode: '+972', flag: '🇮🇱', name: { zh: '以色列', en: 'Israel' } },
  { code: 'TR', dialCode: '+90', flag: '🇹🇷', name: { zh: '土耳其', en: 'Turkey' } },
  
  // 非洲
  { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: { zh: '南非', en: 'South Africa' } },
  { code: 'EG', dialCode: '+20', flag: '🇪🇬', name: { zh: '埃及', en: 'Egypt' } },
  { code: 'NG', dialCode: '+234', flag: '🇳🇬', name: { zh: '尼日利亚', en: 'Nigeria' } },
  { code: 'KE', dialCode: '+254', flag: '🇰🇪', name: { zh: '肯尼亚', en: 'Kenya' } },
  { code: 'MA', dialCode: '+212', flag: '🇲🇦', name: { zh: '摩洛哥', en: 'Morocco' } },
  { code: 'GH', dialCode: '+233', flag: '🇬🇭', name: { zh: '加纳', en: 'Ghana' } },
  
  // 南美洲
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: { zh: '巴西', en: 'Brazil' } },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: { zh: '阿根廷', en: 'Argentina' } },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: { zh: '智利', en: 'Chile' } },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: { zh: '哥伦比亚', en: 'Colombia' } },
  { code: 'PE', dialCode: '+51', flag: '🇵🇪', name: { zh: '秘鲁', en: 'Peru' } },
  { code: 'VE', dialCode: '+58', flag: '🇻🇪', name: { zh: '委内瑞拉', en: 'Venezuela' } },
  { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: { zh: '乌拉圭', en: 'Uruguay' } },
  
  // 其他重要国家
  { code: 'BD', dialCode: '+880', flag: '🇧🇩', name: { zh: '孟加拉国', en: 'Bangladesh' } },
  { code: 'PK', dialCode: '+92', flag: '🇵🇰', name: { zh: '巴基斯坦', en: 'Pakistan' } },
  { code: 'LK', dialCode: '+94', flag: '🇱🇰', name: { zh: '斯里兰卡', en: 'Sri Lanka' } },
  { code: 'MM', dialCode: '+95', flag: '🇲🇲', name: { zh: '缅甸', en: 'Myanmar' } },
  { code: 'KH', dialCode: '+855', flag: '🇰🇭', name: { zh: '柬埔寨', en: 'Cambodia' } },
  { code: 'LA', dialCode: '+856', flag: '🇱🇦', name: { zh: '老挝', en: 'Laos' } },
  { code: 'BN', dialCode: '+673', flag: '🇧🇳', name: { zh: '文莱', en: 'Brunei' } },
  { code: 'MV', dialCode: '+960', flag: '🇲🇻', name: { zh: '马尔代夫', en: 'Maldives' } },
];

/**
 * 根据区号查找国家信息
 */
export const findCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(country => country.dialCode === dialCode);
};

/**
 * 根据国家代码查找国家信息
 */
export const findCountryByCode = (code: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(country => country.code === code);
};

/**
 * 获取默认国家（印尼，因为是巴厘岛房产网站）
 */
export const getDefaultCountry = (): CountryCode => {
  return findCountryByCode('ID') || COUNTRY_CODES[0];
};