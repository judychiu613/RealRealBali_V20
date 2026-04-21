-- 添加tags_zh和tags_en字段（如果不存在）
DO $$ 
BEGIN
    -- 添加tags_zh字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'tags_zh'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE properties ADD COLUMN tags_zh text[];
    END IF;
    
    -- 添加tags_en字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'tags_en'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE properties ADD COLUMN tags_en text[];
    END IF;
END $$;

-- 为现有房源添加示例标签数据
UPDATE properties 
SET 
  tags_zh = CASE 
    WHEN type_id = 'land' THEN ARRAY['投资热点', '升值潜力', '地理位置优越']
    ELSE ARRAY['豪华装修', '海景房', '私人泳池']
  END,
  tags_en = CASE 
    WHEN type_id = 'land' THEN ARRAY['Investment Hotspot', 'High Appreciation', 'Prime Location']
    ELSE ARRAY['Luxury Furnished', 'Ocean View', 'Private Pool']
  END
WHERE tags_zh IS NULL OR tags_en IS NULL;