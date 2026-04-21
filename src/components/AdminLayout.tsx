import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Building2, 
  Plus,
  Clock,
  FileText,
  BarChart3,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface MenuItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  end?: boolean;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const { adminUser, isAdmin, isSuperAdmin } = useAdminAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['properties-menu', 'analytics']);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">访问受限</h2>
          <p className="text-gray-600 mb-6">您需要管理员权限才能访问此页面</p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              返回首页
            </Button>
            <Button 
              onClick={() => navigate('/login')}
            >
              重新登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: '仪表板',
      end: true
    },
    {
      path: '/admin/properties-menu',
      icon: Building2,
      label: '房源管理',
      children: [
        {
          path: '/admin/properties',
          icon: Building2,
          label: '房源列表'
        },
        {
          path: '/admin/properties/create',
          icon: Plus,
          label: '上架房源'
        },
        ...(isSuperAdmin ? [
          {
            path: '/admin/properties/pending',
            icon: Clock,
            label: '待审核房源'
          },
          {
            path: '/admin/properties/logs',
            icon: FileText,
            label: '操作日志'
          }
        ] : [])
      ]
    },
    ...(isSuperAdmin ? [
      {
        path: '/admin/analytics',
        icon: BarChart3,
        label: '数据分析',
        children: [
          {
            path: '/admin/analytics/members',
            icon: Users,
            label: '会员分析'
          },
          {
            path: '/admin/analytics/listings',
            icon: Building2,
            label: '房源表现分析'
          }
        ]
      }
    ] : [])
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.path.split('/').pop() || '');
    const isActive = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

    if (hasChildren) {
      return (
        <div key={item.path}>
          {/* 一级菜单 */}
          <button
            onClick={() => toggleMenu(item.path.split('/').pop() || '')}
            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* 二级菜单 */}
          {isExpanded && (
            <div className="bg-gray-50">
              {item.children?.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 pl-12 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border-r-2 border-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <child.icon className="w-4 h-4" />
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    // 无子菜单的一级菜单
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary border-r-2 border-primary'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo区域 */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">管理后台</span>
            </div>
          </div>

          {/* 用户信息 */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {adminUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminUser?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {isSuperAdmin ? '超级管理员' : '管理员'}
                </p>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>
          </nav>

          {/* 底部操作 */}
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;