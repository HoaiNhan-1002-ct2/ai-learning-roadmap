import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User as UserIcon, BookOpen, MessageSquareText, Search, Settings, PanelRightClose } from 'lucide-react';

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Chào bạn! Tôi là EduAI, trợ lý học tập cá nhân của bạn. Bạn đang gặp khó khăn gì trong lộ trình học tập, hay cần giải thích một khái niệm lập trình nào đó?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: 'Đó là một câu hỏi rất hay! Để tôi giải thích chi tiết cho bạn nhé. Bạn có muốn xem thêm tài liệu tham khảo hay ví dụ thực tế không?'
      }]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col -mx-4 md:-mx-8 -my-4 md:-my-8 bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
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
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden md:block">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-32">
          
          {/* Welcome Message / Suggestions */}
          {messages.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
              <button onClick={() => setInput("Giải thích cho tôi về React Hooks")} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-accentPrimary hover:shadow-md transition-all text-left text-sm text-slate-600 group">
                <BookOpen className="w-5 h-5 text-indigo-400 mb-2 group-hover:text-accentPrimary" />
                <span className="font-medium text-slate-800 block mb-1">Giải thích khái niệm</span>
                "Giải thích cho tôi về React Hooks"
              </button>
              <button onClick={() => setInput("Gợi ý tài liệu học Python cơ bản")} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-accentPrimary hover:shadow-md transition-all text-left text-sm text-slate-600 group">
                <Search className="w-5 h-5 text-emerald-400 mb-2 group-hover:text-accentPrimary" />
                <span className="font-medium text-slate-800 block mb-1">Tìm kiếm tài liệu</span>
                "Gợi ý tài liệu học Python cơ bản"
              </button>
              <button onClick={() => setInput("Sửa lỗi: Cannot read property of undefined")} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-accentPrimary hover:shadow-md transition-all text-left text-sm text-slate-600 group">
                <MessageSquareText className="w-5 h-5 text-orange-400 mb-2 group-hover:text-accentPrimary" />
                <span className="font-medium text-slate-800 block mb-1">Hỗ trợ gỡ lỗi</span>
                "Sửa lỗi: Cannot read property of undefined"
              </button>
            </div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className="shrink-0 mt-1">
                {msg.role === 'ai' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shadow-sm border-2 border-white">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-accentPrimary text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-3xl animate-in fade-in duration-300">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-10 pb-6 px-4 md:px-8 shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pl-6 pr-14 py-4 text-slate-700 focus:outline-none focus:border-accentPrimary focus:ring-4 focus:ring-accentPrimary/10 transition-all text-lg" 
              placeholder="Hỏi EduAI bất cứ điều gì về lập trình..." 
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-10 h-10 bg-accentPrimary rounded-full flex items-center justify-center text-white hover:bg-accentSecondary disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm"
            >
              <Send className="w-5 h-5 -ml-1" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-3">EduAI có thể mắc lỗi. Vui lòng kiểm tra lại các thông tin quan trọng.</p>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
