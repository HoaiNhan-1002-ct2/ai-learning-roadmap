import React, { useState } from 'react';
import api from '../services/api';
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Đang cập nhật...', type: 'info' });
    try {
      const res = await api.put(`/users/${user.id}`, { name, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage({ text: 'Cập nhật thành công!', type: 'success' });
      setPassword('');
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Lỗi cập nhật', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-6 shadow-sm border-4 border-white">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Hồ sơ cá nhân</h2>
        <p className="text-slate-500">Quản lý thông tin bảo mật và tài khoản của bạn</p>
      </header>
      
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accentPrimary/5 to-accentSecondary/5 rounded-bl-full -z-0"></div>

        {message.text && (
          <div className={`p-4 mb-8 rounded-2xl flex items-center gap-3 relative z-10 ${
            message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 
            message.type === 'error' ? 'bg-danger/10 text-danger border border-danger/20' : 
            'bg-info/10 text-info border border-info/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Địa chỉ Email
            </label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed outline-none" 
            />
            <span className="text-xs text-slate-400 ml-1">Email dùng để đăng nhập không thể thay đổi.</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-accentPrimary" /> Họ và Tên
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 focus:border-accentPrimary focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accentPrimary" /> Mật khẩu mới
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 focus:border-accentPrimary focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all" 
              placeholder="••••••••" 
            />
            <span className="text-xs text-slate-400 ml-1">Để trống nếu bạn không muốn thay đổi mật khẩu.</span>
          </div>
          
          <div className="pt-6 mt-2 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-accentPrimary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accentPrimary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin text-white">⌛</span> Đang lưu...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Lưu thay đổi</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
