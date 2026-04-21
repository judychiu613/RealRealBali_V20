-- 1. 检查当前数据库状态
SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM properties;

-- 2. 查看现有数据
SELECT id, title_zh, title_en, type_id, area_id, price_usd, is_published, is_featured, status
FROM properties 
LIMIT 5;

-- 3. 如果没有数据，创建一些测试数据
INSERT INTO properties (
    id, title_zh, title_en, type_id, area_id, price_usd, price_cny, price_idr,
    bedrooms, bathrooms, building_area, land_area,
    is_published, is_featured, status, created_at
) VALUES 
(
    'test-villa-001',
    '豪华海景别墅',
    'Luxury Ocean View Villa',
    'villa',
    'seminyak',
    850000,
    6120000,
    12750000000,
    4,
    3,
    300,
    500,
    true,
    true,
    'available',
    NOW()
),
(
    'test-villa-002', 
    '现代风格别墅',
    'Modern Style Villa',
    'villa',
    'canggu',
    650000,
    4680000,
    9750000000,
    3,
    2,
    250,
    400,
    true,
    true,
    'available',
    NOW()
),
(
    'test-land-001',
    '优质投资土地',
    'Prime Investment Land',
    'land',
    'ubud',
    200000,
    1440000,
    3000000000,
    0,
    0,
    0,
    1000,
    true,
    false,
    'available',
    NOW()
),
(
    'test-villa-003',
    '传统巴厘岛别墅',
    'Traditional Balinese Villa',
    'villa',
    'ubud',
    450000,
    3240000,
    6750000000,
    2,
    2,
    180,
    300,
    true,
    false,
    'available',
    NOW()
),
(
    'test-villa-004',
    '海滨度假别墅',
    'Beachfront Resort Villa',
    'villa',
    'jimbaran',
    1200000,
    8640000,
    18000000000,
    5,
    4,
    400,
    600,
    true,
    true,
    'available',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 4. 为测试房源添加图片
INSERT INTO property_images (property_id, image_url, sort_order) VALUES
('test-villa-001', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 1),
('test-villa-001', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop', 2),
('test-villa-002', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 1),
('test-villa-002', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 2),
('test-land-001', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', 1),
('test-villa-003', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 1),
('test-villa-004', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop', 1),
('test-villa-004', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 2)
ON CONFLICT (property_id, sort_order) DO NOTHING;

-- 5. 验证数据插入
SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM properties;

-- 6. 查看测试数据
SELECT 
    p.id, 
    p.title_zh, 
    p.title_en, 
    p.type_id, 
    p.area_id, 
    p.price_usd, 
    p.is_published, 
    p.is_featured,
    p.status,
    COUNT(pi.image_url) as image_count
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh, p.title_en, p.type_id, p.area_id, p.price_usd, p.is_published, p.is_featured, p.status
ORDER BY p.created_at DESC;