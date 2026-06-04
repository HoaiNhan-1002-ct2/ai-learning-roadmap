import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Target, Trophy, Clock, BrainCircuit } from 'lucide-react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentPrimary"></div></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại, {user.name}! 👋</h2>
          <p className="text-slate-500 mt-2">Cùng tiếp tục hành trình học tập của bạn hôm nay nhé.</p>
        </div>
      </header>

      {/* Hero Stats Card */}
      <div className="bg-gradient-to-br from-accentPrimary/90 to-accentSecondary/90 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-accentPrimary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Tiến độ tổng quan</span>
            </div>
            <h3 className="text-4xl font-bold mb-2">{user.progress || 0}% Hoàn thành</h3>
            <p className="text-white/80 max-w-md">Bạn đang đi đúng hướng! Hãy duy trì phong độ này để sớm đạt được mục tiêu {user.goal?.career || 'của mình'}.</p>
          </div>
          
          <div className="w-32 h-32 shrink-0 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white drop-shadow-md"
                strokeDasharray={`${user.progress || 0}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
              {user.progress || 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Target className="w-6 h-6 text-accentPrimary" />
              Nhiệm vụ sắp tới
            </h3>
            <button className="text-sm font-medium text-accentPrimary hover:text-accentSecondary">Xem tất cả</button>
          </div>
          
          {user.tasks && user.tasks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {user.tasks.map(task => (
                <div key={task.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="shrink-0 text-slate-300 group-hover:text-accentPrimary transition-colors cursor-pointer">
                    {task.completed ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>{task.name}</h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> Hạn chót: Hôm nay
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${task.completed ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {task.completed ? 'Hoàn thành' : 'Đang xử lý'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <p>Bạn đã hoàn thành mọi nhiệm vụ! 🎉</p>
            </div>
          )}
        </div>

        {/* Quick Stats & Quick Actions */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Thống kê</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bài Quiz đã làm</p>
                  <p className="text-xl font-bold text-slate-800">{user.quizzesTaken || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mục tiêu hiện tại</p>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{user.goal ? user.goal.title : "Chưa thiết lập"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={() => navigate('/chatbot')}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/3"></div>
             <h3 className="font-bold text-lg mb-2 relative z-10">Cần trợ giúp?</h3>
             <p className="text-indigo-100 text-sm mb-4 relative z-10">Chat ngay với EduAI để được giải đáp thắc mắc lập trình.</p>
             <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm w-fit relative z-10">Hỏi EduAI</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
