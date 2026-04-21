-- 查看所有当前房源使用的区域ID
SELECT DISTINCT area_id FROM public.properties ORDER BY area_id;

-- 将所有剩余的房源映射到新区域
UPDATE public.properties SET area_id = 'seminyak' WHERE area_id = 'denpasar';
UPDATE public.properties SET area_id = 'canggu' WHERE area_id NOT IN (
  'canggu', 'pererenan', 'seseh', 'cemagi', 'kerobokan', 'seminyak', 'kuta', 'legian',
  'uluwatu', 'pecatu', 'bingin', 'ungasan', 'jimbaran', 'nusa-dua', 'benoa',
  'ubud-center', 'sayan', 'mas', 'pejeng', 'lodtunduh', 'tegalalang', 'tampaksiring', 'payangan',
  'kedungu', 'nyanyi', 'kaba-kaba', 'cepaka', 'tanah-lot', 'balian',
  'candidasa', 'manggis', 'amed',
  'lovina', 'munduk', 'pemuteran'
);

-- 验证所有房源都使用有效的区域ID
SELECT 
  p.area_id,
  COUNT(p.id) as 房源数量,
  pam.name_zh as 区域名称
FROM public.properties p
LEFT JOIN public.property_areas_map pam ON p.area_id = pam.id
GROUP BY p.area_id, pam.name_zh
ORDER BY p.area_id;