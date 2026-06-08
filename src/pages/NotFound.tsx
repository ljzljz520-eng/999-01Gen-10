import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
      <div className="text-center text-white">
        <h1 className="text-9xl font-bold opacity-20">404</h1>
        <h2 className="mt-4 text-2xl font-bold">页面未找到</h2>
        <p className="mt-2 text-white/80">您访问的页面不存在或已被移除</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-primary-600 shadow-lg transition-all hover:bg-primary-50"
          >
            <Home className="h-5 w-5" />
            返回登录
          </button>
          <button
            onClick={() => navigate('/query')}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <Search className="h-5 w-5" />
            去查询页面
          </button>
        </div>
      </div>
    </div>
  );
};
