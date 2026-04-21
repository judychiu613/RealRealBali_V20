import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// 生成会话ID的函数
function generateSessionId(): string {
  const stored = localStorage.getItem('session_id');
  if (stored) return stored;
  
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('session_id', sessionId);
  return sessionId;
}

// 获取用户设备信息
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer || null,
    // 可以添加更多设备信息
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

// 解析User-Agent信息
async function parseUserAgentInfo(userAgent: string): Promise<{ deviceType: string; deviceSubtype: string | null; browserName: string }> {
  try {
    const response = await fetch(`https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/user_agent_parser_2026_03_04_05_35?action=parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userAgent })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Failed to parse user agent:', error);
    // 如果解析失败，返回默认值
    return {
      deviceType: 'desktop',
      deviceSubtype: null,
      browserName: 'Unknown'
    };
  }
}

// 获取用户地理位置信息
async function getLocationInfo(): Promise<{ country: string; city: string | null }> {
  try {
    // 使用免费的 IP 地理位置 API
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 检查是否有错误响应
    if (data.error) {
      throw new Error(data.reason || 'API error');
    }
    
    return {
      country: data.country_name || 'Unknown',
      city: data.city || null
    };
  } catch (error) {
    console.warn('Failed to get location info:', error);
    // 如果解析失败，返回默认值
    return {
      country: 'Unknown',
      city: null
    };
  }
}

// 计算滚动深度
function calculateScrollDepth(): number {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (documentHeight <= 0) return 100;
  
  const scrollDepth = (scrollTop / documentHeight) * 100;
  return Math.min(Math.max(scrollDepth, 0), 100);
}

interface ViewTrackingOptions {
  propertyId: string;
  pageType: 'listing' | 'detail';
  trackScrollDepth?: boolean;
  trackViewDuration?: boolean;
}

export function useViewTracking({
  propertyId,
  pageType,
  trackScrollDepth = true,
  trackViewDuration = true
}: ViewTrackingOptions) {
  const { user } = useAuth();
  const viewStartTime = useRef<number>(Date.now());
  const viewRecordId = useRef<string | null>(null);
  const maxScrollDepth = useRef<number>(0);
  const lastUpdateTime = useRef<number>(Date.now());

  // 记录初始浏览
  const recordView = useCallback(async () => {
    try {
      const sessionId = generateSessionId();
      const deviceInfo = getDeviceInfo();
      
      // 获取地理位置信息（异步获取，不阻塞主流程）
      const locationInfo = await getLocationInfo();
      
      // 解析User-Agent信息
      const userAgentInfo = await parseUserAgentInfo(deviceInfo.userAgent);
      
      const viewData = {
        user_id: user?.id || null,
        session_id: sessionId,
        property_id: propertyId,
        page_type: pageType,
        user_agent: deviceInfo.userAgent,
        referrer: deviceInfo.referrer,
        view_duration: 0,
        scroll_depth: 0,
        country: locationInfo.country,
        city: locationInfo.city,
        device_type: userAgentInfo.deviceType,
        device_subtype: userAgentInfo.deviceSubtype,
        browser_name: userAgentInfo.browserName
      };

      const { data, error } = await supabase
        .from('user_views')
        .insert(viewData)
        .select('id')
        .single();

      if (error) {
        console.error('Error recording view:', error);
        return;
      }

      viewRecordId.current = data.id;
      viewStartTime.current = Date.now();
      
    } catch (error) {
      console.error('Error in recordView:', error);
    }
  }, [user?.id, propertyId, pageType]);

  // 更新浏览数据
  const updateViewData = useCallback(async (forceUpdate = false) => {
    if (!viewRecordId.current) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    
    // 避免过于频繁的更新（至少间隔5秒）
    if (!forceUpdate && timeSinceLastUpdate < 5000) return;

    try {
      const currentScrollDepth = trackScrollDepth ? calculateScrollDepth() : 0;
      maxScrollDepth.current = Math.max(maxScrollDepth.current, currentScrollDepth);
      
      const viewDuration = trackViewDuration ? Math.floor((now - viewStartTime.current) / 1000) : 0;

      const { error } = await supabase
        .from('user_views')
        .update({
          view_duration: viewDuration,
          scroll_depth: maxScrollDepth.current
        })
        .eq('id', viewRecordId.current);

      if (error) {
        console.error('Error updating view data:', error);
      } else {
        lastUpdateTime.current = now;
      }
    } catch (error) {
      console.error('Error in updateViewData:', error);
    }
  }, [trackScrollDepth, trackViewDuration]);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!trackScrollDepth) return;
    
    const currentScrollDepth = calculateScrollDepth();
    maxScrollDepth.current = Math.max(maxScrollDepth.current, currentScrollDepth);
  }, [trackScrollDepth]);

  // 处理页面离开事件
  const handleBeforeUnload = useCallback(() => {
    updateViewData(true); // 强制更新
  }, [updateViewData]);

  // 处理页面可见性变化
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      updateViewData(true); // 页面隐藏时更新数据
    }
  }, [updateViewData]);

  useEffect(() => {
    // 记录初始浏览
    recordView();

    // 添加事件监听器
    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 定期更新浏览数据（每30秒）
    const updateInterval = setInterval(() => {
      updateViewData();
    }, 30000);

    // 清理函数
    return () => {
      if (trackScrollDepth) {
        window.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(updateInterval);
      
      // 组件卸载时最后更新一次数据
      updateViewData(true);
    };
  }, [recordView, updateViewData, handleScroll, handleBeforeUnload, handleVisibilityChange, trackScrollDepth]);

  return {
    // 可以返回一些有用的方法或状态
    updateViewData: () => updateViewData(true),
    getCurrentScrollDepth: calculateScrollDepth,
    getViewDuration: () => Math.floor((Date.now() - viewStartTime.current) / 1000)
  };
}

// 简化版本的浏览追踪Hook，用于列表页面
export function useSimpleViewTracking(propertyId: string, pageType: 'listing' | 'detail' = 'listing') {
  return useViewTracking({
    propertyId,
    pageType,
    trackScrollDepth: pageType === 'detail', // 只在详情页追踪滚动
    trackViewDuration: true
  });
}