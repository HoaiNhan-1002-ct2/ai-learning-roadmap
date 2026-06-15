import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Target, Activity, Zap, TrendingUp, Clock, AlertTriangle, ShieldCheck, Info, Sparkles, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalQuizzes: 0, avgProgress: 0 });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const quizLogs = logs.filter(log => log.message && log.message.includes('hoàn thành bài AI Quiz'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/logs')
        ]);
        
        const fetchedUsers = usersRes.data.users || [];
        setUsers(fetchedUsers);
        setLogs(logsRes.data.logs || []);
        
        const totalQuizzes = fetchedUsers.reduce((sum, u) => sum + (u.quizzesTaken || 0), 0);
        const totalProgress = fetchedUsers.reduce((sum, u) => sum + (u.progress || 0), 0);
        const avgProgress = fetchedUsers.length > 0 ? Math.round(totalProgress / fetchedUsers.length) : 0;

        setStats({
          totalUsers: fetchedUsers.length,
          totalQuizzes,
          avgProgress
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
    </div>
  );

  // Data cho biểu đồ phân bố tiến độ
  const progressData = [
    { name: '0-25%', count: users.filter(u => u.progress <= 25).length },
    { name: '26-75%', count: users.filter(u => u.progress > 25 && u.progress <= 75).length },
    { name: '76-100%', count: users.filter(u => u.progress > 75).length },
  ];

  // Data cho biểu đồ lựa chọn ngành nghề
  const careerCounts = {};
  users.forEach(u => {
    const career = u.goal?.career || 'Chưa chọn';
    careerCounts[career] = (careerCounts[career] || 0) + 1;
  });
  const careerData = Object.keys(careerCounts).map(key => ({
    name: key,
    value: careerCounts[key]
  }));
  const PIE_COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#64748b'];

  const getLogIcon = (level) => {
    switch(level) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'warning': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const recentLogs = logs.slice(0, 5);
  const newestUsers = [...users].reverse().slice(0, 5);

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
            Tổng Quan Hệ Thống
          </h2>
          <p className="text-slate-400 mt-2">Theo dõi các chỉ số hoạt động chung của ứng dụng EduAI.</p>
        </div>
      </header>

      {/* Row 1: Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => navigate('/admin/users')}
          className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-colors cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Tổng người dùng</h3>
          </div>
          <p className="text-4xl font-extrabold text-white relative z-10">{stats.totalUsers}</p>
        </div>

        <div 
          onClick={() => setShowQuizModal(true)}
          className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-colors cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Bài Quiz đã làm</h3>
          </div>
          <p className="text-4xl font-extrabold text-white relative z-10">{stats.totalQuizzes}</p>
        </div>

        <div 
          onClick={() => navigate('/admin/users')}
          className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Tiến độ trung bình</h3>
          </div>
          <p className="text-4xl font-extrabold text-white relative z-10">{stats.avgProgress}%</p>
        </div>
      </div>

      {/* Row 2: Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-fuchsia-400" />
            Phân bố Tiến độ
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip cursor={{fill: '#334155'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Số lượng user" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-400" />
            Lựa chọn Ngành nghề
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={careerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {careerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Logs và Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Hoạt động gần đây
            </h3>
            <button 
              onClick={() => navigate('/admin/logs')}
              className="text-sm text-violet-400 hover:text-violet-300 font-medium"
            >
              Xem tất cả
            </button>
          </div>
          
          <div className="space-y-4">
            {recentLogs.length > 0 ? recentLogs.map(log => (
              <div key={log.id} className="flex gap-4 items-start p-3 hover:bg-slate-700/30 rounded-xl transition-colors">
                <div className="mt-1">{getLogIcon(log.level)}</div>
                <div>
                  <p className="text-slate-300 text-sm font-medium">{log.message}</p>
                  <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm italic py-4 text-center">Chưa có hoạt động nào</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Người dùng mới
            </h3>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-sm text-violet-400 hover:text-violet-300 font-medium"
            >
              Quản lý
            </button>
          </div>

          <div className="space-y-4">
            {newestUsers.length > 0 ? newestUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-slate-200 text-sm font-bold truncate">{user.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user.role}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm italic py-4 text-center">Chưa có người dùng</p>
            )}
          </div>
        </div>
      </div>
      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQuizModal(false)}>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400" />
                Chi tiết Bài Quiz đã làm
              </h3>
              <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-white text-xl">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {quizLogs.length > 0 ? quizLogs.map(log => (
                <div key={log.id} className="bg-slate-700/30 border border-slate-600/50 p-4 rounded-xl flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm leading-relaxed font-medium">
                      {log.message}
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-500 py-10 italic">Chưa có ai làm bài Quiz nào.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
