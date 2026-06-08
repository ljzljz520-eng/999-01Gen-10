import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  AlertTriangle,
  History,
  LogOut,
  Search,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const menuItems = [
    { path: '/admin', label: '控制台', icon: LayoutDashboard },
    { path: '/admin/reagents', label: '试剂管理', icon: FlaskConical },
    { path: '/admin/reports', label: '质检报告', icon: FileText },
    { path: '/admin/complaints', label: '投诉管理', icon: AlertTriangle },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">试剂管理系统</h1>
            <p className="text-xs text-gray-500">管理员控制台</p>
          </div>
        </div>

        <nav className="p-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
            管理菜单
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => navigate('/query')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
            >
              <Search className="h-5 w-5" />
              切换到查询页面
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <span className="text-sm font-bold">{user.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">系统管理员</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-8">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
