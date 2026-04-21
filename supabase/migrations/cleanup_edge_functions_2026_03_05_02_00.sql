-- 删除调试用的Edge Functions
-- 注意：这个SQL只是记录，实际删除需要通过Supabase CLI或仪表板

-- 需要删除的调试函数列表：
-- 1. step1_check_table_structure_2026_03_04_14_00
-- 2. step2_check_rls_policies_2026_03_04_14_00  
-- 3. step3_check_triggers_2026_03_04_14_00
-- 4. step4_test_direct_insert_2026_03_04_14_00
-- 5. step5_test_registration_2026_03_04_14_00
-- 6. step6_check_profile_creation_2026_03_04_14_00
-- 7. step5_problem_diagnosis_2026_03_04_14_00
-- 8. complete_debug_analysis_2026_03_04_14_00
-- 9. final_verification_test_2026_03_04_14_00
-- 10. deep_step5_diagnosis_2026_03_04_14_00
-- 11. quick_verification_2026_03_05_02_00
-- 12. simple_registration_test_2026_03_05_02_00
-- 13. updated_registration_test_2026_03_05_02_00
-- 14. fixed_registration_test_2026_03_05_02_00
-- 15. trigger_execution_verify_2026_03_05_02_00
-- 16. complete_registration_test_2026_03_05_02_00
-- 17. emergency_registration_test_2026_03_05_02_00

-- 保留的有用函数：
-- 1. create_user_profile_2026_03_05_02_00 (用于创建用户配置文件)

SELECT 'Edge Functions cleanup needed' as status,
       'Delete debug functions via Supabase dashboard' as action,
       '17 debug functions to delete, 1 to keep' as summary;

-- 显示当前数据库状态确认一切正常
SELECT 
  'Database status check' as test,
  COUNT(*) as total_profiles,
  MAX(created_at) as latest_profile
FROM public.user_profiles;