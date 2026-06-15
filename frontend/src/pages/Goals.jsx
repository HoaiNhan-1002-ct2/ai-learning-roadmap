import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Compass, Clock, GraduationCap, Code2, Database, LayoutTemplate, Briefcase, ChevronRight, Loader2, Brain, Flag, ListPlus, X, Settings, Smartphone, PenTool, Shield } from 'lucide-react';

function Goals() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState({
    title: user?.goal?.title || '',
    career: user?.goal?.career || 'frontend',
    level: user?.goal?.level || 'beginner',
    time: user?.goal?.time || '1',
    learningStyle: user?.goal?.learningStyle || 'hands-on',
    primaryPurpose: user?.goal?.primaryPurpose || 'job',
    extraSkills: user?.goal?.extraSkills || []
  });
  
  const [skillInput, setSkillInput] = useState('');
  
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !goal.extraSkills.includes(val)) {
        setGoal({ ...goal, extraSkills: [...goal.extraSkills, val] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (indexToRemove) => {
    setGoal({
      ...goal,
      extraSkills: goal.extraSkills.filter((_, index) => index !== indexToRemove)
    });
  };
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/users/${user.id}/goal`, goal);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
      // Simulate AI thinking
      setTimeout(() => {
        setLoading(false);
        navigate('/roadmap');
      }, 1500);
    } catch (err) {
      setLoading(false);
      alert('Lỗi: ' + (err.response?.data?.error || err.message));
    }
  };

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

  const levelOptions = [
    { id: 'beginner', title: 'Người mới bắt đầu', desc: 'Chưa biết gì về lập trình' },
    { id: 'intermediate', title: 'Cơ bản', desc: 'Đã biết lập trình cơ bản' },
    { id: 'advanced', title: 'Nâng cao', desc: 'Muốn học chuyên sâu' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-6 shadow-[0_8px_30px_rgba(236,72,153,0.4)] animate-float">
          <Target className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4 drop-shadow-sm">Định vị & Mục tiêu</h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">EduAI sẽ phân tích mục tiêu của bạn để tạo ra một lộ trình học tập cá nhân hóa hoàn toàn phù hợp với năng lực và thời gian biểu của bạn.</p>
      </header>
      
      <form onSubmit={handleSubmit} className="glass-panel p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* CỘT TRÁI */}
          <div className="flex flex-col gap-10">
            {/* Goal Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-accentPrimary" /> Mục tiêu cụ thể
              </label>
              <input 
                type="text" 
                value={goal.title} 
                onChange={e => setGoal({...goal, title: e.target.value})} 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:border-accentPrimary focus:bg-white focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all duration-300 text-lg" 
                placeholder="Ví dụ: Trở thành Frontend Dev trong 6 tháng..." 
              />
            </div>

            {/* Career Choice */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-accentPrimary" /> Định hướng nghề nghiệp
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent mb-4">
                {careerOptions.map(option => (
                  <div 
                    key={option.id} 
                    onClick={() => setGoal({...goal, career: option.id})}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-2 ${goal.career === option.id ? 'border-accentPrimary bg-accentPrimary/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${goal.career === option.id ? 'bg-accentPrimary text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                        {option.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${goal.career === option.id ? 'text-accentPrimary' : 'text-slate-800'}`}>{option.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{option.desc}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-medium p-2 rounded-lg flex gap-1.5 items-start ${goal.career === option.id ? 'bg-accentPrimary/10 text-accentPrimary' : 'bg-slate-100 text-slate-600'}`}>
                      <span className="text-accentPrimary shrink-0 mt-0.5">★</span> 
                      <span>{option.highlight}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={goal.career} 
                  onChange={e => setGoal({...goal, career: e.target.value})} 
                  required 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:border-accentPrimary focus:bg-white focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all duration-300 text-sm" 
                  placeholder="Hoặc nhập định hướng khác của bạn..." 
                />
              </div>
            </div>

            {/* Extra Skills / Desires */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                <ListPlus className="w-4 h-4 text-accentPrimary" /> Kỹ năng hoặc Mong muốn bổ sung
              </label>
              <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 flex flex-wrap gap-2 focus-within:border-accentPrimary focus-within:ring-4 focus-within:ring-accentPrimary/10 transition-all duration-300">
                {goal.extraSkills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-1 bg-accentPrimary/10 text-accentPrimary px-3 py-1.5 rounded-lg text-sm font-bold">
                    {skill}
                    <X className="w-4 h-4 cursor-pointer hover:text-accentSecondary" onClick={() => removeSkill(index)} />
                  </span>
                ))}
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={goal.extraSkills.length === 0 ? "Nhập kỹ năng và nhấn Enter..." : "Thêm kỹ năng khác..."}
                  className="flex-1 bg-transparent border-none outline-none min-w-[200px] text-slate-900 font-medium placeholder:text-slate-500 py-1"
                />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-2">Nhấn Enter hoặc dấu phẩy (,) để thêm</p>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="flex flex-col gap-8">
            
            {/* Level Choice */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-accentPrimary" /> Trình độ hiện tại
              </label>
              <div className="grid grid-cols-3 gap-3">
                {levelOptions.map(option => (
                  <button 
                    type="button"
                    key={option.id}
                    onClick={() => setGoal({...goal, level: option.id})}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${goal.level === option.id ? 'border-accentPrimary bg-accentPrimary/10' : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'}`}
                  >
                    <h4 className={`font-extrabold text-sm mb-1 ${goal.level === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <p className={`text-[10px] font-medium leading-tight ${goal.level === option.id ? 'text-accentPrimary/80' : 'text-slate-500'}`}>{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Choice */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-accentPrimary" /> Thời gian học
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1', title: '1 - 2 giờ', desc: 'Ít thời gian' },
                  { id: '3', title: '3 - 4 giờ', desc: 'Mức trung bình' },
                  { id: '5', title: 'Trên 5 giờ', desc: 'Toàn thời gian' }
                ].map(option => (
                  <button 
                    type="button"
                    key={option.id}
                    onClick={() => setGoal({...goal, time: option.id})}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${goal.time === option.id ? 'border-accentPrimary bg-accentPrimary/10' : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'}`}
                  >
                    <h4 className={`font-extrabold text-sm mb-1 ${goal.time === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <p className={`text-[10px] font-medium leading-tight ${goal.time === option.id ? 'text-accentPrimary/80' : 'text-slate-500'}`}>{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-accentPrimary" /> Phong cách học
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'hands-on', title: 'Thực hành', desc: 'Làm dự án thực tế' },
                  { id: 'theory', title: 'Lý thuyết', desc: 'Đọc tài liệu' },
                  { id: 'visual', title: 'Trực quan', desc: 'Học qua video' }
                ].map(option => (
                  <button 
                    type="button"
                    key={option.id}
                    onClick={() => setGoal({...goal, learningStyle: option.id})}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${goal.learningStyle === option.id ? 'border-accentPrimary bg-accentPrimary/10' : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'}`}
                  >
                    <h4 className={`font-extrabold text-sm mb-1 ${goal.learningStyle === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <p className={`text-[10px] font-medium leading-tight ${goal.learningStyle === option.id ? 'text-accentPrimary/80' : 'text-slate-500'}`}>{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Purpose */}
            <div>
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider">
                <Flag className="w-4 h-4 text-accentPrimary" /> Mục đích chính
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'job', title: 'Tìm việc', desc: 'Ứng tuyển Dev' },
                  { id: 'skill', title: 'Kỹ năng', desc: 'Phục vụ công việc' },
                  { id: 'hobby', title: 'Dự án', desc: 'Tự build app' }
                ].map(option => (
                  <button 
                    type="button"
                    key={option.id}
                    onClick={() => setGoal({...goal, primaryPurpose: option.id})}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${goal.primaryPurpose === option.id ? 'border-accentPrimary bg-accentPrimary/10' : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100'}`}
                  >
                    <h4 className={`font-extrabold text-sm mb-1 ${goal.primaryPurpose === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <p className={`text-[10px] font-medium leading-tight ${goal.primaryPurpose === option.id ? 'text-accentPrimary/80' : 'text-slate-500'}`}>{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary !px-10 !py-5 !rounded-2xl !text-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-[0_10px_30px_rgba(236,72,153,0.5)]"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Đang phân tích dữ liệu...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Phân tích & Sinh Lộ Trình AI <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Goals;
