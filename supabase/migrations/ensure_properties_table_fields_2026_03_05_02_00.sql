-- 检查properties表是否包含所有必要字段，如果不存在则添加
DO $$
BEGIN
    -- 检查并添加缺失的字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'tags_en') THEN
        ALTER TABLE properties ADD COLUMN tags_en TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'tags_zh') THEN
        ALTER TABLE properties ADD COLUMN tags_zh TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'amenities_en') THEN
        ALTER TABLE properties ADD COLUMN amenities_en TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'amenities_zh') THEN
        ALTER TABLE properties ADD COLUMN amenities_zh TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'build_year') THEN
        ALTER TABLE properties ADD COLUMN build_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'land_zone_id') THEN
        ALTER TABLE properties ADD COLUMN land_zone_id TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'leasehold_years') THEN
        ALTER TABLE properties ADD COLUMN leasehold_years INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'ownership') THEN
        ALTER TABLE properties ADD COLUMN ownership TEXT DEFAULT 'freehold';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'latitude') THEN
        ALTER TABLE properties ADD COLUMN latitude DECIMAL(10,8) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'longitude') THEN
        ALTER TABLE properties ADD COLUMN longitude DECIMAL(11,8) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'approval_status') THEN
        ALTER TABLE properties ADD COLUMN approval_status TEXT DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'approved_by') THEN
        ALTER TABLE properties ADD COLUMN approved_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'approved_at') THEN
        ALTER TABLE properties ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'rejection_reason') THEN
        ALTER TABLE properties ADD COLUMN rejection_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'created_by') THEN
        ALTER TABLE properties ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'updated_by') THEN
        ALTER TABLE properties ADD COLUMN updated_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 查看最终的表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
ORDER BY ordinal_position;