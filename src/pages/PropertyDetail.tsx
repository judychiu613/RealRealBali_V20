import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAreas } from '@/contexts/AreasContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPriceWithCurrency, formatDatabasePrice, formatLandPrice, Language, TRANSLATIONS, ROUTE_PATHS } from '@/lib/index';
import { useViewTracking } from '@/hooks/useViewTracking';
import { exportPropertyToPDF, PropertyData } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CountryCodeSelector } from '@/components/CountryCodeSelector';
import { getDefaultCountry } from '@/data/countryCodes';
import { ArrowLeft, Bed, Bath, Home, Maximize, MapPin, Shield, MessageCircle, Mail, Heart, FileText, Share2, Building2, ChevronLeft, ChevronRight, Download, Calendar, X } from 'lucide-react';

export default function PropertyDetail() {
  const {
    slugOrId
  } = useParams<{
    slugOrId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    language,
    currency
  } = useApp();
  const {
    user
  } = useAuth();
  const { getAreaNameById } = useAreas();
  
  // 真实的收藏功能 - 使用直接Supabase操作
  const addToFavorites = async (propertyId: string) => {
    try {
      if (!user) return { error: 'User not logged in' };
      
      console.log('Adding to favorites:', propertyId, 'for user:', user.id);
      
      const { error } = await supabase
        .from('user_favorites_map')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });
      
      if (error) {
        console.error('Error adding to favorites:', error);
        return { error };
      }
      
      console.log('Successfully added to favorites:', propertyId);
      return { error: null };
    } catch (error) {
      console.error('Exception adding to favorites:', error);
      return { error };
    }
  };
  
  const removeFromFavorites = async (propertyId: string) => {
    try {
      if (!user) return { error: 'User not logged in' };
      
      console.log('Removing from favorites:', propertyId, 'for user:', user.id);
      
      const { error } = await supabase
        .from('user_favorites_map')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (error) {
        console.error('Error removing from favorites:', error);
        return { error };
      }
      
      console.log('Successfully removed from favorites:', propertyId);
      return { error: null };
    } catch (error) {
      console.error('Exception removing from favorites:', error);
      return { error };
    }
  };
  const t = TRANSLATIONS[language as Language];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 设置页面标题
  useEffect(() => {
    if (property) {
      const title = typeof property.title === 'string' 
        ? property.title 
        : property.title?.[language] || property.title_zh || property.title_en || '';
      document.title = `${title} - REAL REAL`;
    } else {
      document.title = language === 'zh' 
        ? '房源详情 - REAL REAL'
        : 'Property Details - REAL REAL';
    }
  }, [property, language]);

  // 触摸事件状态
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 联系表单状态
  const [contactForm, setContactForm] = useState({
    name: '',
    countryCode: getDefaultCountry().dialCode, // 默认使用印尼区号
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWechatModal, setShowWechatModal] = useState(false);

  // 浏览追踪 - 只有在有房源ID时才启用
  const viewTracking = useViewTracking({
    propertyId: property?.id || '',
    pageType: 'detail',
    trackScrollDepth: true,
    trackViewDuration: true
  });
  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [slugOrId]);

  // 从数据库获取房源数据
  useEffect(() => {
    const fetchProperty = async () => {
      if (!slugOrId) return;
      setLoading(true);
      try {
        // 先尝试通过 slug 查询获取真实的 property ID
        let { data: slugData, error: slugError } = await supabase
          .from('properties')
          .select('id')
          .eq('slug', slugOrId)
          .single();
        
        // 如果 slug 查询失败，则将 slugOrId 作为 id 使用
        const propertyId = slugData?.id || slugOrId;
        
        const response = await fetch('https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/property_api_final_2026_02_22_14_00/property?id=' + propertyId + '&language=' + language, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXNwcGJzeHNseXV6Y2lmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTMxNTQsImV4cCI6MjA4NzIyOTE1NH0.uYXE5mkbGL24gL5Z1n9wxIXtC-P1QuBYGH8M_nvQsOI',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        
        const propertyData = result.data;
        
        const amenitiesResponse = await supabase
          .from('properties')
          .select('amenities_zh, amenities_en')
          .eq('id', propertyData.id)
          .single();
        
        if (amenitiesResponse.data) {
          propertyData.amenities_zh = amenitiesResponse.data.amenities_zh || [];
          propertyData.amenities_en = amenitiesResponse.data.amenities_en || [];
        }
        
        setProperty(propertyData);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slugOrId, language]); // 语言切换时重新获取数据

  // 检查收藏状态 - 使用直接Supabase查询
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !property) {
        setIsLiked(false);
        return;
      }
      
      try {
        console.log('Checking favorite status for property:', property.id, 'user:', user.id);
        
        // 直接查询user_favorites_map表
        const { data, error } = await supabase
          .from('user_favorites_map')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking favorite status:', error);
          setIsLiked(false);
          return;
        }
        
        const isFavorited = !!data;
        setIsLiked(isFavorited);
        console.log('Favorite status for', property.id, ':', isFavorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsLiked(false);
      }
    };
    
    checkFavorite();
  }, [user, property]);

  // 处理收藏功能
  const handleFavoriteToggle = async () => {
    if (!user) {
      // 未登录用户引导到登录页面，携带当前页面信息
      const currentPath = location.pathname + location.search;
      navigate(`${ROUTE_PATHS.LOGIN(language)}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!property) return;
    setFavoriteLoading(true);
    try {
      if (isLiked) {
        const {
          error
        } = await removeFromFavorites(property.id);
        if (!error) {
          setIsLiked(false);
        }
      } else {
        const {
          error
        } = await addToFavorites(property.id);
        if (!error) {
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 处理立即沟通按钮点击
  const handleInstantCommunication = () => {
    if (language === 'zh') {
      // 中文环境下显示微信弹窗
      setShowWechatModal(true);
    } else {
      // 英文环境下跳转到WhatsApp
      const whatsappNumber = '+6281234567890'; // 您的WhatsApp号码
      const message = encodeURIComponent(`Hello, I'm interested in property ${property?.title?.en || ''} (ID: ${property?.id || ''})`);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // 联系表单处理函数
  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 生成预设消息
  const generatePresetMessage = () => {
    if (!property) return '';
    const propertyTitle = property.title[language];
    const propertyId = property.id;
    if (language === 'zh') {
      return `你好，我希望了解"${propertyTitle}"房产编号为${propertyId}的房源更多信息。`;
    } else {
      return `Hello, I would like to learn more about the property "${propertyTitle}" with ID ${propertyId}.`;
    }
  };

  // 初始化预设消息
  useEffect(() => {
    if (property && !contactForm.message) {
      setContactForm(prev => ({
        ...prev,
        message: generatePresetMessage()
      }));
    }
  }, [property, language]);

  // 提交表单
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 准备提交数据
      const inquiryData = {
        inquiry_type: 'property_inquiry' as const,
        property_id: property?.id,
        name: contactForm.name,
        email: contactForm.email,
        country_code: contactForm.countryCode,
        phone: contactForm.phone,
        message: contactForm.message,
        preferred_language: language
      };

      // 调用API提交咨询
      const { data: result, error } = await supabase.functions.invoke('user_inquiries_api_2026_02_22_18_30', {
        body: inquiryData
      });

      if (error) {
        throw error;
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      // 显示成功消息
      alert(language === 'zh' ? '咨询已提交，我们将尽快回复您！' : 'Inquiry submitted successfully! We will get back to you soon.');

      // 重置表单（保留预设消息）
      setContactForm({
        name: '',
        countryCode: getDefaultCountry().dialCode,
        phone: '',
        email: '',
        message: generatePresetMessage()
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert(language === 'zh' ? '提交失败，请稍后重试' : 'Failed to submit inquiry, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>;
  }
  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">
            {language === 'zh' ? '房源未找到' : 'Property Not Found'}
          </h1>
          <Button onClick={() => navigate(ROUTE_PATHS.PROPERTIES(language))} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'zh' ? '返回房源列表' : 'Back to Properties'}
          </Button>
        </div>
      </div>;
  }

  // 从数据库获取的图片数组，按sort_order排序
  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // 触摸事件处理函数
  const minSwipeDistance = 50; // 最小滑动距离

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // 重置结束位置
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && images.length > 1) {
      nextImage(); // 向左滑动，显示下一张
    }
    if (isRightSwipe && images.length > 1) {
      prevImage(); // 向右滑动，显示上一张
    }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title[language],
          text: property.description[language],
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // 显示复制成功提示
        alert(language === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // 如果分享失败，尝试复制链接
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(language === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert(language === 'zh' ? '分享失败，请手动复制链接' : 'Share failed, please copy link manually');
      }
    }
  };
  const handleExportPDF = async () => {
    const propertyData: PropertyData = {
      id: property.id,
      title: property.title[language],
      price: currency === 'CNY' && property.priceCNY ? formatDatabasePrice(property.priceCNY, 'CNY', language) : currency === 'IDR' && property.priceIDR ? formatDatabasePrice(property.priceIDR, 'IDR', language) : formatDatabasePrice(property.priceUSD || property.price, 'USD', language),
      location: property.area_id ? getAreaNameById(property.area_id, language) : property.location[language],
      type: property.type[language],
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      landSize: `${property.landArea}m²`,
      buildingSize: `${property.buildingArea}m²`,
      buildYear: property.buildYear ? property.buildYear.toString() : 'N/A',
      landZone: property.landZone ? (language === 'zh' ? property.landZone.zh : property.landZone.en) : undefined,
      description: property.description[language],
      mainImage: property.image,
      gallery: images, // 使用轮播图片数组
      features: language === 'zh' ? property.tags : property.tagsEn || property.tags,
      contact: {
        company: 'REAL REAL',
        agentName: '',
        phone: '+62 0813 3067 5465 / +86 156 0600 2201',
        email: 'Hello@realrealbali.com / Judy@realrealbali.com',
        website: 'realrealbali.com'
      }
    };
    await exportPropertyToPDF(propertyData);
  };
  // ── 构建 JSON-LD 结构化数据（仅在 property 加载后）────────────────
  const structuredData = property ? (() => {
    const slug = (property as any).slug || property.id;
    const propertyUrl = `${window.location.origin}/${language}/property/${slug}`;
    const title = property.title[language];
    const description = property.description[language];
    const coverImage = images[0] || property.image || '';
    const areaName = property.area_id ? getAreaNameById(property.area_id, language) : property.location?.[language] || 'Bali';
    const homeLabel = language === 'zh' ? '首页' : 'Home';
    const listLabel = language === 'zh' ? '房源列表' : 'Properties';

    const breadcrumb: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: `${window.location.origin}/${language}/` },
        { '@type': 'ListItem', position: 2, name: listLabel, item: `${window.location.origin}/${language}/properties` },
        { '@type': 'ListItem', position: 3, name: title, item: propertyUrl },
      ],
    };

    const product: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description: description.slice(0, 300),
      url: propertyUrl,
      image: images.slice(0, 3),
      brand: { '@type': 'Organization', name: 'REAL REAL' },
      ...(property.priceUSD && property.priceUSD > 0 ? {
        offers: {
          '@type': 'Offer',
          price: property.priceUSD,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: propertyUrl,
        }
      } : {}),
    };

    const realEstate: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: title,
      description: description.slice(0, 300),
      url: propertyUrl,
      image: coverImage,
      numberOfRooms: property.bedrooms || undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: areaName || 'Bali',
        addressCountry: 'ID',
      },
    };

    return [breadcrumb, product, realEstate];
  })() : undefined;

  return (
    <>
      <SEOHead
        title={property ? `${property.title[language]} - REAL REAL` : (language === 'zh' ? '房源详情 - REAL REAL' : 'Property Details - REAL REAL')}
        description={property ? property.description[language].substring(0, 160) : ''}
        image={property?.image}
        type="product"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background">
      {/* 浮动返回按钮 - 左上角，移动端响应式 */}
      <Button onClick={() => navigate(-1)} className="fixed top-20 left-2 md:left-4 z-40 flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-black/80 hover:bg-black text-white border border-white/20 md:border-2 backdrop-blur-sm transition-all hover:scale-105 text-xs md:text-sm font-medium shadow-lg" title={t.common.back}>
        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden sm:inline">{t.common.back}</span>
      </Button>

      {/* 图片轮播区域 */}
      <div className="relative w-full overflow-hidden bg-muted aspect-[16/9] max-h-[70vh]" style={{ marginTop: '65px' }}>
        <img src={images[currentImageIndex]} alt={property.title[language]} className="w-full h-full object-cover object-center" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />

        {/* 图片导航 */}
        {images.length > 1 && <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>}

        {/* 图片指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_: string, index: number) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />)}
        </div>

        {/* 图片计数 - 右下角 */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
          {currentImageIndex + 1} / {images.length}
        </div>


      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 pt-5 pb-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 基本信息 */}
            <div className="space-y-4">
              {/* 第一行：标题和价格 */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground flex-1">
                  {property.title[language]}
                </h1>
                <div className="text-left md:text-right">
                  {property.type?.en === 'Land' || property.type?.zh === '土地' ? (
                    // 土地类型显示总价+单价
                    <div className="space-y-2">
                      {/* 总价 */}
                      <div className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground font-mono">
                        {currency === 'CNY' && property.priceCNY 
                          ? formatDatabasePrice(property.priceCNY, 'CNY', language)
                          : currency === 'IDR' && property.priceIDR 
                            ? formatDatabasePrice(property.priceIDR, 'IDR', language)
                            : formatDatabasePrice(property.priceUSD || property.price, 'USD', language)}
                      </div>
                      {/* 单价 */}
                      <div className="text-sm text-muted-foreground">
                        {language === 'zh' ? '单价：' : 'Unit Price: '}
                        {currency === 'CNY' && property.priceCNY 
                          ? formatLandPrice(property.priceCNY, property.landArea || 100, 'CNY', language)
                          : currency === 'IDR' && property.priceIDR 
                            ? formatLandPrice(property.priceIDR, property.landArea || 100, 'IDR', language)
                            : formatLandPrice(property.priceUSD || property.price, property.landArea || 100, 'USD', language)}
                      </div>
                    </div>
                  ) : (
                    // 非土地类型显示总价
                    <div className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground font-mono">
                      {currency === 'CNY' && property.priceCNY 
                        ? formatDatabasePrice(property.priceCNY, 'CNY', language) 
                        : currency === 'IDR' && property.priceIDR 
                          ? formatDatabasePrice(property.priceIDR, 'IDR', language) 
                          : formatDatabasePrice(property.priceUSD || property.price, 'USD', language)}
                    </div>
                  )}
                </div>
              </div>
              {/* 第二行：地点和标签 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-base md:text-lg">{property.area_id ? getAreaNameById(property.area_id, language) : property.location[language]}</span>
                </div>
                <Badge variant="outline" className="text-xs md:text-sm w-fit">
                  {property.type[language]}
                </Badge>
              </div>

              {/* 房源标签和操作按钮 - 桌面端同行，移动端分行 */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                {/* 房源标签 */}
                <div className="flex flex-wrap gap-2">
                  {/* 支持双语言标签显示 */}
                  {(language === 'zh' ? property.tags : property.tagsEn || property.tags).map((tag: string, index: number) => <Badge key={index} className="text-xs md:text-sm bg-black text-white rounded-sm px-2 py-1 md:px-3">
                      {tag}
                    </Badge>)}
                </div>
                
                {/* 操作按钮组 */}
                <div className="flex flex-wrap gap-2 md:gap-3 flex-shrink-0">
                  <Button onClick={handleFavoriteToggle} disabled={favoriteLoading} variant="outline" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2">
                    {favoriteLoading ? <div className="w-3 h-3 md:w-4 md:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />}
                    {favoriteLoading ? '...' : t.common.favorite}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2">
                    <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                    {t.common.share}
                  </Button>
                  <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2">
                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                    {t.common.download}
                  </Button>
                </div>
              </div>
            </div>

            {/* 房源参数 - 根据房产类型显示不同信息 */}
            <div className="space-y-4">
              {(() => {
                const isLand = property.type?.en === 'Land' || property.type?.zh === '土地';
                if (isLand) {
                  // 土地类型：只显示产权形式、土地形式、土地面积
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {property.ownership?.toLowerCase() === 'freehold' ? 
                              (language === 'zh' ? '永久产权' : 'Freehold') : 
                              `${language === 'zh' ? '租赁产权' : 'Leasehold'}${property.leaseholdYears ? ` ${property.leaseholdYears}${language === 'zh' ? '年' : 'Y'}` : ''}`
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {language === 'zh' ? '产权形式' : 'Ownership'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{property.landZone ? (language === 'zh' ? property.landZone.zh : property.landZone.en) : 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">
                            {language === 'zh' ? '土地形式' : 'Land Zone'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Maximize className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{property.landArea}m²</div>
                          <div className="text-xs text-muted-foreground">
                            {language === 'zh' ? '土地面积' : 'Land Area'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // 房产类型：显示完整信息（但去掉建成年份）
                  return (
                    <div className="space-y-4">
                      {/* 第一行：卧室数量/浴室数量/产权形式/土地形式 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bed className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.bedrooms}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '卧室数量' : 'Bedrooms'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Bath className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.bathrooms}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '浴室数量' : 'Bathrooms'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {property.ownership?.toLowerCase() === 'freehold' ? 
                                (language === 'zh' ? '永久产权' : 'Freehold') : 
                                `${language === 'zh' ? '租赁产权' : 'Leasehold'}${property.leaseholdYears ? ` ${property.leaseholdYears}${language === 'zh' ? '年' : 'Y'}` : ''}`
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '产权形式' : 'Ownership'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.landZone ? (language === 'zh' ? property.landZone.zh : property.landZone.en) : 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '土地形式' : 'Land Zone'}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 第二行：建筑面积/土地面积/建成年份（与第一行对齐） */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-lg">
                        {/* 建筑面积（与卧室数量对齐） */}
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.buildingArea}m²</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '建筑面积' : 'Building Area'}
                            </div>
                          </div>
                        </div>
                        {/* 土地面积（与浴室数量对齐） */}
                        <div className="flex items-center gap-3">
                          <Maximize className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.landArea}m²</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '土地面积' : 'Land Area'}
                            </div>
                          </div>
                        </div>
                        {/* 建成年份（与产权形式对齐） */}
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{property.buildYear || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'zh' ? '建成年份' : 'Year Built'}
                            </div>
                          </div>
                        </div>
                        {/* 空占位符（与土地形式对齐） */}
                        <div></div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>

            {/* 房源描述 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">
                {language === 'zh' ? '房源描述' : 'Property Description'}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {property.description[language]}
              </p>
            </div>

            {/* 特色设施 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">
                {language === 'zh' ? '特色设施' : 'Features & Amenities'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(() => {
                  const amenities = language === 'zh' 
                    ? (property.amenities_zh || [])
                    : (property.amenities_en || []);
                  
                  if (amenities.length === 0) {
                    return [
                      language === 'zh' ? '现代化设计' : 'Modern Design',
                      language === 'zh' ? '24小时安保' : '24/7 Security',
                      language === 'zh' ? '私人停车场' : 'Private Parking',
                      language === 'zh' ? '高速网络' : 'High-Speed WiFi',
                      language === 'zh' ? '游泳池' : 'Swimming Pool',
                      language === 'zh' ? '花园景观' : 'Garden View'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                        <span className="text-muted-foreground leading-relaxed text-lg">+ {feature}</span>
                      </div>
                    ));
                  }
                  
                  return amenities.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <span className="text-muted-foreground leading-relaxed text-lg">+ {feature}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* 右侧联系信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 相似房源推荐 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  {language === 'zh' ? '相似房源' : 'Similar Properties'}
                </h3>
                {/* TODO: Implement similar properties from database */}
                {/* Temporarily disabled until similar properties API is implemented */}
                {[].map((similarProperty: any) => <div key={similarProperty.id} className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors" onClick={() => navigate(ROUTE_PATHS.PROPERTY_DETAIL(language, similarProperty.id))}>
                    <img src={similarProperty.image} alt={similarProperty.title[language]} className="w-full h-32 object-cover rounded mb-3" />
                    <h4 className="font-medium text-sm mb-1">{similarProperty.title[language]}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{similarProperty.area_id ? getAreaNameById(similarProperty.area_id, language) : similarProperty.location[language]}</p>
                    <p className="text-sm font-medium">
                      {/* 支持多货币显示 */}
                      {currency === 'CNY' && similarProperty.priceCNY ? formatDatabasePrice(similarProperty.priceCNY, 'CNY', language) : currency === 'IDR' && similarProperty.priceIDR ? formatDatabasePrice(similarProperty.priceIDR, 'IDR', language) : formatDatabasePrice(similarProperty.priceUSD || similarProperty.price, 'USD', language)}
                    </p>
                  </div>)}
              </CardContent>
            </Card>

            {/* 联系卡片 */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    {language === 'zh' ? '联系我们' : 'Contact Us'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh' ? '获取更多信息或联系咨询' : 'Get more info or contact us'}
                  </p>
                </div>

                {/* 联系表单 */}
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  {/* 立即沟通按钮 */}
                  <Button onClick={handleInstantCommunication} type="button" className="w-full bg-black hover:bg-gray-800 text-white" size="lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {language === 'zh' ? '立即沟通' : 'Chat Now'}
                  </Button>
                  {/* 姓名 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      {language === 'zh' ? '姓名' : 'Name'}
                    </label>
                    <Input value={contactForm.name} onChange={(e) => handleContactFormChange('name', e.target.value)} placeholder={language === 'zh' ? '请输入您的姓名' : 'Enter your name'} required className="text-sm" />
                  </div>

                  {/* 电话 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      {language === 'zh' ? '电话' : 'Phone'}
                    </label>
                    <div className="flex gap-2">
                      <CountryCodeSelector value={contactForm.countryCode} onValueChange={(value: string) => handleContactFormChange('countryCode', value)} className="text-sm" />
                      <Input value={contactForm.phone} onChange={(e) => handleContactFormChange('phone', e.target.value)} placeholder={language === 'zh' ? '请输入电话号码' : 'Enter phone number'} required className="flex-1 text-sm" />
                    </div>
                  </div>

                  {/* 邮箱 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      {language === 'zh' ? '邮箱' : 'Email'}
                    </label>
                    <Input type="email" value={contactForm.email} onChange={(e) => handleContactFormChange('email', e.target.value)} placeholder={language === 'zh' ? '请输入邮箱地址' : 'Enter email address'} required className="text-sm" />
                  </div>

                  {/* 留言 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      {language === 'zh' ? '留言' : 'Message'}
                    </label>
                    <Textarea value={contactForm.message} onChange={(e) => handleContactFormChange('message', e.target.value)} placeholder={language === 'zh' ? '请输入您的留言' : 'Enter your message'} required rows={4} className="text-sm resize-none text-muted-foreground" />
                  </div>
                  {/* 提交按钮 */}
                  <Button type="submit" disabled={isSubmitting} className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    {isSubmitting ? language === 'zh' ? '发送中...' : 'Sending...' : language === 'zh' ? '发送消息' : 'Send Message'}
                  </Button>
                </form>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === 'zh' ? '房源编号' : 'Property ID'}
                    </span>
                    <span className="font-mono">{property.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 微信弹窗 */}
      {showWechatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4 relative">
            <button onClick={() => setShowWechatModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'zh' ? '微信联系' : 'WeChat Contact'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'zh' ? '请添加微信号联系我们' : 'Please add our WeChat ID to contact us'}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-foreground mb-2">
                    RealReal_Bali
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'zh' ? '长按复制微信号' : 'Long press to copy WeChat ID'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => {
                  navigator.clipboard.writeText('RealReal_Bali');
                  alert(language === 'zh' ? '微信号已复制' : 'WeChat ID copied');
                }} >
                  {language === 'zh' ? '复制' : 'Copy'}
                </Button>
                <Button className="flex-1" onClick={() => setShowWechatModal(false)} >
                  {language === 'zh' ? '关闭' : 'Close'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}