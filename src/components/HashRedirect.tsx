import { useEffect } from 'react';

/**
 * HashRedirect 组件
 * 
 * 用途：处理旧的 HashRouter URL 重定向到新的 BrowserRouter URL
 * 
 * 示例：
 * - 旧链接：https://realrealbali.com/#/zh/property/xxx
 * - 新链接：https://realrealbali.com/zh/property/xxx
 * 
 * 工作原理：
 * 1. 检测 URL 中是否有 hash (#)
 * 2. 如果有，提取 hash 后面的路径
 * 3. 使用 window.location.replace() 重定向到新路径
 * 4. 保留所有参数和状态
 */
export function HashRedirect(): null {
  useEffect(() => {
    // 检测是否有 hash 路由
    const hash = window.location.hash;
    
    if (hash && hash.startsWith('#/')) {
      // 提取 hash 后面的路径
      // 例如：#/zh/property/xxx → /zh/property/xxx
      const newPath = hash.substring(1);
      
      console.log('🔄 检测到旧的 Hash 路由，正在重定向...');
      console.log('   旧路径:', window.location.href);
      console.log('   新路径:', newPath);
      
      // 使用 replace 而不是 push，避免在浏览器历史中留下旧链接
      window.location.replace(newPath);
    }
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
