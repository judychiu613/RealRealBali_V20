/**
 * PDF导出工具函数
 * 采用浏览器打印引擎生成PDF，以确保对现代CSS（Tailwind v4）和中文字体的完美支持。
 * 该方案避免了第三方PDF库对中文字体包的巨大依赖（通常>10MB），并能保持“静奢风”设计的视觉一致性。
 */

export interface PropertyData {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  landSize: string;
  buildingSize: string;
  buildYear: string;
  landZone?: string;
  description: string;
  mainImage: string;
  gallery: string[];
  features: string[];
  contact: {
    company: string;
    agentName: string;
    phone: string;
    email: string;
    website: string;
  };
}

/**
 * 导出房源详情为PDF
 * @param property 房源数据对象
 */
export async function exportPropertyToPDF(property: PropertyData): Promise<void> {
  // 创建一个隐藏的iframe用于承载打印内容，避免干扰当前页面布局
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // 构建打印页面的HTML结构
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${property.title} - 房源导出</title>
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500&display=swap");

        :root {
          --primary: #262626;
          --secondary: #737373;
          --accent: #f5f5f5;
          --border: #e5e5e5;
        }

        body {
          font-family: "Inter", "Noto Sans SC", sans-serif;
          color: var(--primary);
          line-height: 1.6;
          margin: 0;
          padding: 40px;
          background: #fff;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        header {
          margin-bottom: 40px;
        }

        .hero-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          margin-bottom: 24px;
        }

        .title-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
        }

        .title-group h1 {
          font-size: 28px;
          font-weight: 300;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .location {
          color: var(--secondary);
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .price {
          font-size: 24px;
          font-weight: 500;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 32px 0;
        }

        .spec-item {
          padding: 16px;
          background: var(--accent);
          text-align: center;
        }

        .spec-label {
          display: block;
          font-size: 12px;
          color: var(--secondary);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .spec-value {
          font-size: 16px;
          font-weight: 500;
        }

        .description-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 16px;
          color: var(--secondary);
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }

        .description {
          font-size: 15px;
          color: #404040;
          white-space: pre-wrap;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 40px;
        }

        .gallery-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }

        footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 2px solid var(--primary);
          display: flex;
          justify-content: space-between;
        }

        .contact-info p {
          margin: 4px 0;
          font-size: 13px;
        }

        .company-name {
          font-weight: 600;
          font-size: 16px !important;
          margin-bottom: 8px !important;
        }

        .qr-placeholder {
          text-align: right;
          font-size: 12px;
          color: var(--secondary);
        }

        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
          /* 强制分页控制 */
          .gallery-section {
            page-break-before: auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <img src="${property.mainImage}" class="hero-image" alt="Hero" />
          <div class="title-section">
            <div class="title-group">
              <h1>${property.title}</h1>
              <div class="location">${property.location}</div>
            </div>
            <div class="price">${property.price}</div>
          </div>
        </header>

        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">卧室 / BEDROOMS</span>
            <span class="spec-value">${property.bedrooms}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">浴室 / BATHROOMS</span>
            <span class="spec-value">${property.bathrooms}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">土地面积 / LAND</span>
            <span class="spec-value">${property.landSize}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">建筑面积 / BLDG</span>
            <span class="spec-value">${property.buildingSize}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">建造年份 / BUILT</span>
            <span class="spec-value">${property.buildYear}</span>
          </div>
          ${property.landZone ? `
          <div class="spec-item">
            <span class="spec-label">土地形式 / LAND ZONE</span>
            <span class="spec-value">${property.landZone}</span>
          </div>` : ''}
        </div>

        <div class="description-section">
          <h2 class="section-title">详情介绍 / DESCRIPTION</h2>
          <div class="description">${property.description}</div>
        </div>

        <div class="gallery-section">
          <h2 class="section-title">实拍展示 / GALLERY</h2>
          <div class="gallery-grid">
            ${property.gallery.map(img => `<img src="${img}" class="gallery-image" />`).join('')}
          </div>
        </div>

        <footer>
          <div class="contact-info">
            <p class="company-name">${property.contact.company}</p>
            <p>置业顾问: ${property.contact.agentName}</p>
            <p>联系电话: ${property.contact.phone}</p>
            <p>电子邮箱: ${property.contact.email}</p>
            <p>官方网站: ${property.contact.website}</p>
          </div>
          <div class="qr-placeholder">
            <p>© 2026 ${property.contact.company}</p>
            <p>专业巴厘岛房产投资服务商</p>
          </div>
        </footer>
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // 等待图片加载完成
  const images = doc.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  await Promise.all(imagePromises);

  // 触发打印
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // 打印后移除iframe
    window.onafterprint = () => {
      document.body.removeChild(iframe);
    };
    
    // 备选方案：如果onafterprint不生效，延时移除
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 500);
  }, 500);
}
