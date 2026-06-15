import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Sparkles, Send, Bot, User as UserIcon, BookOpen, MessageSquareText, Search, Settings, PanelRightClose, Plus, MessageSquare, Paperclip } from 'lucide-react';

function Chatbot() {
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [aiModel, setAiModel] = useState('groq'); // Default to groq as requested
  
  const initialWelcomeMessage = { id: 1, role: 'ai', text: 'Chào bạn! Tôi là EduAI, trợ lý học tập cá nhân của bạn. Bạn đang gặp khó khăn gì trong lộ trình học tập, hay cần giải thích một khái niệm lập trình nào đó?' };
  
  const [messages, setMessages] = useState([initialWelcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Load sessions list on mount
  const loadSessions = () => {
    if (user?.id) {
      api.get(`/chatbot/sessions/${user.id}`)
        .then(res => setSessions(res.data.sessions || []))
        .catch(err => console.error("Failed to load chat sessions", err));
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user?.id]);

  // Load specific session
  const loadSessionMessages = (sessionId) => {
    setActiveSessionId(sessionId);
    api.get(`/chatbot/session/${sessionId}`)
      .then(res => {
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages([initialWelcomeMessage, ...res.data.messages]);
        } else {
          setMessages([initialWelcomeMessage]);
        }
      })
      .catch(err => console.error("Failed to load session messages", err));
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([initialWelcomeMessage]);
    setInput('');
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const questionText = input;
    const userMsg = { id: Date.now(), role: 'user', text: questionText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    try {
      const chatHistory = newMessages.map(m => ({
         role: m.role === 'ai' ? 'model' : 'user',
         parts: [{ text: m.text }]
      }));
      
      const res = await api.post('/chatbot', { 
        question: questionText, 
        history: chatHistory,
        userId: user?.id,
        sessionId: activeSessionId,
        aiModel: aiModel
      });

      if (res.data.sessionId && !activeSessionId) {
        setActiveSessionId(res.data.sessionId);
        loadSessions(); // Reload sidebar to show the new session
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: res.data.answer
      }]);
    } catch (err) {
      console.error("Lỗi khi gọi API Chatbot:", err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: 'Xin lỗi, đã có lỗi xảy ra khi kết nối hệ thống. Vui lòng thử lại sau.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row relative">
      
      {/* Sidebar - Sessions List */}
      <div className="w-full md:w-64 bg-white/40 border-r border-white/60 flex flex-col shrink-0 z-20">
        <div className="p-5 border-b border-white/40 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-violet-500" /> Lịch sử Chat
            </h2>
        </div>
        <div className="p-4">
            <button 
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-accentPrimary hover:bg-accentSecondary text-white rounded-xl transition-colors font-medium text-sm shadow-sm"
            >
                <Plus className="w-4 h-4" /> Cuộc trò chuyện mới
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sessions.map(session => (
                <button 
                    key={session.id}
                    onClick={() => loadSessionMessages(session.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm truncate transition-all duration-300 ${
                        activeSessionId === session.id 
                            ? 'bg-white/60 shadow-sm text-violet-700 font-bold border border-white' 
                            : 'text-slate-600 hover:bg-white/40 hover:text-slate-800'
                    }`}
                >
                    {session.title || "Cuộc trò chuyện mới"}
                </button>
            ))}
            {sessions.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">Chưa có lịch sử</p>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full bg-transparent overflow-hidden">
        {/* Header */}
        <header className="bg-white/30 backdrop-blur-xl border-b border-white/60 px-6 py-4 flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(236,72,153,0.3)] animate-float">
                <Sparkles className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">EduAI Assistant</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Sẵn sàng hỗ trợ
                </div>
            </div>
            </div>
            
            <div className="flex items-center gap-2">
            <div className="bg-white/50 backdrop-blur-md border border-white/80 p-1 rounded-xl flex shadow-sm mr-2">
                <button 
                  onClick={() => setAiModel('gemini')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${aiModel === 'gemini' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Gemini
                </button>
                <button 
                  onClick={() => setAiModel('groq')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${aiModel === 'groq' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Llama 3
                </button>
            </div>
            <button className="p-2.5 text-slate-500 hover:text-violet-600 hover:bg-white/50 rounded-xl transition-all hidden md:block backdrop-blur-sm">
                <Settings className="w-5 h-5" />
            </button>
            </div>
        </header>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-4">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
            
            {/* Welcome Message / Suggestions */}
            {messages.length === 1 && !activeSessionId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
                <button onClick={() => setInput("Giải thích cho tôi về React Hooks")} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 hover:border-violet-400 hover:bg-white/60 hover:-translate-y-1 transition-all text-left text-sm text-slate-600 group shadow-sm">
                    <BookOpen className="w-6 h-6 text-violet-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-800 block mb-1">Giải thích khái niệm</span>
                    "Giải thích cho tôi về React Hooks"
                </button>
                <button onClick={() => setInput("Gợi ý tài liệu học Python cơ bản")} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 hover:border-pink-400 hover:bg-white/60 hover:-translate-y-1 transition-all text-left text-sm text-slate-600 group shadow-sm">
                    <Search className="w-6 h-6 text-pink-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-800 block mb-1">Tìm kiếm tài liệu</span>
                    "Gợi ý tài liệu học Python cơ bản"
                </button>
                <button onClick={() => setInput("Sửa lỗi: Cannot read property of undefined")} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 hover:border-orange-400 hover:bg-white/60 hover:-translate-y-1 transition-all text-left text-sm text-slate-600 group shadow-sm">
                    <MessageSquareText className="w-6 h-6 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-800 block mb-1">Hỗ trợ gỡ lỗi</span>
                    "Sửa lỗi: Cannot read property of undefined"
                </button>
                </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className="shrink-0 mt-1">
                    {msg.role === 'ai' ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-md flex items-center justify-center text-violet-600 shadow-sm border border-white">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    )}
                </div>
                <div className={`px-6 py-4 rounded-3xl shadow-sm text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-tr-sm shadow-[0_8px_20px_rgba(236,72,153,0.2)]' 
                    : 'bg-white/60 backdrop-blur-xl border border-white/60 text-slate-800 rounded-tl-sm overflow-hidden w-full max-w-full shadow-sm'
                }`}>
                    {msg.role === 'ai' ? (
                    <div 
                        className="prose prose-sm max-w-none prose-slate prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 break-words"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(msg.text || '')) }}
                    />
                    ) : (
                    msg.text
                    )}
                </div>
                </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex gap-4 max-w-3xl animate-in fade-in duration-300">
                <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                    </div>
                </div>
                <div className="px-6 py-5 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 rounded-tl-sm shadow-sm flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                </div>
            )}
            </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/30 backdrop-blur-xl pt-4 pb-6 px-4 md:px-8 shrink-0 border-t border-white/60 z-10">
            <div className="max-w-4xl mx-auto w-full">
            {selectedFile && (
                <div className="mb-3 flex items-center gap-2 bg-white/60 backdrop-blur-md text-violet-700 px-4 py-2 rounded-xl w-fit text-sm border border-white/80 shadow-sm animate-in slide-in-from-bottom-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)} className="ml-2 hover:text-pink-600 font-bold bg-white rounded-full w-5 h-5 flex items-center justify-center leading-none">&times;</button>
                </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                    className="hidden" 
                    accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-3 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors rounded-full hover:bg-white/80 z-10"
                    title="Đính kèm file hoặc hình ảnh"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.05)] rounded-full pl-14 pr-16 py-4 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 transition-all text-lg font-medium" 
                placeholder="Hỏi EduAI bất cứ điều gì về lập trình..." 
                />
                <button 
                type="submit" 
                disabled={(!input.trim() && !selectedFile) || isTyping}
                className="absolute right-3 w-12 h-12 btn-primary !p-0 !rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-300 transition-colors shadow-sm"
                >
                <Send className="w-5 h-5 -ml-1" />
                </button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-3">EduAI có thể mắc lỗi. Vui lòng kiểm tra lại các thông tin quan trọng.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
