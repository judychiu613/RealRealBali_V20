/**
 * 语言路径工具函数
 * 用于处理多语言 URL 路径的转换和校验
 */

export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * 校验语言代码是否合法
 * @param lang 语言代码
 * @returns 是否为支持的语言
 */
export function isSupportedLanguage(lang: string | undefined): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as any);
}

/**
 * 将当前路径转换为指定语言的路径
 * 保留 query string 和 hash
 * @param currentPath 当前完整路径（包含 hash、search）
 * @param newLang 目标语言
 * @returns 新的完整路径
 */
export function switchLanguageInPath(
  currentPath: string,
  newLang: SupportedLanguage
): string {
  // 解析 URL 组成部分
  const url = new URL(currentPath, window.location.origin);
  const pathname = url.pathname;
  const search = url.search;
  const hash = url.hash;

  // 匹配语言前缀：/zh/ 或 /en/
  const langPrefixRegex = /^\/(zh|en)(\/|$)/;
  
  let newPathname: string;
  
  if (langPrefixRegex.test(pathname)) {
    // 已有语言前缀：替换
    newPathname = pathname.replace(langPrefixRegex, `/${newLang}$2`);
  } else {
    // 没有语言前缀：添加
    // 处理 / 和 /xxx 两种情况
    newPathname = pathname === '/' 
      ? `/${newLang}/`
      : `/${newLang}${pathname}`;
  }

  // 重组完整路径
  return `${newPathname}${search}${hash}`;
}

/**
 * 从路径中提取语言代码
 * @param pathname 路径名
 * @returns 语言代码或 null
 */
export function extractLanguageFromPath(pathname: string): SupportedLanguage | null {
  const match = pathname.match(/^\/(zh|en)(\/|$)/);
  return match ? (match[1] as SupportedLanguage) : null;
}
