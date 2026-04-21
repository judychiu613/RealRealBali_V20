-- 检查properties表中是否存在tags_zh和tags_en字段
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
AND column_name IN ('tags_zh', 'tags_en')
ORDER BY column_name;