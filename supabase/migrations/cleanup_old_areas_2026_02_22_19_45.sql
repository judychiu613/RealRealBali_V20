-- 删除旧的区域数据（不在新结构中的区域）
DELETE FROM public.property_areas_map 
WHERE id NOT IN (
  -- 保留新的一级分类
  'west-coast', 'south-bukit', 'ubud-central', 'emerging-west', 'east-bali', 'north-bali',
  -- 保留新的二级区域
  'canggu', 'pererenan', 'seseh', 'cemagi', 'kerobokan', 'seminyak', 'kuta', 'legian',
  'uluwatu', 'pecatu', 'bingin', 'ungasan', 'jimbaran', 'nusa-dua', 'benoa',
  'ubud-center', 'sayan', 'mas', 'pejeng', 'lodtunduh', 'tegalalang', 'tampaksiring', 'payangan',
  'kedungu', 'nyanyi', 'kaba-kaba', 'cepaka', 'tanah-lot', 'balian',
  'candidasa', 'manggis', 'amed',
  'lovina', 'munduk', 'pemuteran'
);

-- 验证最终的区域结构
SELECT 
  id,
  name_zh,
  name_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级分类（市场分区）'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;

-- 验证房源数据
SELECT 
  '房源区域分布' as category,
  pam.name_zh as 区域名称,
  pam.name_en as 英文名称,
  parent.name_zh as 所属市场分区,
  COUNT(p.id) as 房源数量
FROM public.property_areas_map pam
LEFT JOIN public.property_areas_map parent ON pam.parent_id = parent.id
LEFT JOIN public.properties p ON pam.id = p.area_id
WHERE pam.parent_id IS NOT NULL
GROUP BY pam.id, pam.name_zh, pam.name_en, parent.name_zh
HAVING COUNT(p.id) > 0
ORDER BY parent.name_zh, COUNT(p.id) DESC;