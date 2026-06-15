import React, { useState, useRef } from 'react';
import api from '../services/api';
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, TrendingUp, Award, Target, Briefcase, Clock, Zap, Camera } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const fileInputRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Kích thước ảnh không được vượt quá 2MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Đang cập nhật...', type: 'info' });
    try {
      const res = await api.put(`/users/${user.id}/profile`, { name, avatar, bio, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      window.dispatchEvent(new Event('userUpdated'));
      setMessage({ text: 'Cập nhật thành công!', type: 'success' });
      setPassword('');
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Lỗi cập nhật', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-6 shadow-[0_8px_30px_rgba(236,72,153,0.4)] border-4 border-white/50 animate-float relative bg-cover bg-center cursor-pointer group" 
          style={{ backgroundImage: avatar ? `url(${avatar})` : 'none' }}
          onClick={() => fileInputRef.current?.click()}
          title="Nhấn để thay đổi ảnh đại diện"
        >
          {!avatar && <User className="w-12 h-12" />}
          
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white/90 drop-shadow-md" />
          </div>

          {user?.role === 'admin' && (
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
              ADMIN
            </div>
          )}
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-3 drop-shadow-sm">Hồ sơ cá nhân</h2>
        <p className="text-slate-500 text-lg">Quản lý thông tin bảo mật và tài khoản của bạn</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thống kê & Thông tin */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Thống kê học tập */}
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-success/5 to-info/5 rounded-bl-full -z-0"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 relative z-10 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accentPrimary" />
              Thống kê học tập
            </h3>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 text-success rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Tiến độ</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{user?.progress || 0}%</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/10 text-info rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Quiz đã làm</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{user?.quizzesTaken || 0}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 text-warning rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Nhiệm vụ</span>
                </div>
                <span className="text-lg font-bold text-slate-800">
                  {user?.tasks?.filter(t => t.completed).length || 0} / {user?.tasks?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Mục tiêu hiện tại */}
          {user?.goal && (
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning/5 to-danger/5 rounded-bl-full -z-0"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 relative z-10 flex items-center gap-2">
                <Target className="w-5 h-5 text-warning" />
                Mục tiêu hiện tại
              </h3>
              <div className="flex flex-col gap-3 relative z-10 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <span className="font-medium text-slate-800">{user.goal.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Ngành: <span className="font-medium text-slate-800">{user.goal.career}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Trình độ: <span className="font-medium text-slate-800">{user.goal.level}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Thời gian học: <span className="font-medium text-slate-800">{user.goal.time}</span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: Form cập nhật */}
        <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden h-fit">
        
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
              <Briefcase className="w-4 h-4 text-accentPrimary" /> Giới thiệu bản thân
            </label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              rows="3"
              placeholder="Chia sẻ một chút về bản thân..."
              className="bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 focus:border-accentPrimary focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all resize-none" 
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
          
          <div className="pt-6 mt-2 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="animate-spin text-white">⌛</span> Đang lưu...</>
              ) : (
                <><ShieldCheck className="w-6 h-6" /> Lưu thay đổi</>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Profile;
