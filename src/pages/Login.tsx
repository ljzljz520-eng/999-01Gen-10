import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, User, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Login = () => {
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'experimenter' | 'admin'>('experimenter');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        const user = useStore.getState().user;
        if (role === 'admin' && user?.role !== 'admin') {
          setError('该账号没有管理员权限');
          useStore.getState().logout();
          setIsLoading(false);
          return;
        }
        if (role === 'experimenter' && user?.role !== 'experimenter') {
          setError('请使用实验人员账号登录');
          useStore.getState().logout();
          setIsLoading(false);
          return;
        }
        navigate(role === 'admin' ? '/admin' : '/query');
      } else {
        setError('用户名或密码错误');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FlaskConical className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">实验试剂批号查询系统</h1>
            <p className="mt-2 text-white/80">请登录以继续使用系统</p>
          </div>

          <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex gap-2">
              <button
                type="button"
                onClick={() => setRole('experimenter')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  role === 'experimenter'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                实验人员
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                管理员
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder={role === 'admin' ? 'admin' : 'exp1 / exp2'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="请输入密码"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  演示账号密码：123456
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    登 录
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">演示账号：</span><br />
                实验人员：exp1 / exp2 (密码: 123456)<br />
                管理员：admin (密码: 123456)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
