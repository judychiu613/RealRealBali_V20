-- 查看所有二级区域的ID（注意大小写）
SELECT id, name_zh, name_en, parent_id
FROM property_areas_map
WHERE parent_id IS NOT NULL
ORDER BY name_zh;

-- 查看房源RR370301的area_id（注意大小写）
SELECT id, title_zh, area_id
FROM properties
WHERE id = 'RR370301';