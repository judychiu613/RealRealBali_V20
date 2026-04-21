import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, ArrowUpRight, User, Heart, LogOut, Shield } from 'lucide-react';
import { SiInstagram, SiLinkedin, SiWhatsapp, SiX } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ROUTE_PATHS, TRANSLATIONS, scrollToTop } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageCurrencySelector } from '@/components/LanguageCurrencySelector';
import { IMAGES } from '@/assets/images';
interface NavLink {
  path: string;
  label: string;
  onClick?: () => void;
  typeParam?: string; // 用于区分购置房产和购置土地
}
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    language
  } = useApp();
  const {
    user,
    signOut
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  // 路由变化时自动关闭移动端菜单
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  const navLinks: NavLink[] = [{
    path: ROUTE_PATHS.HOME(language),
    label: t.nav.home
  }, {
    path: ROUTE_PATHS.PROPERTIES(language),
    label: t.nav.properties,
    onClick: () => navigate(`${ROUTE_PATHS.PROPERTIES(language)}?type=villa`),
    typeParam: 'villa' // 标识这是购置房产
  }, {
    path: ROUTE_PATHS.PROPERTIES(language),
    label: t.nav.land,
    onClick: () => navigate(`${ROUTE_PATHS.PROPERTIES(language)}?type=land`),
    typeParam: 'land' // 标识这是购置土地
  }, {
    path: ROUTE_PATHS.BLOG(language),
    label: language === 'zh' ? '博客' : 'Blog'
  }, {
    path: ROUTE_PATHS.ABOUT(language),
    label: t.nav.about
  }, {
    path: ROUTE_PATHS.CONTACT(language),
    label: t.nav.contact
  }];
  return <div className="flex flex-col min-h-screen selection:bg-primary/10 selection:text-primary">
      {/* 顶部导航栏 - 静奢极简风格 */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-black/5 py-1.5 md:py-3">
        <div className="luxury-container flex items-center justify-between">
          <Link to={ROUTE_PATHS.HOME(language)} className="transition-all duration-500 hover:opacity-70 shrink-0" onClick={scrollToTop}>
            <img src={IMAGES.REAL_REAL_VECTOR_READY_LOGO_1_44} alt="Real Real Logo" className="h-7 md:h-10 transition-all duration-500" />
          </Link>

          {/* 桌面端导航菜单 */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link, index) => {
            // 获取当前 URL 的 type 参数
            const searchParams = new URLSearchParams(location.search);
            const currentType = searchParams.get('type');
            
            // 判断当前链接是否激活
            let isActive = false;
            
            if (link.typeParam) {
              // 对于购置房产和购置土地，需要同时匹配路径和 type 参数
              isActive = location.pathname === link.path && currentType === link.typeParam;
            } else if (link.path === ROUTE_PATHS.PROPERTIES(language)) {
              // 如果是 properties 路径但没有 typeParam，则不激活（避免冲突）
              isActive = false;
            } else if (link.path === ROUTE_PATHS.BLOG(language)) {
              // 博客页面：匹配 /blog 或 /blog/:slug
              isActive = location.pathname === link.path || location.pathname.startsWith(`/${language}/blog/`);
            } else {
              // 其他页面：精确匹配路径
              isActive = location.pathname === link.path;
            }
            
            // 激活状态的样式类
            const activeClasses = isActive 
              ? "text-foreground after:w-full" 
              : "text-foreground/50 after:w-0 hover:after:w-full";
            
            if (link.onClick) {
              return <button key={index} onClick={() => {
                scrollToTop();
                link.onClick();
              }} className={`font-medium text-sm uppercase tracking-normal relative transition-colors duration-300 hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-px after:bg-foreground after:transition-all after:duration-500 xl:text-sm ${activeClasses}`}>
                    {link.label}
                  </button>;
            }
            return <Link key={index} to={link.path} onClick={scrollToTop} className={`font-medium text-sm uppercase tracking-normal relative transition-colors duration-300 hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-px after:bg-foreground after:transition-all after:duration-500 xl:text-sm ${activeClasses}`}>
                  {link.label}
                </Link>;
          })}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <LanguageCurrencySelector />
            
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.common.myAccount}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2" sideOffset={8}>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTE_PATHS.PROFILE(language)} className="flex items-center gap-2" onClick={scrollToTop}>
                      <User className="w-4 h-4" />
                      {t.common.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTE_PATHS.FAVORITES(language)} className="flex items-center gap-2" onClick={scrollToTop}>
                      <Heart className="w-4 h-4" />
                      {t.common.favorites}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTE_PATHS.ADMIN} className="flex items-center gap-2" onClick={scrollToTop}>
                      <Shield className="w-4 h-4" />
                      管理后台
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4" />
                    {t.common.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to={ROUTE_PATHS.LOGIN(language)} onClick={scrollToTop}>
                <Button className="luxury-button px-6 py-1.5 luxury-caption">
                  {t.common.login}
                </Button>
              </Link>}
            
            <Link to={ROUTE_PATHS.CONTACT(language)}>
              
            </Link>
          </div>

          {/* 移动端菜单切换按钮 */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageCurrencySelector />
            <button className="text-foreground p-1.5 transition-transform active:scale-95" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端全屏菜单层 */}
      <AnimatePresence>
        {isMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }} className="fixed inset-0 z-45 bg-background/98 backdrop-blur-xl flex flex-col pt-20 px-6 lg:hidden">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.05 * idx
          }}>
                  {link.onClick ? <button onClick={() => {
              scrollToTop();
              setIsMenuOpen(false);
              link.onClick();
            }} className="text-lg font-light tracking-tight transition-colors text-foreground/60 hover:text-foreground">
                      {link.label}
                    </button> : <Link to={link.path} onClick={() => {
              scrollToTop();
              setIsMenuOpen(false);
            }} className="text-lg font-light tracking-tight transition-colors text-foreground/60 hover:text-foreground">
                      {link.label}
                    </Link>}
                </motion.div>)}
              
              <motion.div className="pt-6 space-y-3" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.4
          }}>
                {user ? <>
                    <Link to={ROUTE_PATHS.PROFILE(language)} className="block w-full py-4 text-sm uppercase tracking-[0.08em] luxury-button-outline flex items-center justify-center gap-2 border border-border rounded-none hover:bg-accent transition-colors" onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}>
                      <User className="w-4 h-4" />
                      {t.common.profile}
                    </Link>
                    <Link to={ROUTE_PATHS.FAVORITES(language)} className="block w-full py-4 text-sm uppercase tracking-[0.08em] luxury-button-outline flex items-center justify-center gap-2 border border-border rounded-none hover:bg-accent transition-colors" onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}>
                      <Heart className="w-4 h-4" />
                      {t.common.favorites}
                    </Link>
                    <Button onClick={() => signOut()} variant="outline" className="w-full py-4 text-sm uppercase tracking-[0.08em] luxury-button-outline flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      {t.common.logout}
                    </Button>
                  </> : <Link to={ROUTE_PATHS.LOGIN(language)} className="block w-full py-5 text-sm uppercase tracking-[0.08em] luxury-button flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" onClick={() => {
              scrollToTop();
              setIsMenuOpen(false);
            }}>
                    <User className="w-4 h-4" />
                    {t.common.login}
                  </Link>}
                
                <Link to={ROUTE_PATHS.CONTACT(language)} className="block w-full py-4 text-sm uppercase tracking-[0.08em] luxury-button-outline flex items-center justify-center border border-border rounded-none hover:bg-accent transition-colors" onClick={() => {
              scrollToTop();
              setIsMenuOpen(false);
            }}>
                  {t.nav.contact}
                </Link>
              </motion.div>
            </nav>
          </motion.div>}
      </AnimatePresence>

      {/* 页面主要内容区域 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 页脚 - 都会极简设计 */}
      <footer className="warm-footer border-t warm-footer-divider pt-16 pb-8">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* 品牌愿景 */}
            <div className="space-y-6">
              <h2 className="luxury-heading text-2xl font-bold tracking-[0.15em] text-foreground uppercase">REAL REAL</h2>
              <p className="luxury-body text-muted-foreground text-sm max-w-xs">
                {t.footer.description}
              </p>
              <div className="flex space-x-5">
                <a href="https://www.instagram.com/realreal.bali/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                  <SiInstagram size={18} />
                </a>
                <a href="https://wa.me/6281330675465" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                  <SiWhatsapp size={18} />
                </a>
                <a href="#" className="text-muted-foreground/60 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                  <SiLinkedin size={18} />
                </a>
                <a href="#" className="text-muted-foreground/60 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
                  <SiX size={18} />
                </a>
              </div>
            </div>

            {/* 核心导航 */}
            

            {/* 热门区域 */}
            

            {/* 联络信息 */}
            
          </div>

          {/* 底部法律条款与版权 */}
          <div className="pt-8 border-t border-border/10 flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="luxury-caption text-muted-foreground/50 xl:text-sm">
              {t.footer.rights}
            </p>
            <div className="flex space-x-8">
              <Link to="#" className="luxury-caption text-muted-foreground/40 hover:text-foreground transition-colors xl:text-sm">
                {language === 'zh' ? '隐私协议' : 'Privacy'}
              </Link>
              <Link to="#" className="luxury-caption text-muted-foreground/40 hover:text-foreground transition-colors xl:text-sm">
                {language === 'zh' ? '条款与细则' : 'Terms'}
              </Link>
              <Link to="#" className="luxury-caption text-muted-foreground/40 hover:text-foreground transition-colors xl:text-sm">
                {language === 'zh' ? '饼干政策' : 'Cookies'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}