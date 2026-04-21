import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Try to load .env, but fall back to hardcoded defaults (anon keys are public)
try {
  const { config } = await import('dotenv');
  config();
} catch (_) { /* dotenv not available, use defaults */ }

// 配置
const SITE_URL = 'https://realrealbali.com';
const LANGUAGES = ['zh', 'en'] as const;

// Supabase credentials - anon key is safe to be in client-side code
const supabaseUrl = process.env.VITE_SUPABASE_URL
  || 'https://ilusppbsxslyuzcifyeo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXNwcGJzeHNseXV6Y2lmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTMxNTQsImV4cCI6MjA4NzIyOTE1NH0.uYXE5mkbGL24gL5Z1n9wxIXtC-P1QuBYGH8M_nvQsOI';

const supabase = createClient(supabaseUrl, supabaseKey);

// 静态页面配置
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/properties', priority: 0.9, changefreq: 'daily' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
];

// 获取所有已发布的房源
async function fetchProperties() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('slug, id, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch properties:', err);
    return [];
  }
}

// 获取所有已发布的博客文章
async function fetchBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch blog posts:', err);
    return [];
  }
}

// 格式化日期为 ISO 8601 格式
function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// 生成单个 URL 条目（多语言版本）
function generateUrlEntry(
  path: string,
  priority: number,
  changefreq: string,
  lastmod?: string
): string {
  const alternates = LANGUAGES.map(lang => {
    // ✅ 移除 # 符号，使用标准 URL
    const url = `${SITE_URL}/${lang}${path}`;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`;
  }).join('\n');

  const lastmodTag = lastmod ? `    <lastmod>${lastmod}</lastmod>` : '';

  // 为每种语言生成一个完整的 <url> 条目
  return LANGUAGES.map(lang => {
    // ✅ 移除 # 符号，使用标准 URL
    const url = `${SITE_URL}/${lang}${path}`;
    return `  <url>
    <loc>${url}</loc>
${alternates}
${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');
}

// 生成完整的 sitemap XML
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`🌐 Languages: ${LANGUAGES.join(', ')}`);

  // 获取动态内容
  console.log('\n📦 Fetching properties...');
  const properties = await fetchProperties();
  console.log(`✅ Found ${properties.length} published properties`);

  console.log('\n📝 Fetching blog posts...');
  const blogPosts = await fetchBlogPosts();
  console.log(`✅ Found ${blogPosts.length} blog posts`);

  // 开始生成 XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

`;

  // 添加静态页面
  console.log('\n📄 Adding static pages...');
  for (const page of staticPages) {
    xml += generateUrlEntry(
      page.path,
      page.priority,
      page.changefreq,
      formatDate(new Date())
    );
    xml += '\n';
  }

  // 添加房源详情页（使用 slug）
  console.log('🏠 Adding property pages...');
  for (const property of properties) {
    const slug = property.slug || property.id;
    xml += generateUrlEntry(
      `/property/${slug}`,
      0.8,
      'weekly',
      formatDate(property.updated_at)
    );
    xml += '\n';
  }

  // 添加博客文章页
  console.log('📰 Adding blog post pages...');
  for (const post of blogPosts) {
    xml += generateUrlEntry(
      `/blog/${post.slug}`,
      0.7,
      'monthly',
      formatDate(post.updated_at)
    );
    xml += '\n';
  }

  xml += '</urlset>';

  // 写入文件
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  console.log(`\n💾 Writing sitemap to ${outputPath}...`);
  
  try {
    fs.writeFileSync(outputPath, xml, 'utf-8');
    console.log('✅ Sitemap generated successfully!');
    
    // 统计信息
    const totalUrls = (staticPages.length + properties.length + blogPosts.length) * LANGUAGES.length;
    console.log(`\n📊 Statistics:`);
    console.log(`   Total URLs: ${totalUrls}`);
    console.log(`   - Static pages: ${staticPages.length * LANGUAGES.length} (${staticPages.length} pages × ${LANGUAGES.length} languages)`);
    console.log(`   - Property pages: ${properties.length * LANGUAGES.length} (${properties.length} properties × ${LANGUAGES.length} languages)`);
    console.log(`   - Blog posts: ${blogPosts.length * LANGUAGES.length} (${blogPosts.length} posts × ${LANGUAGES.length} languages)`);
    console.log(`\n🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`);
  } catch (err) {
    console.error('❌ Failed to write sitemap:', err);
    process.exit(1);
  }
}

// 执行生成
generateSitemap().catch(err => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
