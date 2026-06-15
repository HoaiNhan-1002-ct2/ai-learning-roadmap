import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Map, Clock, CheckCircle2, Circle, Trophy, Layers, ChevronDown, ChevronUp, BookOpen, Link as LinkIcon, Loader2, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function Roadmap() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStages, setExpandedStages] = useState({});
  const [taskResources, setTaskResources] = useState({});
  const [loadingResources, setLoadingResources] = useState({});
  const [taskLessons, setTaskLessons] = useState({});
  const [loadingLessons, setLoadingLessons] = useState({});
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completedStageName, setCompletedStageName] = useState("");
  const navigate = useNavigate();

  const fetchResources = async (e, taskId, taskName) => {
    e.stopPropagation();
    if (taskResources[taskId] || loadingResources[taskId]) return;
    
    setLoadingResources(prev => ({ ...prev, [taskId]: true }));
    try {
      const res = await api.get(`/roadmap/resources?taskName=${encodeURIComponent(taskName)}`);
      setTaskResources(prev => ({ ...prev, [taskId]: res.data.resources }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResources(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const fetchLesson = async (e, taskId, taskName) => {
    e.stopPropagation();
    // Toggle off if already open
    if (taskLessons[taskId]) {
      setTaskLessons(prev => {
        const newLessons = { ...prev };
        delete newLessons[taskId];
        return newLessons;
      });
      return;
    }

    if (loadingLessons[taskId]) return;
    
    setLoadingLessons(prev => ({ ...prev, [taskId]: true }));
    try {
      const res = await api.get(`/roadmap/lesson?taskName=${encodeURIComponent(taskName)}`);
      setTaskLessons(prev => ({ ...prev, [taskId]: res.data.lesson }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLessons(prev => ({ ...prev, [taskId]: false }));
    }
  };

  useEffect(() => {
    if (!user || !user.goal) {
      setLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const res = await api.get(`/roadmap/custom/${user.id}`);
        setRoadmap(res.data.template);
        // By default, expand the first uncompleted stage, or all if preferred
        const initialExpanded = {};
        res.data.template.stages.forEach((stage, idx) => {
          initialExpanded[idx] = true; // Let's just expand all by default for visibility, or only the first
        });
        setExpandedStages(initialExpanded);
      } catch (err) {
        console.error("Failed to load roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user]);

  const toggleTask = async (taskId) => {
    try {
      const res = await api.post(`/users/${user.id}/tasks/toggle`, { taskId });
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (roadmap) {
         for (const stage of roadmap.stages) {
            const hasTask = stage.tasks.some(t => t.id === taskId);
            if (hasTask) {
               const stageCompletedBefore = stage.tasks.every(t => user.tasks?.find(ut => ut.id === t.id)?.completed);
               const stageCompletedAfter = stage.tasks.every(t => updatedUser.tasks?.find(ut => ut.id === t.id)?.completed);
               if (!stageCompletedBefore && stageCompletedAfter) {
                  setCompletedStageName(stage.title);
                  setShowCompletionPopup(true);
               }
               break;
            }
         }
      }
      
      setUser(updatedUser);
    } catch (err) {
      alert("Lỗi khi cập nhật tiến độ!");
    }
  };

  const toggleStage = (idx) => {
    setExpandedStages(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentPrimary"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6">
        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-4 shadow-[0_8px_20px_rgba(236,72,153,0.3)] animate-float">
            <Map className="w-7 h-7" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Lộ trình học tập</h2>
          <p className="text-slate-500 mt-2 text-base">Mục tiêu: <span className="font-bold text-violet-600 px-3 py-1 bg-violet-50 rounded-full">{user?.goal?.title || 'Chưa xác định'}</span></p>
        </div>
        
        {roadmap && (
          <div className="flex items-center gap-6 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Thời gian</p>
              <p className="font-bold text-slate-700 flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4 text-accentPrimary" /> {roadmap.duration}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tiến độ</p>
              <p className="font-bold text-success text-sm">{user?.progress || 0}%</p>
            </div>
          </div>
        )}
      </header>
      
      {!user?.goal ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Layers className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có lộ trình nào</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Hãy thiết lập mục tiêu để AI có thể sinh ra lộ trình phù hợp với bạn nhé!</p>
          <button onClick={() => navigate('/goals')} className="btn-primary">
            Thiết lập Mục tiêu
          </button>
        </div>
      ) : !roadmap ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <Circle className="w-5 h-5" /> Không thể tải lộ trình từ hệ thống. Vui lòng thử lại sau.
        </div>
      ) : (
        <div className="relative pl-4 md:pl-8">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-12 top-4 bottom-8 w-0.5 bg-slate-200 rounded-full"></div>
          
          <div className="flex flex-col gap-6 relative z-10">
            {roadmap.stages.map((stage, idx) => {
              const allCompleted = stage.tasks.every(t => user.tasks?.find(ut => ut.id === t.id)?.completed);
              const completedTasksCount = stage.tasks.filter(t => user.tasks?.find(ut => ut.id === t.id)?.completed).length;
              const isExpanded = expandedStages[idx];
              
              return (
                <div key={idx} className="relative flex items-start gap-4 md:gap-6">
                  
                  {/* Timeline Node */}
                  <div className="relative z-20 mt-1 shrink-0">
                    <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-all duration-500 ${allCompleted ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/30' : isExpanded ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-pink-500/30 animate-pulse-slow' : 'bg-slate-200 text-slate-500'}`}>
                      {allCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-sm">{idx + 1}</span>}
                    </div>
                  </div>

                  {/* Stage Card */}
                  <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5">
                    {/* Header / Accordion Trigger */}
                    <div 
                      className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleStage(idx)}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base md:text-lg font-bold text-slate-800">{stage.title}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{stage.duration}</span>
                        </div>
                        <p className="text-sm text-slate-500">Hoàn thành {completedTasksCount}/{stage.tasks.length} nhiệm vụ</p>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                    
                    {/* Expanded Tasks */}
                    {isExpanded && (
                      <div className="px-4 pb-4 md:px-5 md:pb-5 border-t border-slate-50 pt-4 bg-slate-50/50">
                        <div className="flex flex-col gap-2.5">
                          {stage.tasks.map(task => {
                            const isCompleted = user.tasks?.find(ut => ut.id === task.id)?.completed;
                            return (
                              <div key={task.id} className="flex flex-col gap-2">
                                <div 
                                  onClick={() => toggleTask(task.id)}
                                  className={`group flex items-start md:items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isCompleted ? 'bg-white border-success/20 shadow-sm' : 'bg-white border-slate-200 hover:border-accentPrimary/40 hover:shadow-sm'}`}
                                >
                                  <div className={`shrink-0 mt-0.5 md:mt-0 transition-colors ${isCompleted ? 'text-success' : 'text-slate-300 group-hover:text-accentPrimary'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                  </div>
                                  <span className={`text-sm font-medium flex-1 ${isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}>{task.name}</span>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={(e) => fetchLesson(e, task.id, task.name)}
                                      disabled={loadingLessons[task.id]}
                                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-600 hover:bg-pink-500 hover:text-white transition-colors"
                                    >
                                      {loadingLessons[task.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GraduationCap className="w-3.5 h-3.5" />}
                                      <span>{taskLessons[task.id] ? 'Đóng bài học' : 'Học ngay (AI)'}</span>
                                    </button>
                                    <button 
                                      onClick={(e) => fetchResources(e, task.id, task.name)}
                                      disabled={loadingResources[task.id]}
                                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-accentPrimary/10 text-accentPrimary hover:bg-accentPrimary hover:text-white transition-colors"
                                    >
                                      {loadingResources[task.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5" />}
                                      <span>Tài liệu tham khảo</span>
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Render AI Lesson */}
                                {taskLessons[task.id] && (
                                  <div className="ml-11 mr-2 p-5 md:p-8 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-inner animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full"></div>
                                    <div className="relative z-10 prose prose-slate prose-headings:text-slate-800 prose-a:text-pink-600 hover:prose-a:text-pink-500 prose-strong:text-slate-700 max-w-none text-sm md:text-base">
                                      <ReactMarkdown>{taskLessons[task.id]}</ReactMarkdown>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Render Resources */}
                                {taskResources[task.id] && (
                                  <div className="ml-11 mr-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tài liệu gợi ý từ AI</p>
                                    {Array.isArray(taskResources[task.id]) ? taskResources[task.id].map((res, i) => (
                                      <a 
                                        key={i} 
                                        href={res.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-start gap-2 text-sm text-slate-600 hover:text-accentPrimary transition-colors group/link p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50"
                                      >
                                        <LinkIcon className="w-4 h-4 mt-0.5 shrink-0 opacity-50 group-hover/link:opacity-100" />
                                        <div className="flex flex-col">
                                          <span className="font-medium line-clamp-1">{res.title}</span>
                                          <span className="text-[11px] text-slate-400">{res.type}</span>
                                        </div>
                                      </a>
                                    )) : <p className="text-sm text-red-500">Lỗi: Định dạng dữ liệu không hợp lệ từ AI.</p>}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Timeline End Node */}
          <div className="relative flex items-center gap-6 mt-6">
            <div className="relative z-20 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-sm border-4 border-white">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Hoàn thành mục tiêu</h4>
          </div>
        </div>
      )}

      {/* Completion Popup */}
      {showCompletionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">Chúc mừng! 🎉</h3>
            <p className="text-center text-slate-500 mb-8">
              Bạn đã hoàn thành {completedStageName ? `giai đoạn "${completedStageName}"` : "các nhiệm vụ"}. Hãy làm một bài test nhỏ để củng cố kiến thức nhé!
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCompletionPopup(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Để sau
              </button>
              <button 
                onClick={() => {
                  setShowCompletionPopup(false);
                  navigate('/quiz');
                }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-accentPrimary hover:bg-accentPrimary/90 transition-colors shadow-lg shadow-accentPrimary/30"
              >
                Làm Quiz ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roadmap;
