/**
 * 预渲染脚本 - 写入 public/ 目录
 *
 * 策略：将 HTML 写入 public/zh/property/ 和 public/en/property/
 * Vite 构建时会自动把 public/ 的内容复制到 dist/，无需依赖 postbuild hook
 *
 * 运行方式：
 *   npm run prerender          # 写入 public/（然后 npm run build 会带入 dist）
 *   npm run prerender:dist     # 直接写入 dist/（需要已完成 vite build）
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Try to load .env, but fall back to hardcoded defaults (anon keys are public)
try {
  const { config } = await import('dotenv');
  config();
} catch (_) { /* dotenv not available, use defaults */ }

// ── 配置 ──────────────────────────────────────────────────────────
const SITE_URL = 'https://realrealbali.com';
const LANGUAGES = ['zh', 'en'] as const;
type Lang = typeof LANGUAGES[number];

// Supabase credentials - anon key is safe to be in client-side code
const supabaseUrl = process.env.VITE_SUPABASE_URL
  || 'https://ilusppbsxslyuzcifyeo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXNwcGJzeHNseXV6Y2lmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTMxNTQsImV4cCI6MjA4NzIyOTE1NH0.uYXE5mkbGL24gL5Z1n9wxIXtC-P1QuBYGH8M_nvQsOI';

const supabase = createClient(supabaseUrl, supabaseKey);

// 目录配置
const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// 写入目标：默认写 public/，也可通过环境变量切换到 dist/
const WRITE_TO_DIST = process.env.PRERENDER_TARGET === 'dist';
const OUTPUT_DIR = WRITE_TO_DIST ? DIST_DIR : PUBLIC_DIR;

// ── 类型定义 ──────────────────────────────────────────────────────
interface PropertyRow {
  id: string;
  slug: string | null;
  title_zh: string | null;
  title_en: string | null;
  description_zh: string | null;
  description_en: string | null;
  price_usd: number | null;
  price_idr: number | null;
  price_cny: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  land_area: number | null;
  building_area: number | null;
  ownership: string | null;
  area_id: string | null;
  updated_at: string;
}

interface ImageRow {
  property_id: string;
  image_url: string;
  sort_order: number | null;
}

// area_id is a plain string like 'uluwatu', 'jimbaran', etc.
// We use a static map to get display names
const AREA_NAMES: Record<string, { zh: string; en: string }> = {
  uluwatu:   { zh: '乌鲁瓦图', en: 'Uluwatu' },
  canggu:    { zh: '仓古', en: 'Canggu' },
  seminyak:  { zh: '水明漾', en: 'Seminyak' },
  jimbaran:  { zh: '金巴兰', en: 'Jimbaran' },
  ubud:      { zh: '乌布', en: 'Ubud' },
  kerobokan: { zh: '科罗博坎', en: 'Kerobokan' },
  pererenan: { zh: '佩雷雷南', en: 'Pererenan' },
  berawa:    { zh: '贝拉瓦', en: 'Berawa' },
  nusa_dua:  { zh: '努沙杜瓦', en: 'Nusa Dua' },
  sanur:     { zh: '沙努尔', en: 'Sanur' },
  tabanan:   { zh: '塔巴南', en: 'Tabanan' },
  bukit:     { zh: '布基特', en: 'Bukit' },
  bingin:    { zh: '宾根', en: 'Bingin' },
  balangan:  { zh: '巴兰甘', en: 'Balangan' },
  kedungu:   { zh: '克东古', en: 'Kedungu' },
  cemagi:    { zh: '澈马吉', en: 'Cemagi' },
};

function getAreaName(areaId: string | null, lang: Lang): string {
  if (!areaId) return lang === 'zh' ? '巴厘岛' : 'Bali';
  const area = AREA_NAMES[areaId.toLowerCase()];
  if (area) return lang === 'zh' ? area.zh : area.en;
  // Fallback: capitalize the area id
  return areaId.charAt(0).toUpperCase() + areaId.slice(1);
}

// ── 数据获取 ──────────────────────────────────────────────────────

async function fetchAllProperties(): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, slug,
      title_zh, title_en,
      description_zh, description_en,
      price_usd, price_idr, price_cny,
      bedrooms, bathrooms, land_area, building_area,
      ownership, area_id,
      updated_at
    `)
    .eq('is_published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return (data as PropertyRow[]) || [];
}

async function fetchImages(propertyIds: string[]): Promise<Record<string, string[]>> {
  if (propertyIds.length === 0) return {};

  const { data, error } = await supabase
    .from('property_images')
    .select('property_id, image_url, sort_order')
    .in('property_id', propertyIds)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('⚠️  Could not fetch images from property_images table:', error.message);
    return {};
  }

  const result: Record<string, string[]> = {};
  for (const row of (data as ImageRow[]) || []) {
    if (!result[row.property_id]) result[row.property_id] = [];
    result[row.property_id].push(row.image_url);
  }
  return result;
}

// (area names are handled by static AREA_NAMES map above)

// ── 价格格式化 ────────────────────────────────────────────────────

function formatPrice(property: PropertyRow, lang: Lang): string {
  if (property.price_usd && property.price_usd > 0) {
    if (property.price_usd >= 1_000_000) {
      return `$${(property.price_usd / 1_000_000).toFixed(1)}M USD`;
    }
    return `$${property.price_usd.toLocaleString()} USD`;
  }
  if (property.price_idr && property.price_idr > 0) {
    const billions = property.price_idr / 1_000_000_000;
    if (billions >= 1) {
      return lang === 'zh'
        ? `IDR ${billions.toFixed(1)} 十亿`
        : `IDR ${billions.toFixed(1)}B`;
    }
    return `IDR ${(property.price_idr / 1_000_000).toFixed(0)}M`;
  }
  return lang === 'zh' ? '价格面议' : 'Price on request';
}

// ── JSON-LD 生成 ──────────────────────────────────────────────────

function buildJsonLd(
  property: PropertyRow,
  images: string[],
  areaName: string,
  lang: Lang
): string {
  const slug = property.slug || property.id;
  const title = (lang === 'zh' ? property.title_zh : property.title_en) || slug;
  const description = (lang === 'zh' ? property.description_zh : property.description_en) || '';
  const propertyUrl = `${SITE_URL}/${lang}/property/${slug}`;
  const homeLabel = lang === 'zh' ? '首页' : 'Home';
  const listLabel = lang === 'zh' ? '房源列表' : 'Properties';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}/${lang}/` },
      { '@type': 'ListItem', position: 2, name: listLabel, item: `${SITE_URL}/${lang}/properties` },
      { '@type': 'ListItem', position: 3, name: title, item: propertyUrl },
    ],
  };

  const productData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description.slice(0, 300),
    url: propertyUrl,
    image: images.slice(0, 3),
    brand: { '@type': 'Organization', name: 'REAL REAL' },
  };

  if (property.price_usd && property.price_usd > 0) {
    productData.offers = {
      '@type': 'Offer',
      price: property.price_usd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: propertyUrl,
    };
  }

  const realEstate = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description.slice(0, 300),
    url: propertyUrl,
    image: images.slice(0, 1)[0] || '',
    numberOfRooms: property.bedrooms || undefined,
    floorSize: property.building_area
      ? { '@type': 'QuantitativeValue', value: property.building_area, unitCode: 'MTK' }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: areaName || 'Bali',
      addressCountry: 'ID',
    },
  };

  return JSON.stringify([breadcrumb, productData, realEstate], null, 0);
}

// ── HTML 模板 ─────────────────────────────────────────────────────

function buildHtml(
  property: PropertyRow,
  images: string[],
  areaName: string,
  lang: Lang,
  indexHtml: string
): string {
  const slug = property.slug || property.id;
  const title = (lang === 'zh' ? property.title_zh : property.title_en) || slug;
  const description = (lang === 'zh' ? property.description_zh : property.description_en) || '';
  const location = areaName || 'Bali';
  const priceStr = formatPrice(property, lang);
  const propertyUrl = `${SITE_URL}/${lang}/property/${slug}`;
  const zhUrl = `${SITE_URL}/zh/property/${slug}`;
  const enUrl = `${SITE_URL}/en/property/${slug}`;
  const jsonLd = buildJsonLd(property, images, areaName, lang);

  const pageTitle = `${title} | REAL REAL`;
  const metaDesc = description.slice(0, 160) || (lang === 'zh'
    ? `巴厘岛房产 - ${title}，位于${location}，价格${priceStr}`
    : `Bali Property - ${title} in ${location}, ${priceStr}`);

  const ownershipLabel = property.ownership?.toLowerCase() === 'freehold'
    ? (lang === 'zh' ? '永久产权' : 'Freehold')
    : (lang === 'zh' ? '租赁产权' : 'Leasehold');

  const coverImage = images[0] || '';

  // 构建图片 og 标签
  const ogImage = coverImage ? `<meta property="og:image" content="${escHtml(coverImage)}" />` : '';
  const twitterImage = coverImage ? `<meta name="twitter:image" content="${escHtml(coverImage)}" />` : '';

  // 简短的内联 CSS（不阻塞 LCP，只保证骨架可见）
  const inlineCss = `
    #__prerender-shell{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#1a1a1a}
    #__prerender-shell h1{font-size:1.8rem;font-weight:400;margin:0 0 12px}
    #__prerender-shell .meta{color:#666;font-size:.9rem;margin-bottom:16px}
    #__prerender-shell .price{font-size:1.4rem;font-weight:600;margin-bottom:16px}
    #__prerender-shell .desc{line-height:1.7;color:#444;margin-bottom:24px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
    #__prerender-shell img{width:100%;max-width:900px;height:auto;border-radius:8px;display:block;margin-bottom:16px}
    #__prerender-shell .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.8rem;background:#f0f0f0;margin-right:6px}
  `.trim();

  // 构建骨架 HTML（供爬虫读取的内容骨架）
  const preRenderShell = `
<div id="__prerender-shell" aria-hidden="true">
  <h1 itemprop="name">${escHtml(title)}</h1>
  <div class="meta">
    <span>📍 ${escHtml(location)}</span>
    ${property.bedrooms ? `<span style="margin-left:16px">🛏 ${property.bedrooms}${lang === 'zh' ? '卧' : ' bed'}</span>` : ''}
    ${property.bathrooms ? `<span style="margin-left:16px">🚿 ${property.bathrooms}${lang === 'zh' ? '浴' : ' bath'}</span>` : ''}
    ${property.building_area ? `<span style="margin-left:16px">📐 ${property.building_area}㎡</span>` : ''}
    ${property.land_area ? `<span style="margin-left:16px">🌳 ${property.land_area}㎡</span>` : ''}
  </div>
  <div class="price">${escHtml(priceStr)}</div>
  <div>
    <span class="badge">${escHtml(ownershipLabel)}</span>
  </div>
  ${coverImage ? `<img src="${escHtml(coverImage)}" alt="${escHtml(title)}" width="900" height="600" loading="eager" />` : ''}
  ${description ? `<p class="desc" itemprop="description">${escHtml(description.slice(0, 400))}</p>` : ''}
</div>`;

  // 将必要的 SEO meta 注入到 dist/index.html 的 <head> 中
  // 同时把预渲染骨架注入 <div id="root"> 内（React 加载后会覆盖）
  let html = indexHtml;

  // 1. 替换 <title>
  html = html.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escHtml(pageTitle)}</title>`
  );

  // 2. 替换已有的 description meta（避免重复）
  html = html.replace(
    /<meta name="description"[^>]*>/i,
    `<meta name="description" content="${escHtml(metaDesc)}" />`
  );

  // 3. 注入其余 SEO meta 到 </head> 之前（不含 description，已上面替换了）
  const seoMeta = `
  <!-- Prerendered SEO Meta: ${slug} (${lang}) -->
  <link rel="canonical" href="${propertyUrl}" />
  <link rel="alternate" hreflang="zh" href="${zhUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${zhUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${propertyUrl}" />
  <meta property="og:title" content="${escHtml(pageTitle)}" />
  <meta property="og:description" content="${escHtml(metaDesc)}" />
  <meta property="og:site_name" content="REAL REAL" />
  ${ogImage}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escHtml(metaDesc)}" />
  ${twitterImage}
  <script type="application/ld+json">${jsonLd}</script>
  <style>${inlineCss}</style>`;

  html = html.replace('</head>', `${seoMeta}\n</head>`);

  // 3. 把骨架内容注入到 <div id="root"> 中（React 加载后会覆盖）
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${preRenderShell}</div>`
  );

  return html;
}

// 简单的 HTML 转义
function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── 文件写入 ──────────────────────────────────────────────────────

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeHtmlFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ── 主流程 ────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Starting prerender-properties...');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`📂 Output: ${WRITE_TO_DIST ? 'dist/' : 'public/'} (set PRERENDER_TARGET=dist to write to dist)`);

  // 模板优先级：dist/index.html（含 hash 资源链接）> public/index.html > index.html（源文件）
  const distIndexPath  = path.join(DIST_DIR, 'index.html');
  const srcIndexPath   = path.join(PROJECT_ROOT, 'index.html');

  let indexHtmlPath: string;
  if (fs.existsSync(distIndexPath)) {
    indexHtmlPath = distIndexPath;
    console.log('✅ Using dist/index.html as template (production build)');
  } else if (fs.existsSync(srcIndexPath)) {
    indexHtmlPath = srcIndexPath;
    console.log('✅ Using index.html as template (source file, asset hashes may differ)');
  } else {
    console.error('❌ Cannot find index.html template');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // 获取数据
  console.log('\n📦 Fetching properties...');
  const properties = await fetchAllProperties();
  console.log(`✅ Found ${properties.length} published properties`);

  if (properties.length === 0) {
    console.warn('⚠️  No published properties found. Skipping prerender.');
    return;
  }

  const propertyIds = properties.map(p => p.id);

  console.log('\n🖼  Fetching property images...');
  const imagesMap = await fetchImages(propertyIds);
  const totalImgs = Object.values(imagesMap).reduce((s, a) => s + a.length, 0);
  console.log(`✅ Fetched ${totalImgs} images for ${Object.keys(imagesMap).length} properties`);

  console.log('\n🗺  Using static area name map...');

  // 生成 HTML 文件
  console.log('\n📝 Generating HTML files...');
  let successCount = 0;
  const skipCount = 0;

  for (const property of properties) {
    const slug = property.slug || property.id;
    const images = imagesMap[property.id] || [];

    for (const lang of LANGUAGES) {
      const areaName = getAreaName(property.area_id, lang);
      const html = buildHtml(property, images, areaName, lang, indexHtml);

      // 写入两种路径，兼容所有静态服务器：
      // 1. slug/index.html  → skywork / Nginx / 任何标准静态服务器直接命中
      // 2. slug.html        → Vercel cleanUrls 模式命中
      const publicIndexPath = path.join(OUTPUT_DIR, lang, 'property', slug, 'index.html');
      const publicHtmlPath  = path.join(OUTPUT_DIR, lang, 'property', `${slug}.html`);
      writeHtmlFile(publicIndexPath, html);
      writeHtmlFile(publicHtmlPath, html);
      // 如果 dist 已存在，同步写一份（方便本地测试）
      if (!WRITE_TO_DIST && fs.existsSync(DIST_DIR)) {
        const distIndexPath = path.join(DIST_DIR, lang, 'property', slug, 'index.html');
        const distHtmlPath  = path.join(DIST_DIR, lang, 'property', `${slug}.html`);
        writeHtmlFile(distIndexPath, html);
        writeHtmlFile(distHtmlPath, html);
      }
      successCount++;
    }
  }

  // 统计
  const totalFiles = successCount;
  const skippedMsg = skipCount > 0 ? ` (${skipCount} skipped)` : '';
  const outLabel = WRITE_TO_DIST ? 'dist' : 'public';
  console.log(`\n✅ Prerender complete!`);
  console.log(`   Generated: ${totalFiles} HTML files${skippedMsg}`);
  console.log(`   - ZH: ${successCount / 2} files in ${outLabel}/zh/property/`);
  console.log(`   - EN: ${successCount / 2} files in ${outLabel}/en/property/`);

  // 列出示例
  if (properties.length > 0) {
    const sample = properties[0];
    const sampleSlug = sample.slug || sample.id;
    const outLabel = WRITE_TO_DIST ? 'dist' : 'public';
    console.log(`\n📄 Sample output:`);
    console.log(`   ${outLabel}/zh/property/${sampleSlug}.html`);
    console.log(`   ${outLabel}/en/property/${sampleSlug}.html`);
    console.log(`   URL: ${SITE_URL}/zh/property/${sampleSlug}`);
  }
}

main().catch(err => {
  console.error('\n❌ Prerender failed:', err);
  process.exit(1);
});
