import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Compass, Clock, GraduationCap, Code2, Database, LayoutTemplate, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

function Goals() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState({
    title: user?.goal?.title || '',
    career: user?.goal?.career || 'frontend',
    level: user?.goal?.level || 'beginner',
    time: user?.goal?.time || '1'
  });
  
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
    { id: 'frontend', icon: <LayoutTemplate />, title: 'Frontend Developer', desc: 'React, Vue, HTML/CSS' },
    { id: 'backend', icon: <Database />, title: 'Backend Developer', desc: 'NodeJS, Python, Java' },
    { id: 'fullstack', icon: <Code2 />, title: 'Fullstack Developer', desc: 'Cả Frontend & Backend' },
    { id: 'data', icon: <Briefcase />, title: 'Data Scientist', desc: 'Phân tích & Xử lý dữ liệu' },
  ];

  const levelOptions = [
    { id: 'beginner', title: 'Người mới bắt đầu', desc: 'Chưa biết gì về lập trình' },
    { id: 'intermediate', title: 'Cơ bản', desc: 'Đã biết lập trình cơ bản' },
    { id: 'advanced', title: 'Nâng cao', desc: 'Muốn học chuyên sâu' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 mb-6 shadow-sm">
          <Target className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">Định vị & Mục tiêu</h2>
        <p className="text-slate-500 max-w-xl mx-auto">EduAI sẽ phân tích mục tiêu của bạn để tạo ra một lộ trình học tập cá nhân hóa hoàn toàn phù hợp với năng lực và thời gian biểu của bạn.</p>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        {/* Goal Title */}
        <div className="mb-10">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-accentPrimary" /> Mục tiêu cụ thể
          </label>
          <input 
            type="text" 
            value={goal.title} 
            onChange={e => setGoal({...goal, title: e.target.value})} 
            required 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-700 focus:border-accentPrimary focus:bg-white focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all duration-300 text-lg" 
            placeholder="Ví dụ: Trở thành Frontend Dev trong 6 tháng..." 
          />
        </div>

        {/* Career Choice */}
        <div className="mb-10">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-accentPrimary" /> Định hướng nghề nghiệp
          </label>
          <input 
            type="text" 
            value={goal.career} 
            onChange={e => setGoal({...goal, career: e.target.value})} 
            required 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-700 focus:border-accentPrimary focus:bg-white focus:ring-4 focus:ring-accentPrimary/10 outline-none transition-all duration-300 text-lg mb-4" 
            placeholder="Ví dụ: Thiết kế đồ họa, Kỹ sư AI, Chuyên gia an ninh mạng..." 
          />
          <div className="flex flex-wrap gap-2">
            {['Frontend Developer', 'Backend Developer', 'Fullstack', 'Data Analyst', 'AI/ML Engineer', 'DevOps', 'Mobile App'].map(chip => (
              <span 
                key={chip} 
                onClick={() => setGoal({...goal, career: chip})}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm font-medium cursor-pointer transition-colors"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Level Choice */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-accentPrimary" /> Trình độ hiện tại
            </label>
            <div className="flex flex-col gap-3">
              {levelOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => setGoal({...goal, level: option.id})}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${goal.level === option.id ? 'border-accentPrimary bg-accentPrimary/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className={`font-bold ${goal.level === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal.level === option.id ? 'border-accentPrimary' : 'border-slate-300'}`}>
                      {goal.level === option.id && <div className="w-2.5 h-2.5 bg-accentPrimary rounded-full"></div>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time Choice */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-accentPrimary" /> Thời gian học (Mỗi ngày)
            </label>
            <div className="flex flex-col gap-3">
              {[
                { id: '1', title: '1 - 2 giờ', desc: 'Phù hợp người đi làm, ít thời gian' },
                { id: '3', title: '3 - 4 giờ', desc: 'Cân bằng, tiến độ trung bình' },
                { id: '5', title: 'Trên 5 giờ', desc: 'Dành toàn thời gian, tiến độ nhanh' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => setGoal({...goal, time: option.id})}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${goal.time === option.id ? 'border-accentPrimary bg-accentPrimary/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className={`font-bold ${goal.time === option.id ? 'text-accentPrimary' : 'text-slate-700'}`}>{option.title}</h4>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal.time === option.id ? 'border-accentPrimary' : 'border-slate-300'}`}>
                      {goal.time === option.id && <div className="w-2.5 h-2.5 bg-accentPrimary rounded-full"></div>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-gradient-to-r from-accentPrimary to-accentSecondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-accentPrimary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
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
