-- 创建一个简单的测试函数来验证R2配置
CREATE OR REPLACE FUNCTION test_r2_config()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 这只是一个占位函数，实际上传将通过前端直接调用R2 API
  RETURN json_build_object(
    'status', 'ready',
    'message', 'R2 configuration test function created',
    'timestamp', now()
  );
END;
$$;