/**
 * 路由常量定义
 * 前台路由需要语言前缀，管理后台路由不需要
 */
export const ROUTE_PATHS = {
  // 前台路由（需要语言前缀）
  HOME: (lang: Language) => `/${lang}/`,
  PROPERTIES: (lang: Language) => `/${lang}/properties`,
  PROPERTY_DETAIL: (lang: Language, id: string) => `/${lang}/property/${id}`,
  ABOUT: (lang: Language) => `/${lang}/about`,
  CONTACT: (lang: Language) => `/${lang}/contact`,
  LOGIN: (lang: Language) => `/${lang}/login`,
  REGISTER: (lang: Language) => `/${lang}/register`,
  PROFILE: (lang: Language) => `/${lang}/profile`,
  FAVORITES: (lang: Language) => `/${lang}/favorites`,
  // Blog 路由
  BLOG: (lang: Language) => `/${lang}/blog`,
  BLOG_POST: (lang: Language, slug: string) => `/${lang}/blog/${slug}`,
  
  // 管理后台路由（不需要语言前缀）
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_PROPERTIES_CREATE: '/admin/properties/create',
  ADMIN_PROPERTIES_PENDING: '/admin/properties/pending',
  ADMIN_PROPERTIES_LOGS: '/admin/properties/logs',
  ADMIN_ANALYTICS_MEMBERS: '/admin/analytics/members',
  ADMIN_ANALYTICS_LISTINGS: '/admin/analytics/listings',
  ADMIN_DEBUG: '/admin/debug',
  ADMIN_PENDING: '/admin/pending',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_LOGS: '/admin/logs',
} as const;

/**
 * 滚动到页面顶部的工具函数
 */
export const scrollToTop = () => {
  // 使用setTimeout确保在React状态更新后执行
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, 0);
};

/**
 * 时区处理工具函数
 */
export const formatLocalTime = (utcTimeString: string, locale: string = 'zh-CN'): string => {
  const date = new Date(utcTimeString);
  return date.toLocaleString(locale, {
    timeZone: 'Asia/Jakarta', // 巴厘岛时区 (GMT+8)
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatLocalDate = (utcTimeString: string, locale: string = 'zh-CN'): string => {
  const date = new Date(utcTimeString);
  return date.toLocaleDateString(locale, {
    timeZone: 'Asia/Jakarta', // 巴厘岛时区 (GMT+8)
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 语言与货币类型定义
 */
export type Language = 'zh' | 'en';
export type Currency = 'USD' | 'IDR' | 'CNY';

/**
 * 货币配置
 */
export const CURRENCIES: { code: Currency; symbol: string; label: string; rate: number }[] = [
  { code: 'USD', symbol: '$', label: 'USD - 美元', rate: 1 },
  { code: 'IDR', symbol: 'Rp', label: 'IDR - 印尼盾', rate: 15800 },
  { code: 'CNY', symbol: '¥', label: 'CNY - 人民币', rate: 7.25 },
];

/**
 * 房产标签类型
 */
export type PropertyTag = 
  | '靠海滩500米' 
  | '海景房' 
  | '自然风景房' 
  | '私人沙滩' 
  | '山景房' 
  | '稻田景观' 
  | '市中心' 
  | '高尔夫球场' 
  | '温泉度假村'
  | '生态建筑'
  | '瑜伽空间'
  | '冲浪'
  | '私人花园'
  | '私人码头'
  | '直升机停机坪'
  | '私人瀑布'
  | '无边际泳池'
  | '管家服务'
  | '艺术工作室'
  | '高天花板'
  | '水上运动'
  | '禅意花园'
  | '茶室'
  | '历史建筑'
  | '私人博物馆'
  | '湖景房'
  | '有机菜园'
  | '专业训练'
  | '蝴蝶保护区'
  | '观星台'
  | '天文望远镜'
  | '海豚观赏'
  | '游艇码头'
  | '香料花园'
  | '烹饪课程'
  | '火山景观'
  | '温泉浴池'
  | '潜水基地'
  | '珊瑚礁'
  | '咖啡庄园'
  | '品鉴室'
  | '海湾景观'
  | '米其林餐厅'
  | '野生动物'
  | '树屋设计'
  | '白沙海滩'
  | 'spa服务'
  | '艺术画廊'
  | '艺术沙龙'
  | '冲浪学院'
  | '瑜伽中心'
  | '冥想花园'
  | '海龟保护'
  | '生态研究'
  | '植物园'
  | '草药治疗'
  | '风筝冲浪'
  | '装备租赁'
  | '摄影工作室'
  | '专业设备'
  | '音乐制作'
  | '录音室'
  | '极度私密'
  | '天体海滩'
  | '蜜月专用'
  | '浪漫设计'
  | '商务中心'
  | '网络活动'
  | '数字游民'
  | '共享办公'
  | '无障碍设计'
  | '医疗设施'
  | '儿童设施'
  | '家庭友好'
  | '宠物友好'
  | '兽医服务'
  | '极限运动'
  | '专业教练'
  | '美食庄园'
  | '米其林厨师'
  | '未来科技'
  | 'AI管家';

/**
 * 房产信息接口 (增强多语言支持)
 */
/**
 * 土地类型定义
 */
export interface LandZone {
  id: string;
  zh: string;
  en: string;
}

export type LandZoneType = 'Pink Zone' | 'Yellow Zone' | 'Green Zone' | 'Blue Zone' | 'White Zone';

/**
 * 二级筛选数据结构
 */
export interface FilterOption {
  id: string;
  label: Record<Language, string>;
  children?: FilterOption[];
}

/**
 * 区域筛选选项（新的市场分区结构）
 */
export const LOCATION_FILTERS: FilterOption[] = [
  {
    id: 'west-coast',
    label: { zh: '西海岸核心区', en: 'West Coast' },
    children: [
      { id: 'canggu', label: { zh: '苍古', en: 'Canggu' } },
      { id: 'pererenan', label: { zh: '佩雷雷南', en: 'Pererenan' } },
      { id: 'seseh', label: { zh: '塞塞', en: 'Seseh' } },
      { id: 'cemagi', label: { zh: '切马吉', en: 'Cemagi' } },
      { id: 'kerobokan', label: { zh: '克罗柏坎', en: 'Kerobokan' } },
      { id: 'seminyak', label: { zh: '水明漾', en: 'Seminyak' } },
      { id: 'kuta', label: { zh: '库塔', en: 'Kuta' } },
      { id: 'legian', label: { zh: '雷吉安', en: 'Legian' } }
    ]
  },
  {
    id: 'south-bukit',
    label: { zh: '南部悬崖区', en: 'South Bukit' },
    children: [
      { id: 'uluwatu', label: { zh: '乌鲁瓦图', en: 'Uluwatu' } },
      { id: 'pecatu', label: { zh: '佩卡图', en: 'Pecatu' } },
      { id: 'bingin', label: { zh: '宾金', en: 'Bingin' } },
      { id: 'ungasan', label: { zh: '乌干沙', en: 'Ungasan' } },
      { id: 'jimbaran', label: { zh: '金巴兰', en: 'Jimbaran' } },
      { id: 'nusa-dua', label: { zh: '努沙杜瓦', en: 'Nusa Dua' } },
      { id: 'benoa', label: { zh: '贝诺阿', en: 'Benoa' } }
    ]
  },
  {
    id: 'ubud-central',
    label: { zh: '乌布及中部区域', en: 'Ubud & Central Bali' },
    children: [
      { id: 'ubud-center', label: { zh: '乌布核心区', en: 'Ubud Center' } },
      { id: 'sayan', label: { zh: '萨彦', en: 'Sayan' } },
      { id: 'mas', label: { zh: '马斯', en: 'Mas' } },
      { id: 'pejeng', label: { zh: '佩姜', en: 'Pejeng' } },
      { id: 'lodtunduh', label: { zh: '洛顿图', en: 'Lodtunduh' } },
      { id: 'tegalalang', label: { zh: '德格拉朗', en: 'Tegalalang' } },
      { id: 'tampaksiring', label: { zh: '坦帕克西林', en: 'Tampaksiring' } },
      { id: 'payangan', label: { zh: '帕洋岸', en: 'Payangan' } }
    ]
  },
  {
    id: 'emerging-west',
    label: { zh: '西部新兴增长区', en: 'Emerging West' },
    children: [
      { id: 'kedungu', label: { zh: '克东古', en: 'Kedungu' } },
      { id: 'nyanyi', label: { zh: '尼亚尼', en: 'Nyanyi' } },
      { id: 'kaba-kaba', label: { zh: '卡巴卡巴', en: 'Kaba-Kaba' } },
      { id: 'cepaka', label: { zh: '切帕卡', en: 'Cepaka' } },
      { id: 'tanah-lot', label: { zh: '海神庙', en: 'Tanah Lot' } },
      { id: 'balian', label: { zh: '巴利安', en: 'Balian' } }
    ]
  },
  {
    id: 'east-bali',
    label: { zh: '东巴厘岛', en: 'East Bali' },
    children: [
      { id: 'candidasa', label: { zh: '坎迪达萨', en: 'Candidasa' } },
      { id: 'manggis', label: { zh: '曼吉斯', en: 'Manggis' } },
      { id: 'amed', label: { zh: '阿湄', en: 'Amed' } }
    ]
  },
  {
    id: 'north-bali',
    label: { zh: '北巴厘岛', en: 'North Bali' },
    children: [
      { id: 'lovina', label: { zh: '罗威纳', en: 'Lovina' } },
      { id: 'munduk', label: { zh: '蒙杜克', en: 'Munduk' } },
      { id: 'pemuteran', label: { zh: '佩母德兰', en: 'Pemuteran' } }
    ]
  },
  {
    id: 'islands',
    label: { zh: '离岛区域', en: 'Islands' },
    children: [
      { id: 'nusa-penida', label: { zh: '佩尼达岛', en: 'Nusa Penida' } },
      { id: 'nusa-lembongan', label: { zh: '蓝梦岛', en: 'Nusa Lembongan' } },
      { id: 'nusa-ceningan', label: { zh: '尼宁岛', en: 'Nusa Ceningan' } },
      { id: 'gili-islands', label: { zh: '吉利群岛', en: 'Gili Islands' } }
    ]
  }
];

/**
 * 根据area_id获取区域名称的辅助函数
 */
export function getAreaNameById(areaId: string, language: Language): string {
  // 遍历所有一级分类
  for (const parentArea of LOCATION_FILTERS) {
    // 检查是否是一级分类ID
    if (parentArea.id === areaId) {
      return parentArea.label?.[language] || parentArea.label?.zh || parentArea.label?.en || areaId;
    }
    
    // 检查二级区域
    if (parentArea.children) {
      for (const childArea of parentArea.children) {
        if (childArea.id === areaId) {
          return childArea.label?.[language] || childArea.label?.zh || childArea.label?.en || areaId;
        }
      }
    }
  }
  
  // 如果没找到，返回原始ID（作为后备）
  return areaId;
}

/**
 * 房产类型筛选选项（简化版）
 */
export const PROPERTY_TYPE_FILTERS: FilterOption[] = [
  {
    id: 'villa',
    label: { zh: '别墅', en: 'Villa' }
  },
  {
    id: 'land',
    label: { zh: '土地', en: 'Land' }
  }
];

/**
 * 房产类型接口定义（简化版）
 */
export interface PropertyType {
  id: string;
  name_en: string;
  name_zh: string;
  description_en?: string;
  description_zh?: string;
  sort_order: number;
}

/**
 * 房产信息接口 (增强多语言支持)
 */
export interface Property {
  id: string;
  slug?: string;
  title: Record<Language, string>;
  price: number; // 基准价格 (USD)
  // 新增：多货币价格支持
  priceUSD?: number; // 美元价格
  priceCNY?: number; // 人民币价格
  priceIDR?: number; // 印尼盾价格
  location: Record<Language, string>;
  area_id?: string; // 数据库中的区域ID，用于筛选
  type: Record<Language, string>;
  type_id?: string; // 数据库中的类型ID，用于筛选
  bedrooms: number;
  bathrooms: number;
  landArea: number; // 土地面积 (平方米)
  buildingArea: number; // 建筑面积 (平方米)
  buildYear?: number; // 建造年份
  image: string;
  images?: string[]; // 多张图片数组，用于图片轮播
  status: 'Available' | 'Sold' | 'Reserved' | 'Off Market';
  ownership: 'Leasehold' | 'Freehold';
  leaseholdYears?: number; // Leasehold年限（仅在ownership为Leasehold时有值）
  landZone?: LandZone | null; // 土地形式信息
  description: Record<Language, string>;
  // 数据库原始字段
  description_zh?: string;
  description_en?: string;
  featured?: boolean;
  tags: PropertyTag[];
  // 新增：中文和英文标签支持
  tags_zh?: string[];
  tags_en?: string[];
  tagsEn?: string[];
  // 新增：特色设施支持
  amenities?: string[];
  amenitiesEn?: string[];
  amenitiesZh?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Blog 相关类型定义
 */
export interface BlogPost {
  id: string;
  title: string;              // 页面展示标题
  seo_title: string;          // SEO 标题
  seo_description: string;    // SEO 描述
  slug: string;               // URL 路径
  content: string;            // Markdown 内容
  excerpt?: string;           // 摘要
  category: string;           // 栏目
  cover_image?: string;       // 封面图
  created_at: string;
  updated_at: string;
  published: boolean;
}

export const BLOG_CATEGORIES = [
  '道路千万条，安全第一条',
  '巴厘岛房产投资',
  '区域指南',
  '风土人情与生活方式',
  '投资流程',
  '未分类'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

/**
 * 格式化价格显示 (基础版本)
 */
export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * 增强版价格格式化，支持汇率转换和中文万亿格式
 */
export const formatPriceWithCurrency = (usdPrice: number, targetCurrency: Currency, language: Language = 'en') => {
  const config = CURRENCIES.find(c => c.code === targetCurrency) || CURRENCIES[0];
  const convertedPrice = usdPrice * config.rate;
  
  // 中文环境下的CNY特殊处理
  if (targetCurrency === 'CNY' && language === 'zh') {
    return formatChinesePrice(convertedPrice);
  }
  
  // 修复CNY显示为CN的问题
  let locale = 'en-US';
  if (targetCurrency === 'IDR') {
    locale = 'id-ID';
  } else if (targetCurrency === 'CNY') {
    locale = 'zh-CN'; // 使用中文本地化设置
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: targetCurrency,
    maximumFractionDigits: targetCurrency === 'IDR' ? 0 : 0,
  }).format(convertedPrice);
};

/**
 * 中文价格格式化（使用万、亿单位）
 */
export const formatChinesePrice = (price: number): string => {
  const yi = 100000000; // 1亿
  const wan = 10000; // 1万
  
  if (price >= yi) {
    const yiValue = price / yi;
    if (yiValue >= 10) {
      return `¥${Math.round(yiValue)}亿`;
    } else {
      return `¥${(yiValue).toFixed(1).replace(/\.0$/, '')}亿`;
    }
  } else if (price >= wan) {
    const wanValue = price / wan;
    if (wanValue >= 100) {
      return `¥${Math.round(wanValue)}万`;
    } else if (wanValue >= 10) {
      return `¥${Math.round(wanValue)}万`;
    } else {
      return `¥${(wanValue).toFixed(1).replace(/\.0$/, '')}万`;
    }
  } else {
    return `¥${Math.round(price).toLocaleString('zh-CN')}`;
  }
};

/**
 * 直接格式化数据库价格（不进行汇率转换）
 */
export const formatDatabasePrice = (price: number, currency: Currency, language: Language = 'en'): string => {
  if (!price || price === 0) return 'Price on request';
  
  // 中文环境下的CNY特殊处理
  if (currency === 'CNY' && language === 'zh') {
    return formatChinesePrice(price);
  }
  
  // 获取货币符号
  const config = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  // 根据货币类型设置本地化
  let locale = 'en-US';
  if (currency === 'IDR') {
    locale = 'id-ID';
  } else if (currency === 'CNY') {
    locale = 'zh-CN';
  }
  
  // 直接格式化价格，不进行汇率转换
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * 格式化土地价格为单价/are（100平方米）
 */
export const formatLandPrice = (price: number, landArea: number, currency: Currency, language: Language = 'en'): string => {
  if (!price || price === 0 || !landArea || landArea === 0) return 'Price on request';
  
  // 计算单价/are（100平方米）
  const pricePerAre = price / (landArea / 100);
  
  // 中文环境下的CNY特殊处理
  if (currency === 'CNY' && language === 'zh') {
    return `${formatChinesePrice(pricePerAre)}/百平方`;
  }
  
  // 获取货币符号
  const config = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  // 根据货币类型设置本地化
  let locale = 'en-US';
  if (currency === 'IDR') {
    locale = 'id-ID';
  } else if (currency === 'CNY') {
    locale = 'zh-CN';
  }
  
  // 格式化单价
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pricePerAre);
  
  return `${formattedPrice}/${language === 'zh' ? '百平方' : 'are'}`;
};

/**
 * 多语言翻译字典
 */
export const TRANSLATIONS = {
  zh: {
    nav: {
      home: '首页',
      properties: '购置房产',
      land: '购置土地',
      services: '专业服务',
      about: '关于我们',
      contact: '联系咨询',
    },
    hero: {
      title: '重新定义巴厘岛奢华生活',
      subtitle: 'LUXURY REAL ESTATE · BALI 2026',
      description: '我们专注于为您提供巴厘岛最极致的房产投资机会，从悬崖别墅到海滨庄园，每一处房产都代表了静奢风与自然美的完美融合。',
      cta: '探索房产',
    },
    propertyCard: {
      featured: '精选推荐',
      viewDetails: '查看详情',
      bedrooms: '卧室',
      bathrooms: '卫浴',
      land: '土地面积',
      building: '建筑面积',
      buildYear: '建造年份',
      sqm: '㎡',
      ownership: '产权形式',
      landZone: '土地类型',
      leaseholdYears: '年',
      freehold: '永久产权',
      leasehold: '租赁产权',
    },
    services: {
      title: '我们的服务',
      subtitle: '全方位的房产解决方案',
      legal: '法律咨询',
      investment: '投资建议',
      management: '物业管理',
      construction: '建筑设计',
    },
    about: {
      heroTitle: '诠释巴厘岛的静奢之道',
      heroSubtitle: '自 2014 年起，我们致力于在众神之岛为全球投资者寻觅最具灵魂的建筑杰作，将极简主义与热带自然完美融合。',
      philosophyTitle: '我们的理念',
      philosophyHeading: '不只是房产中介，更是都会极简生活的策展人',
      philosophyText1: '在巴厘岛这个充满活力的热带天堂，房产不仅是资产的配置，更是生活方式的延伸。我们推崇"静奢"（Quiet Luxury）理念——摒弃浮华的堆砌，追求质感、留白与自然的绝对平衡。',
      philosophyText2: '2026 年，巴厘岛正迎来全新的建筑复兴。我们通过深厚的当地根基与国际化审美，协助每一位客户在繁杂的市场中精准锁定具有长期增值潜力且设计卓越的珍稀物业。',
      experienceYears: '行业经验 (年)',
      successfulDeals: '成功交易案例',
      values: {
        expertise: { title: '专业前瞻', desc: '洞察 2026 市场脉络，提供超越期待的全球化资产配置方案。' },
        security: { title: '安全透明', desc: '法律团队全程护航，确保所有权属清晰、交易合规且全程可追溯。' },
        service: { title: '定制服务', desc: '从土地开发到软装交付，提供一站式私人管家服务，确保无忧入驻。' },
        quality: { title: '卓越品质', desc: '只为万分之一的精选，只推荐经得起时间考验的顶级设计作品。' }
      },
      team: {
        title: '核心团队',
        subtitle: '汇聚行业精英，为您的投资保驾护航',
        members: {
          judy: { role: '创始人', bio: '在进入巴厘岛房地产与度假资产领域之前，我曾在德勤从事八年的管理咨询与商业地产工作，参与多元品牌的策略与运营，对风险控制与资产增长有系统化理解。同时，我运营 Airbnb 超过六年，深入实践平台机制与定价逻辑，理解平台算法机制，风险应对，以及在真实市场中应如何持续创造收益。如今，我将咨询背景与一线短租经验结合，专注于提供更贴近市场本质的巴厘岛资产配置与运营建议，关注长期回报与实际落地，而非单纯的信息撮合。' },
          jacky: { role: '联合创始人', bio: '长期居住于雅加达与巴厘超过十年，期间深度参与旅游、电商及品牌运营，同时也有丰富品牌出海的实战经验，对印尼市场与在地生态有持续且真实的理解。对我来说，巴厘岛不仅是一个目的地，更是一种长期生活与经营的选择。我希望将这份热爱与经验，转化为一项可持续的事业，为更多人提供更有判断力的在地视角与决策参考。' }
        }
      },
      cta: '开始您的巴厘岛投资之旅'
    },
    contact: {
      heroTitle: '联系咨询',
      heroSubtitle: '开启您的巴厘岛投资之旅',
      heroDescription: '我们的专业团队随时为您提供个性化的房产咨询服务，从市场分析到交易完成，全程陪伴您的投资决策。',
      formTitle: '预约专属咨询',
      formSubtitle: '请填写以下信息，我们将在24小时内与您取得联系',
      form: {
        name: '姓名',
        namePlaceholder: '请输入您的姓名',
        nameError: '请输入您的姓名',
        email: '电子邮箱',
        emailPlaceholder: '请输入您的邮箱地址',
        emailError: '请输入有效的电子邮箱',
        phone: '联系电话',
        phonePlaceholder: '请输入您的联系电话',
        phoneError: '请输入有效的联系电话',
        subject: '咨询主题',
        subjectPlaceholder: '请简述您的咨询需求',
        message: '详细需求',
        messagePlaceholder: '请详细描述您的需求，包括预算范围、偏好区域、房产类型等',
        messageError: '留言内容至少包含10个字符',
        submit: '提交咨询',
        submitting: '提交中...',
        success: '咨询提交成功！我们将尽快与您联系。',
        error: '提交失败，请稍后重试。'
      },
      info: {
        title: '联系方式',
        subtitle: 'REAL REAL 总部位于巴厘岛最具活力的仓古地区，为您提供一站式的房产咨询与法律支持。',
        office: {
          title: '巴厘岛办公室',
          address: 'Jl. Raya Seminyak No. 123\nSeminyak, Badung\nBali 80361, Indonesia',
          hours: '营业时间: 周一至周六 9:00-18:00'
        },
        phone: '+62 0813 3067 6565',
        email: 'Judy@realrealbali.com',
        whatsapp: '+86 156 0600 2201'
      }
    },
    footer: {
      description: 'REAL REAL Real Estate 致力于为全球投资者提供巴厘岛最优质的房产咨询与管理服务。',
      rights: '© 2026 REAL REAL Real Estate. 保留所有权利。',
    },
    common: {
      language: '语言',
      currency: '参考售价',
      selectLanguage: '选择语言',
      selectCurrency: '选择货币',
      currencyWarningTitle: '货币切换提醒',
      currencyWarningMessage: '更换货币仅为了参考方便，由于汇率时常发生变化，最终售价以印尼盾为准。',
      understand: '我知道了',
      cancel: '取消',
      scrollToLearnMore: '下滑了解更多',
      back: '返回',
      favorite: '收藏',
      share: '分享',
      download: '下载',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      profile: '个人信息',
      favorites: '我的收藏',
      myAccount: '我的',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      fullName: '姓名',
      phone: '电话',
      save: '保存',
      edit: '编辑',
      noFavorites: '暂无收藏的房源',
      loginRequired: '请先登录',
      loginSuccess: '登录成功',
      registerSuccess: '注册成功',
      updateSuccess: '更新成功',
      error: '错误',
    }
  },
  en: {
    nav: {
      home: 'Home',
      properties: 'Villa Sale',
      land: 'Land Sale',
      services: 'Services',
      about: 'About Us',
      contact: 'Contact',
    },
    hero: {
      title: 'Redefining Bali Luxury Living',
      subtitle: 'LUXURY REAL ESTATE · BALI 2026',
      description: 'We specialize in providing the most exquisite property investment opportunities in Bali, from cliff-top villas to beachfront estates.',
      cta: 'Explore Properties',
    },
    propertyCard: {
      featured: 'Featured',
      viewDetails: 'View Details',
      bedrooms: 'Beds',
      bathrooms: 'Baths',
      land: 'Land Area',
      building: 'Building Area',
      buildYear: 'Build Year',
      sqm: 'sqm',
      ownership: 'Ownership',
      landZone: 'Land Zone',
      leaseholdYears: 'Years',
      freehold: 'Freehold',
      leasehold: 'Leasehold',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive Property Solutions',
      legal: 'Legal Consulting',
      investment: 'Investment Advice',
      management: 'Property Management',
      construction: 'Architecture & Design',
    },
    about: {
      heroTitle: 'Interpreting Bali\'s Quiet Luxury',
      heroSubtitle: 'Since 2014, we have been dedicated to finding the most soulful architectural masterpieces on the Island of Gods for global investors, perfectly blending minimalism with tropical nature.',
      philosophyTitle: 'Our Philosophy',
      philosophyHeading: 'More than real estate agents, we are curators of metropolitan minimalist living',
      philosophyText1: 'In Bali, this vibrant tropical paradise, real estate is not just asset allocation, but an extension of lifestyle. We advocate the "Quiet Luxury" philosophy—abandoning ostentatious accumulation and pursuing the absolute balance of texture, space, and nature.',
      philosophyText2: 'In 2026, Bali is experiencing a new architectural renaissance. Through our deep local roots and international aesthetics, we assist every client in precisely identifying rare properties with long-term appreciation potential and exceptional design in the complex market.',
      experienceYears: 'Years of Experience',
      successfulDeals: 'Successful Transactions',
      values: {
        expertise: { title: 'Professional Foresight', desc: 'Insight into 2026 market trends, providing global asset allocation solutions that exceed expectations.' },
        security: { title: 'Security & Transparency', desc: 'Legal team provides full escort, ensuring clear ownership, compliant transactions, and full traceability.' },
        service: { title: 'Customized Service', desc: 'From land development to soft furnishing delivery, providing one-stop private butler service for worry-free move-in.' },
        quality: { title: 'Excellence Quality', desc: 'Only for the one in ten thousand selection, only recommending top design works that stand the test of time.' }
      },
      team: {
        title: 'Core Team',
        subtitle: 'Gathering industry elites to safeguard your investment',
        members: {
          judy: { role: 'Founder', bio: 'Before entering the Bali real estate and vacation asset sector, I spent eight years at Deloitte in management consulting and commercial real estate, participating in multi-brand strategy and operations, with a systematic understanding of risk control and asset growth. Meanwhile, I have operated Airbnb for over six years, deeply practicing platform mechanisms and pricing logic, understanding platform algorithms, risk response, and how to continuously generate revenue in the real market. Today, I combine my consulting background with hands-on short-term rental experience to focus on providing Bali asset allocation and operational advice that is closer to market fundamentals, focusing on long-term returns and practical implementation, rather than simple information matching.' },
          jacky: { role: 'Co-Founder', bio: 'Having lived in Jakarta and Bali for over ten years, I have been deeply involved in tourism, e-commerce, and brand operations, with rich practical experience in brand expansion overseas, and a continuous and authentic understanding of the Indonesian market and local ecosystem. For me, Bali is not just a destination, but a long-term choice for living and business. I hope to transform this passion and experience into a sustainable career, providing more people with more informed local perspectives and decision-making references.' }
        }
      },
      cta: 'Start Your Bali Investment Journey'
    },
    contact: {
      heroTitle: 'Contact Us',
      heroSubtitle: 'Start Your Bali Investment Journey',
      heroDescription: 'Our professional team is ready to provide personalized property consulting services, from market analysis to transaction completion, accompanying your investment decisions throughout the process.',
      formTitle: 'Book Exclusive Consultation',
      formSubtitle: 'Please fill in the following information, and we will contact you within 24 hours',
      form: {
        name: 'Full Name',
        namePlaceholder: 'Please enter your full name',
        nameError: 'Please enter your name',
        email: 'Email Address',
        emailPlaceholder: 'Please enter your email address',
        emailError: 'Please enter a valid email address',
        phone: 'Phone Number',
        phonePlaceholder: 'Please enter your phone number',
        phoneError: 'Please enter a valid phone number',
        subject: 'Inquiry Subject',
        subjectPlaceholder: 'Please briefly describe your inquiry needs',
        message: 'Detailed Requirements',
        messagePlaceholder: 'Please describe your requirements in detail, including budget range, preferred areas, property types, etc.',
        messageError: 'Message must contain at least 10 characters',
        submit: 'Submit Inquiry',
        submitting: 'Submitting...',
        success: 'Inquiry submitted successfully! We will contact you as soon as possible.',
        error: 'Submission failed, please try again later.'
      },
      info: {
        title: 'Contact Information',
        subtitle: 'REAL REAL headquarters is located in Canggu, Bali\'s most vibrant area, providing you with one-stop property consulting and legal support.',
        office: {
          title: 'Bali Office',
          address: 'Jl. Raya Seminyak No. 123\nSeminyak, Badung\nBali 80361, Indonesia',
          hours: 'Business Hours: Monday - Saturday 9:00-18:00'
        },
        phone: '+62 0813 3067 6565',
        email: 'Judy@realrealbali.com',
        whatsapp: '+86 156 0600 2201'
      }
    },
    footer: {
      description: 'REAL REAL Real Estate is dedicated to providing premium property consulting and management services in Bali.',
      rights: '© 2026 REAL REAL Real Estate. All rights reserved.',
    },
    common: {
      language: 'Language',
      currency: 'Reference Price',
      selectLanguage: 'Select Language',
      selectCurrency: 'Select Currency',
      currencyWarningTitle: 'Currency Change Notice',
      currencyWarningMessage: 'Currency conversion is for reference only. Due to frequent exchange rate fluctuations, the final price is based on Indonesian Rupiah (IDR).',
      understand: 'I Understand',
      cancel: 'Cancel',
      scrollToLearnMore: 'Scroll to Learn More',
      back: 'Back',
      favorite: 'Favorite',
      share: 'Share',
      download: 'Download',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      favorites: 'My Favorites',
      myAccount: 'My Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phone: 'Phone',
      save: 'Save',
      edit: 'Edit',
      noFavorites: 'No favorite properties yet',
      loginRequired: 'Please login first',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      updateSuccess: 'Update successful',
      error: 'Error',
    }
  }
} as const;