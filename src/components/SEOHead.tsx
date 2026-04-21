/**
 * SEO 头部组件
 * 用于管理页面的 meta 标签、hreflang、canonical 等 SEO 相关内容
 */
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  /** JSON-LD 结构化数据，传入对象或对象数组 */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  type = 'website',
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const { language } = useApp();
  const location = useLocation();
  
  // 获取当前页面的路径（去除语言前缀）
  const pathWithoutLang = location.pathname.replace(/^\/(zh|en)/, '');
  
  // 构建多语言 URL（使用标准 URL，不使用 hash）
  const baseUrl = 'https://realrealbali.com';
  const currentUrl = `${baseUrl}/${language}${pathWithoutLang}${location.search}`;
  const zhUrl = `${baseUrl}/zh${pathWithoutLang}${location.search}`;
  const enUrl = `${baseUrl}/en${pathWithoutLang}${location.search}`;

  const finalTitle = title || (language === 'zh' ? 'REAL REAL | 巴厘岛房产' : 'REAL REAL | Bali Property');
  const finalDescription = description || (language === 'zh' ? '巴厘岛专业房产中介服务' : 'Professional Bali Property Agency');

  return (
    <Helmet>
      {/* 基础 SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <html lang={language} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang 标签 */}
      <link rel="alternate" hrefLang="zh" href={zhUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={zhUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:locale" content={language === 'zh' ? 'zh_CN' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'zh' ? 'en_US' : 'zh_CN'} />
      <meta property="og:site_name" content="REAL REAL" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD 结构化数据 - 页面级 */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? structuredData : [structuredData]
          )}
        </script>
      )}

      {/* JSON-LD 结构化数据 - 企业信息（固定，全站生效，前端不显示） */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "REAL REAL",
          "alternateName": "Real Real Bali",
          "description": "REAL REAL is a professional Bali real estate agency founded by Chinese entrepreneurs with deep local market expertise. We specialize in cross-border property investment for Chinese-speaking clients, offering transparent, efficient, and trustworthy property acquisition services in Bali, Indonesia. We partner with all leading local agencies and developers to provide comprehensive property listings, legal support via Indonesian-based Chinese lawyers, and financial advisory services.",
          "url": "https://realrealbali.com",
          "logo": "https://img.realrealbali.com/web/logo_narrow_50%20x%2050.png",
          "image": "https://img.realrealbali.com/web/about1.jpg",
          "email": "Hello@realrealbali.com",
          "telephone": "+62 0813 3067 5465",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bali",
            "addressCountry": "ID"
          },
          "areaServed": {
            "@type": "Place",
            "name": "Bali, Indonesia"
          },
          "founder": [
            {
              "@type": "Person",
              "name": "Judy Chiu",
              "jobTitle": "Founder & CEO",
              "image": "https://img.realrealbali.com/web/founderheadshot-judy.png"
            },
            {
              "@type": "Person",
              "name": "Jacky Chiu",
              "jobTitle": "Co-Founder",
              "image": "https://img.realrealbali.com/web/founderheadshot-jacky.jpg"
            }
          ],
          "knowsLanguage": ["zh", "en", "id"],
          "serviceType": [
            "Property Sales",
            "Property Investment Consulting",
            "Cross-border Real Estate Services",
            "Legal & Tax Advisory for Property",
            "Freehold & Leasehold Property",
            "Villa Sales",
            "Land Sales"
          ],
          "sameAs": [
            "https://realrealbali.com"
          ]
        })}
      </script>
    </Helmet>
  );
}
