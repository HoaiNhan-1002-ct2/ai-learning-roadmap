import React, { useState } from 'react';
import { BrainCircuit, Sparkles, CheckCircle2, ChevronRight, RotateCcw, Award } from 'lucide-react';
import api from '../services/api';

function Quiz() {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const career = user?.goal?.career || 'công nghệ thông tin';
      const userId = user?.id || 'anonymous';
      const response = await api.get(`/quizzes/${userId}?career=${encodeURIComponent(career)}`, {
        headers: {
          'x-user-id': String(userId)
        }
      });
      setQuizData({ questions: response.data.questions });
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

  const handleSubmit = () => {
    if (Object.keys(answers).length < quizData.questions.length) {
      alert("Vui lòng trả lời tất cả các câu hỏi!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 mb-6 shadow-sm">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">AI Quiz & Đánh giá</h2>
        <p className="text-slate-500 max-w-xl mx-auto">Kiểm tra kiến thức của bạn. AI sẽ sinh ra các câu hỏi trắc nghiệm bám sát theo tiến độ lộ trình học tập hiện tại.</p>
      </header>

      {!quizData ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 mx-auto relative">
            <div className="absolute inset-0 bg-accentPrimary/10 rounded-full animate-ping"></div>
            <Sparkles className="w-10 h-10 text-accentPrimary relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Sẵn sàng thử thách?</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Hệ thống sẽ tổng hợp kiến thức từ các bài học gần nhất để tạo ra một bài kiểm tra ngắn dành riêng cho bạn.</p>
          <button 
            onClick={generateQuiz} 
            disabled={loading}
            className="bg-gradient-to-r from-accentPrimary to-accentSecondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-accentPrimary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <><span className="animate-spin text-white">⌛</span> Đang khởi tạo bài test...</>
            ) : (
              <><BrainCircuit className="w-5 h-5" /> Bắt đầu AI Quiz</>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative">
          
          {submitted && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 mb-4 text-white shadow-xl shadow-emerald-500/20 text-center animate-in zoom-in-95 duration-500">
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

          {quizData.questions.map((q, i) => (
            <div key={q.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
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
            </div>
          ))}

          {!submitted && (
            <div className="sticky bottom-8 mt-4 self-end z-20">
              <button 
                onClick={handleSubmit}
                className="bg-accentPrimary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accentPrimary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
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
