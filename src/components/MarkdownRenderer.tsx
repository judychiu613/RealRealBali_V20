import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PropertyCard } from './PropertyCard';
import { Property } from '@/lib/index';
import { supabase } from '@/integrations/supabase/client';

interface MarkdownRendererProps {
  content: string;
}

// 将数据库返回的数据转换为Property接口格式
function transformDatabaseProperty(dbProperty: any): Property {
  // 如果type_zh和type_en为空，但type_id存在，则根据type_id自动填充
  let typeZh = dbProperty.type_zh || '';
  let typeEn = dbProperty.type_en || '';
  
  if (!typeZh && !typeEn && dbProperty.type_id) {
    // 根据type_id自动填充类型名称
    if (dbProperty.type_id === 'land') {
      typeZh = '土地';
      typeEn = 'Land';
    } else if (dbProperty.type_id === 'villa') {
      typeZh = '别墅';
      typeEn = 'Villa';
    } else if (dbProperty.type_id === 'apartment') {
      typeZh = '公寓';
      typeEn = 'Apartment';
    } else if (dbProperty.type_id === 'house') {
      typeZh = '住宅';
      typeEn = 'House';
    }
  }

  return {
    id: dbProperty.id,
    title: {
      zh: dbProperty.title_zh || '',
      en: dbProperty.title_en || ''
    },
    price: dbProperty.price_usd || 0,
    priceUSD: dbProperty.price_usd,
    priceCNY: dbProperty.price_cny,
    priceIDR: dbProperty.price_idr,
    location: {
      zh: dbProperty.location_zh || '',
      en: dbProperty.location_en || ''
    },
    area_id: dbProperty.area_id,
    type: {
      zh: typeZh,
      en: typeEn
    },
    type_id: dbProperty.type_id,
    bedrooms: dbProperty.bedrooms || 0,
    bathrooms: dbProperty.bathrooms || 0,
    landArea: dbProperty.land_area || 0,
    buildingArea: dbProperty.building_area || 0,
    buildYear: dbProperty.build_year,
    image: dbProperty.image_urls?.[0] || '',
    images: dbProperty.image_urls || [],
    status: dbProperty.status || 'Available',
    ownership: dbProperty.ownership || 'Leasehold',
    leaseholdYears: dbProperty.leasehold_years,
    landZone: dbProperty.land_zone,
    description: {
      zh: dbProperty.description_zh || '',
      en: dbProperty.description_en || ''
    },
    description_zh: dbProperty.description_zh,
    description_en: dbProperty.description_en,
    featured: dbProperty.featured,
    tags: dbProperty.tags || [],
    tags_zh: dbProperty.tags_zh,
    tags_en: dbProperty.tags_en,
    amenities: dbProperty.amenities,
    amenitiesZh: dbProperty.amenities_zh,
    amenitiesEn: dbProperty.amenities_en,
    coordinates: dbProperty.coordinates
  };
}

// 房源卡片嵌入组件
function PropertyCardEmbed({ id }: { id: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('PropertyCardEmbed: 开始获取房源', { id });
        
        // 获取房源基本信息
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (propertyError) {
          console.error('PropertyCardEmbed: 获取房源失败', propertyError);
          return;
        }

        // 尝试多个可能的表名获取房源图片
        let imagesData = null;
        let imagesError = null;
        
        // 尝试 property_image 表
        const result1 = await supabase
          .from('property_image')
          .select('image_url, sort_order')
          .eq('property_id', id)
          .order('sort_order', { ascending: true });
        
        if (!result1.error) {
          imagesData = result1.data;
        } else {
          // 尝试 property_images 表（复数）
          const result2 = await supabase
            .from('property_images')
            .select('image_url, sort_order')
            .eq('property_id', id)
            .order('sort_order', { ascending: true });
          
          if (!result2.error) {
            imagesData = result2.data;
          } else {
            // 尝试 images 表
            const result3 = await supabase
              .from('images')
              .select('image_url, sort_order')
              .eq('property_id', id)
              .order('sort_order', { ascending: true });
            
            imagesData = result3.data;
            imagesError = result3.error;
          }
        }

        console.log('PropertyCardEmbed: 获取图片数据', { 
          id, 
          imagesData, 
          imagesError,
          imageCount: imagesData?.length || 0,
          errorMessage: imagesError?.message,
          errorDetails: imagesError
        });

        if (propertyData) {
          // 提取图片URL数组
          const imageUrls = imagesData?.map(img => img.image_url) || [];
          
          console.log('PropertyCardEmbed: 原始房源数据', {
            id,
            title_zh: propertyData.title_zh,
            type_id: propertyData.type_id,
            type_zh: propertyData.type_zh,
            type_en: propertyData.type_en,
            land_area: propertyData.land_area,
            price_usd: propertyData.price_usd,
            price_cny: propertyData.price_cny,
            price_idr: propertyData.price_idr,
            allPriceFields: {
              price: propertyData.price,
              price_usd: propertyData.price_usd,
              priceUsd: propertyData.priceUsd,
              price_cny: propertyData.price_cny,
              priceCny: propertyData.priceCny,
              price_idr: propertyData.price_idr,
              priceIdr: propertyData.priceIdr
            }
          });

          console.log('PropertyCardEmbed: 处理后的图片URLs', {
            imageUrls,
            mainImage: imageUrls[0] || 'no image'
          });

          // 将图片数据合并到房源数据中
          const propertyWithImages = {
            ...propertyData,
            image_urls: imageUrls,
            images: imageUrls
          };

          const transformedProperty = transformDatabaseProperty(propertyWithImages);
          console.log('PropertyCardEmbed: 转换后的房源数据', {
            id,
            type: transformedProperty.type,
            type_id: transformedProperty.type_id,
            landArea: transformedProperty.landArea,
            hasTitle: !!transformedProperty.title?.zh || !!transformedProperty.title?.en,
            hasPrice: !!transformedProperty.price,
            price: transformedProperty.price,
            priceUSD: transformedProperty.priceUSD,
            priceCNY: transformedProperty.priceCNY,
            priceIDR: transformedProperty.priceIDR,
            hasImage: !!transformedProperty.image,
            hasImages: !!transformedProperty.images?.length,
            image: transformedProperty.image,
            imagesCount: transformedProperty.images?.length,
            isLandType: transformedProperty.type?.zh === '土地' || transformedProperty.type?.en === 'Land'
          });
          setProperty(transformedProperty);
        }
      } catch (error) {
        console.error('PropertyCardEmbed: 异常', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="my-8 p-8 bg-muted/50 border border-border rounded flex items-center justify-center">
        <p className="text-muted-foreground">加载房源中...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="my-8 p-8 bg-destructive/10 border border-destructive/20 rounded">
        <p className="text-destructive text-sm">房源 ID "{id}" 不存在</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <PropertyCard property={property} />
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 解析 [listing id="xxx"] 语法
  const processContent = (text: string) => {
    // 使用正则表达式匹配 [listing id="xxx"]
    const listingRegex = /\[listing id="([^"]+)"\]/g;
    const parts: Array<{ type: 'text' | 'listing'; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = listingRegex.exec(text)) !== null) {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      // 添加房源卡片标记
      parts.push({
        type: 'listing',
        content: match[1] // 提取 id
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return parts;
  };

  const parts = processContent(content);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {parts.map((part, index) => {
        if (part.type === 'listing') {
          return <PropertyCardEmbed key={`listing-${index}`} id={part.content} />;
        }

        return (
          <ReactMarkdown
            key={`text-${index}`}
            remarkPlugins={[remarkGfm]}
            components={{
              // 自定义图片渲染
              img: ({ node, ...props }) => (
                <div className="my-8 flex flex-col items-center">
                  <img
                    {...props}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  {props.alt && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      {props.alt}
                    </p>
                  )}
                </div>
              ),
              // 自定义标题渲染
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
              ),
              // 自定义段落渲染
              p: ({ node, ...props }) => (
                <p className="my-4 leading-relaxed" {...props} />
              ),
              // 自定义列表渲染
              ul: ({ node, ...props }) => (
                <ul className="my-4 ml-6 list-disc space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />
              ),
              // 自定义引用渲染
              blockquote: ({ node, ...props }) => (
                <blockquote className="my-4 pl-4 border-l-4 border-primary/50 italic text-muted-foreground" {...props} />
              ),
              // 自定义代码块渲染
              code: ({ node, inline, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono" {...props} />
                  );
                }
                return (
                  <code className="block p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                );
              }
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}