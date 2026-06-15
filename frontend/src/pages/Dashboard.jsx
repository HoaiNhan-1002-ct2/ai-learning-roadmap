import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Target, Trophy, Clock, BrainCircuit, Flame, Lightbulb, Zap, BookOpen, Calendar, LayoutTemplate, Database, Code2, Briefcase, Settings, Smartphone, PenTool, Shield, Brain, Bell } from 'lucide-react';

function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications
  const notifications = [
    { id: 1, text: 'Bạn đã hoàn thành 50% lộ trình Frontend', time: '10 phút trước', read: false },
    { id: 2, text: 'Bài Quiz mới về React Hook đã sẵn sàng', time: '1 giờ trước', read: false },
    { id: 3, text: 'Nhắc nhở: Lịch học lúc 20:00 tối nay', time: '2 giờ trước', read: true }
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const careerOptions = [
    { id: 'Frontend Developer', icon: <LayoutTemplate className="w-5 h-5" />, title: 'Frontend Dev', desc: 'HTML, CSS, React, Vue', highlight: 'Xây dựng giao diện Web' },
    { id: 'Backend Developer', icon: <Database className="w-5 h-5" />, title: 'Backend Dev', desc: 'NodeJS, Python, Java', highlight: 'Xử lý logic, Server & Database' },
    { id: 'Fullstack', icon: <Code2 className="w-5 h-5" />, title: 'Fullstack Dev', desc: 'Frontend + Backend', highlight: 'Phát triển toàn diện ứng dụng' },
    { id: 'Data Analyst', icon: <Briefcase className="w-5 h-5" />, title: 'Data Analyst', desc: 'SQL, Python, PowerBI', highlight: 'Phân tích dữ liệu & Báo cáo' },
    { id: 'AI/ML Engineer', icon: <Brain className="w-5 h-5" />, title: 'AI/ML Engineer', desc: 'Machine Learning, Deep Learning', highlight: 'Phát triển AI & Mô hình dự đoán' },
    { id: 'DevOps', icon: <Settings className="w-5 h-5" />, title: 'DevOps', desc: 'Docker, K8s, CI/CD', highlight: 'Tự động hóa & Quản trị hệ thống' },
    { id: 'Mobile App', icon: <Smartphone className="w-5 h-5" />, title: 'Mobile App', desc: 'React Native, Flutter, Swift', highlight: 'Phát triển ứng dụng di động' },
    { id: 'UI/UX Design', icon: <PenTool className="w-5 h-5" />, title: 'UI/UX Design', desc: 'Figma, Adobe XD', highlight: 'Thiết kế trải nghiệm người dùng' },
    { id: 'Cyber Security', icon: <Shield className="w-5 h-5" />, title: 'Cyber Security', desc: 'Network, Pentest', highlight: 'Bảo vệ & An toàn thông tin' }
  ];
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

  const matchedCareer = careerOptions.find(c => c.id === user.goal?.career);

  // Compute current week's dates (Monday to Sunday)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      weekDates.push(dateStr);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  const loginHistory = user.loginHistory || [];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại, {user.name}! 👋</h2>
          <p className="text-slate-500 mt-2">Cùng tiếp tục hành trình học tập của bạn hôm nay nhé.</p>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-100 transition-colors relative"
          >
            <Bell className="w-6 h-6 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Thông báo</h3>
                <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">{unreadCount} mới</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-blue-50/30'}`}>
                    <p className={`text-sm ${notif.read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>{notif.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button className="text-sm text-violet-600 font-medium hover:text-violet-700 w-full py-1">Đánh dấu tất cả đã đọc</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Row 1: Hero Progress & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Hero Stats Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 rounded-[2.5rem] p-8 md:p-10 text-white shadow-[0_20px_50px_rgba(139,92,246,0.3)] relative overflow-hidden transition-transform hover:-translate-y-1 duration-500 group h-full flex flex-col justify-center">
          <div className="absolute top-[-50%] right-[-10%] w-[120%] h-[150%] bg-gradient-to-b from-white/20 to-transparent rounded-full blur-3xl group-hover:rotate-12 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-xl border border-white/30 shadow-sm">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Tiến độ tổng quan</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight drop-shadow-md">{user.progress || 0}% Hoàn thành</h3>
              <p className="text-white/90 max-w-md text-base md:text-lg font-medium drop-shadow-sm">Bạn đang đi đúng hướng! Hãy duy trì phong độ này để sớm đạt được mục tiêu {user.goal?.career || 'của mình'}.</p>
            </div>
            
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative animate-float">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                <span className="font-extrabold text-2xl md:text-3xl drop-shadow-md">{user.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Highlights */}
        <div className="glass-panel p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-slate-800">Mục tiêu của bạn</h3>
              {user.goal?.level && (
                <div className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] uppercase tracking-wider font-extrabold">
                  {user.goal.level === 'beginner' ? 'Người mới' : user.goal.level === 'intermediate' ? 'Cơ bản' : 'Nâng cao'}
                </div>
              )}
            </div>
            
            {user.goal ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-xl bg-accentPrimary/10 text-accentPrimary flex items-center justify-center shrink-0 shadow-sm">
                      {matchedCareer?.icon || <Target className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{matchedCareer?.title || user.goal.career}</p>
                     <p className="text-sm font-extrabold text-slate-800 leading-tight line-clamp-2">{user.goal.title}</p>
                   </div>
                </div>
                
                {matchedCareer && (
                  <div className="mt-1 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-start gap-2 mb-2">
                       <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 leading-none">Điểm nổi bật</p>
                         <p className="text-xs text-slate-700 font-bold leading-tight">{matchedCareer.highlight}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-2">
                       <Code2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 leading-none">Công nghệ</p>
                         <p className="text-xs text-slate-700 font-bold leading-tight">{matchedCareer.desc}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 italic text-xs">Chưa thiết lập mục tiêu.</p>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Bài Quiz đã làm</p>
            </div>
            <p className="text-base font-extrabold text-indigo-700">{user.quizzesTaken || 0}</p>
          </div>
        </div>
      </div>

      {/* Row 2: Next Task & Help */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Next Task Reminder */}
        <div className="lg:col-span-2">
          <div 
            className="h-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-8 border border-indigo-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            onClick={() => navigate('/roadmap')}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between mb-2 relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
                <Target className="w-6 h-6 text-indigo-600" />
                Nhiệm vụ tiếp theo
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Lịch học: 20:00 Hôm nay
              </span>
            </div>
            
            <div className="flex items-center gap-6 mt-6 relative z-10">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {user.tasks && user.tasks.length > 0 && !user.tasks[0].completed 
                    ? user.tasks[0].name 
                    : "Tiếp tục học lộ trình DevOps của bạn"}
                </h4>
                <p className="text-slate-600 mb-6 line-clamp-2">
                  Hãy dành khoảng 30 phút để hoàn thành nhiệm vụ này và tiếp tục tiến gần hơn đến mục tiêu của bạn. Cố lên nhé!
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); navigate('/roadmap'); }}
                  >
                    Bắt đầu học ngay
                  </button>
                  <button 
                    className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); navigate('/quiz'); }}
                  >
                    Làm bài Test
                  </button>
                </div>
              </div>
              
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 hidden sm:block">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" 
                  alt="Chibi Student" 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action: Chatbot */}
        <div className="lg:col-span-1">
          <div className="h-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-[2.5rem] p-8 text-white shadow-[0_8px_30px_rgba(168,85,247,0.4)] relative overflow-hidden cursor-pointer hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-center" onClick={() => navigate('/chatbot')}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700"></div>
             <h3 className="font-bold text-xl mb-3 relative z-10">Cần trợ giúp?</h3>
             <p className="text-indigo-100 text-base mb-6 relative z-10 leading-relaxed">Chat ngay với EduAI để được giải đáp thắc mắc lập trình của bạn.</p>
             <button className="bg-white text-accentPrimary px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-fit relative z-10 flex items-center gap-2">
                Hỏi EduAI <Zap className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Row 3: Utilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Utility 1: Daily Streak */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Chuỗi học tập
            </h3>
            <span className="text-2xl font-extrabold text-orange-500">{user.streakCount || 0} Ngày</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Bạn đang giữ chuỗi học tập rất tốt! Đừng để đứt đoạn nhé.</p>
          <div className="flex gap-2 justify-between mt-auto">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => {
              const isActive = loginHistory.includes(weekDates[i]);
              return (
              <div key={day} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${isActive ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                {day}
              </div>
            )})}
          </div>
        </div>

        {/* Utility 2: Tip of the day */}
        <div className="glass-panel p-6 md:p-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-orange-100/50 relative overflow-hidden flex flex-col justify-center">
          <Lightbulb className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/10 rotate-12" />
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 relative z-10">
            <Zap className="w-5 h-5 text-amber-500" />
            Mẹo học tập
          </h3>
          <p className="text-slate-700 text-base font-medium leading-relaxed relative z-10 mb-2">
            "Chia nhỏ quá trình học thành các phiên 25 phút (Pomodoro) sẽ giúp bạn tăng khả năng tập trung và ghi nhớ lâu hơn so với việc học liên tục nhiều giờ liền."
          </p>
          <button className="mt-4 text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors relative z-10 w-fit" onClick={() => navigate('/chatbot')}>
            Hỏi thêm mẹo khác <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
