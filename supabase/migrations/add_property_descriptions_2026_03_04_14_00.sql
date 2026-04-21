-- 为现有房源添加描述数据
UPDATE properties 
SET 
  description_zh = CASE 
    WHEN type_id = 'land' THEN 
      '这是一块优质的土地，位置绝佳，投资潜力巨大。土地平整，适合各种开发项目，周边配套设施完善，交通便利。'
    ELSE 
      '这是一处精美的别墅，设计现代，装修豪华。拥有宽敞的居住空间，私人花园和游泳池，是理想的度假和投资选择。'
  END,
  description_en = CASE 
    WHEN type_id = 'land' THEN 
      'This is a premium land with excellent location and great investment potential. The land is flat and suitable for various development projects, with complete surrounding facilities and convenient transportation.'
    ELSE 
      'This is a beautiful villa with modern design and luxury decoration. It features spacious living areas, private garden and swimming pool, making it an ideal choice for vacation and investment.'
  END
WHERE (description_zh IS NULL OR description_zh = '') 
   OR (description_en IS NULL OR description_en = '');