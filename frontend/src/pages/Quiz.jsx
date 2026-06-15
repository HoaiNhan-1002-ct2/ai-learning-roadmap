import React, { useState } from 'react';
import { BrainCircuit, Sparkles, CheckCircle2, ChevronRight, RotateCcw, Award, Target, Zap, Rocket, Shield, Crown } from 'lucide-react';
import api from '../services/api';

function Quiz() {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const stages = {};
  if (user?.tasks) {
    user.tasks.forEach(task => {
      if (!stages[task.stage]) {
        stages[task.stage] = { stage: task.stage, tasks: [] };
      }
      stages[task.stage].tasks.push(task.name);
    });
  }
  const stageList = Object.values(stages).sort((a, b) => a.stage - b.stage);

  const getStageStyle = (index) => {
    const styles = [
      { bg: 'bg-blue-500/10', text: 'text-blue-600', gradient: 'from-blue-600 to-cyan-500', icon: Target },
      { bg: 'bg-violet-500/10', text: 'text-violet-600', gradient: 'from-violet-600 to-fuchsia-500', icon: Zap },
      { bg: 'bg-emerald-500/10', text: 'text-emerald-600', gradient: 'from-emerald-600 to-teal-500', icon: Rocket },
      { bg: 'bg-amber-500/10', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-500', icon: Crown },
      { bg: 'bg-rose-500/10', text: 'text-rose-600', gradient: 'from-rose-600 to-pink-500', icon: Shield }
    ];
    return styles[index % styles.length];
  };

  const generateQuiz = async (topic = null) => {
    setLoading(true);
    try {
      const career = user?.goal?.career || 'công nghệ thông tin';
      const userId = user?.id || 'anonymous';
      let url = `/quizzes/${userId}?career=${encodeURIComponent(career)}`;
      if (topic) {
        url += `&topic=${encodeURIComponent(topic)}`;
      }
      const response = await api.get(url, {
        headers: {
          'x-user-id': String(userId)
        }
      });
      setQuizData({ questions: response.data.questions, topic });
    } catch (err) {
      console.error(err);
      alert('Không thể tạo bài Quiz. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId, optionIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quizData.questions.length) {
      alert("Vui lòng trả lời tất cả các câu hỏi!");
      return;
    }
    
    const score = calculateScore();
    const total = quizData.questions.length;
    const ratio = Math.round((score / total) * 100);
    let evaluation = "Trung bình";
    if (ratio >= 80) evaluation = "Xuất sắc";
    else if (ratio >= 60) evaluation = "Khá";
    
    try {
      const res = await api.post(`/quizzes/${user.id}/submit`, {
        score,
        total,
        ratio,
        evaluation
      }, {
        headers: { 'x-user-id': String(user.id) }
      });
      
      // Update user in localStorage
      if (res.data && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Lỗi khi lưu kết quả quiz:", err);
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-6 shadow-[0_8px_30px_rgba(236,72,153,0.4)] animate-float">
          <BrainCircuit className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4 drop-shadow-sm">AI Quiz & Đánh giá</h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Kiểm tra kiến thức của bạn. AI sẽ sinh ra các câu hỏi trắc nghiệm bám sát theo tiến độ lộ trình học tập hiện tại.</p>
      </header>

      {!quizData ? (
        <div className="flex flex-col gap-10">
          <div className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 text-center shadow-2xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-pink-600/20 to-orange-500/20"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/30 blur-[100px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/30 blur-[100px] rounded-full mix-blend-screen"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                <Award className="w-12 h-12 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-white drop-shadow-md">Bài test Tổng hợp (20 câu)</h3>
              <p className="text-slate-300 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Kiểm tra toàn diện kiến thức của bạn trong lĩnh vực hiện tại. AI sẽ tổng hợp và sinh ra một bài test ngẫu nhiên đầy thử thách.
              </p>
              <button 
                onClick={() => generateQuiz()} 
                disabled={loading}
                className="bg-white text-slate-900 hover:bg-slate-50 font-bold py-4 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                {loading ? (
                  <><span className="animate-spin text-slate-900">⌛</span> Đang khởi tạo...</>
                ) : (
                  <><BrainCircuit className="w-6 h-6 text-violet-600" /> Bắt đầu Thử Thách Ngay</>
                )}
              </button>
            </div>
          </div>

          {stageList.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6 px-2">
                <Target className="w-6 h-6 text-slate-700" />
                <h3 className="text-2xl font-bold text-slate-800">Kiểm tra theo từng giai đoạn</h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {stageList.map((stageInfo, idx) => {
                  const topicString = stageInfo.tasks.join(', ');
                  const style = getStageStyle(idx);
                  const Icon = style.icon;
                  
                  return (
                    <div key={stageInfo.stage} className="relative overflow-hidden bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 group">
                      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${style.gradient} opacity-[0.03] rounded-bl-[100px] transition-opacity group-hover:opacity-[0.06]`}></div>
                      
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${style.gradient} shadow-lg shrink-0 text-white`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${style.bg} ${style.text}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            Giai đoạn {stageInfo.stage}
                          </div>
                          <h4 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Bài test tổng hợp: Giai đoạn {stageInfo.stage}</h4>
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                            <span className="font-semibold text-slate-600">Nội dung ôn tập: </span>
                            {topicString}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => generateQuiz(`Giai đoạn ${stageInfo.stage}: ${topicString}`)} 
                          disabled={loading}
                          className={`shrink-0 bg-gradient-to-r ${style.gradient} text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 hover:shadow-lg w-full md:w-auto justify-center`}
                        >
                          <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                          Làm Test Này
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative">
                    {quizData.questions.map((q, i) => (
            <div key={q.id} className="glass-panel p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  {i + 1}
                </div>
                <h4 className="text-xl font-bold text-slate-800 pt-1 leading-snug">{q.text || q.question || q.q}</h4>
              </div>
              
              <div className="flex flex-col gap-3 pl-0 md:pl-14">
                {q.options.map((opt, j) => {
                  const isSelected = answers[q.id] === j;
                  let optionClass = "border-slate-200 hover:border-accentPrimary hover:bg-slate-50";
                  let textClass = "text-slate-700";
                  let circleClass = "border-slate-300";
                  
                  if (isSelected) {
                    optionClass = "border-accentPrimary bg-accentPrimary/5 shadow-sm";
                    circleClass = "border-accentPrimary bg-accentPrimary text-white";
                  }

                  if (submitted) {
                    if (j === q.correct) {
                      optionClass = "border-success bg-success/10 shadow-sm ring-2 ring-success/20";
                      textClass = "text-success font-bold";
                      circleClass = "border-success bg-success text-white";
                    } else if (isSelected && j !== q.correct) {
                      optionClass = "border-danger bg-danger/5 opacity-50";
                      textClass = "text-danger";
                      circleClass = "border-danger bg-danger text-white";
                    } else {
                      optionClass = "border-slate-100 opacity-50";
                    }
                  }

                  return (
                    <div 
                      key={j} 
                      onClick={() => handleSelect(q.id, j)}
                      className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${optionClass}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${circleClass}`}>
                        {submitted ? (
                          j === q.correct ? <CheckCircle2 className="w-4 h-4" /> : null
                        ) : (
                          isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-base flex-1 ${textClass}`}>{opt}</span>
                    </div>
                  );
                })}
              </div>
              
              {submitted && answers[q.id] !== q.correct && (
                <div className="mt-6 bg-amber-50 text-amber-800 p-5 rounded-2xl border border-amber-200 flex flex-col gap-2 animate-in slide-in-from-top-2 shadow-sm">
                  <span className="font-bold flex items-center gap-1.5 text-amber-700"><Sparkles className="w-5 h-5" /> Giải thích từ AI:</span>
                  <p className="text-sm leading-relaxed text-amber-900 bg-amber-100/50 p-4 rounded-xl">{q.explanation || "Đáp án bạn chọn chưa chính xác. Hãy xem lại kiến thức phần này nhé!"}</p>
                </div>
              )}
            </div>
          ))}

          {submitted && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 mt-4 mb-4 text-white shadow-xl shadow-emerald-500/20 text-center animate-in zoom-in-95 duration-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-3xl font-bold mb-2">Hoàn thành bài kiểm tra!</h3>
              <p className="text-emerald-50 text-lg mb-6">Bạn trả lời đúng {calculateScore()}/{quizData.questions.length} câu hỏi.</p>
              <button 
                onClick={() => { setQuizData(null); setSubmitted(false); setAnswers({}); }}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 mx-auto hover:bg-emerald-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5" /> Làm bài khác
              </button>
            </div>
          )}
          {!submitted && (
            <div className="sticky bottom-8 mt-4 self-end z-20">
              <button 
                onClick={handleSubmit}
                className="btn-primary !px-8 !py-4 !rounded-2xl"
              >
                Nộp bài Quiz <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
