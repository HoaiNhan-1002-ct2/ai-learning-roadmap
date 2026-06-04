import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Map, 
  BrainCircuit, 
  MessageSquareText, 
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  const getNavLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${
      isActive 
        ? 'bg-gradient-to-r from-accentPrimary/10 to-transparent text-accentPrimary shadow-sm border border-accentPrimary/20' 
        : 'text-textSecondary hover:bg-white/40 hover:text-textPrimary hover:shadow-sm border border-transparent'
    }`;

  return (
    <aside className="w-[280px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] p-6 flex flex-col h-full border-r border-borderGlass shrink-0 z-10 relative">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accentPrimary to-accentSecondary flex items-center justify-center text-white shadow-lg shadow-accentPrimary/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent font-display tracking-tight">EduAI</h1>
      </div>

      <div 
        className="flex items-center gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl mb-8 cursor-pointer hover:border-accentPrimary/30 hover:bg-white hover:shadow-md transition-all duration-300 group" 
        onClick={() => navigate('/profile')}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accentPrimary/20 to-accentSecondary/20 border-2 border-white shadow-sm flex items-center justify-center text-accentPrimary font-bold shrink-0 group-hover:scale-105 transition-transform">
          {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
        </div>
        <div className="overflow-hidden flex-1">
          <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-accentPrimary transition-colors">{user.name || 'Học viên'}</h4>
          <p className="text-xs text-slate-500 truncate">{user.email || 'user@example.com'}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink to="/dashboard" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accentPrimary rounded-r-full" />}
              <LayoutDashboard className={`w-5 h-5 ${isActive ? 'text-accentPrimary' : 'group-hover:text-accentPrimary'}`} />
              Tổng quan
            </>
          )}
        </NavLink>
        <NavLink to="/goals" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accentPrimary rounded-r-full" />}
              <Target className={`w-5 h-5 ${isActive ? 'text-accentPrimary' : 'group-hover:text-accentPrimary'}`} />
              Mục tiêu học tập
            </>
          )}
        </NavLink>
        <NavLink to="/roadmap" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accentPrimary rounded-r-full" />}
              <Map className={`w-5 h-5 ${isActive ? 'text-accentPrimary' : 'group-hover:text-accentPrimary'}`} />
              Lộ trình
            </>
          )}
        </NavLink>
        <NavLink to="/quiz" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accentPrimary rounded-r-full" />}
              <BrainCircuit className={`w-5 h-5 ${isActive ? 'text-accentPrimary' : 'group-hover:text-accentPrimary'}`} />
              AI Quiz
            </>
          )}
        </NavLink>
        <NavLink to="/chatbot" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accentPrimary rounded-r-full" />}
              <MessageSquareText className={`w-5 h-5 ${isActive ? 'text-accentPrimary' : 'group-hover:text-accentPrimary'}`} />
              Trợ lý AI
            </>
          )}
        </NavLink>
      </nav>

      <div className="pt-5 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
