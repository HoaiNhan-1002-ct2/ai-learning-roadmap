import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import api from '../services/api';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10">
      <div className="glass-panel w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden p-0 shadow-2xl">
        
        {/* Left Branding Panel */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-center items-center relative bg-gradient-to-br from-accentPrimary/10 to-accentSecondary/10 border-r border-borderGlass">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-accentPrimary blur-xl opacity-50 rounded-full"></div>
              <div className="bg-gradient-to-br from-accentPrimary to-accentSecondary p-5 rounded-2xl relative shadow-lg">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Chào mừng đến với <span className="bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent">EduAI</span>
            </h1>
            <p className="text-textSecondary text-lg max-w-sm">
              Trợ lý học tập thông minh giúp bạn tối ưu hóa quá trình học và đạt kết quả tốt nhất.
            </p>

            <div className="mt-12 flex items-center gap-2 text-sm text-textSecondary bg-white/5 py-2 px-4 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-accentPrimary" />
              <span>Học tập hiệu quả hơn cùng AI</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="text-center mb-8 md:hidden">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-accentPrimary" />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent">EduAI</h2>
            </div>
            <p className="text-textSecondary text-sm">Trợ lý học tập thông minh của bạn</p>
          </div>

          <div className="flex border-b border-borderGlass mb-8">
            <button 
              className={`flex-1 pb-3 font-medium transition-all duration-300 text-lg ${isLogin ? 'text-accentPrimary border-b-2 border-accentPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
              onClick={() => setIsLogin(true)}
            >
              Đăng Nhập
            </button>
            <button 
              className={`flex-1 pb-3 font-medium transition-all duration-300 text-lg ${!isLogin ? 'text-accentPrimary border-b-2 border-accentPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
              onClick={() => setIsLogin(false)}
            >
              Đăng Ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  Họ và Tên
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3.5 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
                  placeholder="Nhập tên của bạn"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3.5 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                Mật khẩu
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3.5 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger text-danger text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary mt-4 py-3.5 text-lg font-semibold">
              {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
