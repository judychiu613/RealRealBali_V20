-- 检查房源 RR370301 的 area_id
SELECT id, title_zh, area_id
FROM properties
WHERE id = 'RR370301';

-- 检查 property_areas_map 表中是否有 uluwatu 的记录
SELECT id, name_zh, name_en, parent_id
FROM property_areas_map
WHERE id = 'uluwatu' OR id ILIKE '%uluwatu%';

-- 检查所有二级区域（有 parent_id 的）
SELECT id, name_zh, name_en, parent_id
FROM property_areas_map
WHERE parent_id IS NOT NULL
ORDER BY parent_id, sort_order;