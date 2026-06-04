import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        navigate('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
      <div className="glass-panel w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent">EduAI</h2>
          </div>
          <p className="text-textSecondary text-sm">Trợ lý học tập thông minh của bạn</p>
        </div>

        <div className="flex border-b border-borderGlass mb-8">
          <button 
            className={`flex-1 pb-3 font-medium transition-all duration-300 ${isLogin ? 'text-accentPrimary border-b-2 border-accentPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
            onClick={() => setIsLogin(true)}
          >
            Đăng Nhập
          </button>
          <button 
            className={`flex-1 pb-3 font-medium transition-all duration-300 ${!isLogin ? 'text-accentPrimary border-b-2 border-accentPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
            onClick={() => setIsLogin(false)}
          >
            Đăng Ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
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
              className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
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
              className="bg-white/5 border border-borderGlass rounded-lg px-4 py-3 text-textPrimary focus:border-accentPrimary focus:ring-1 focus:ring-accentPrimary/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary mt-2">
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
