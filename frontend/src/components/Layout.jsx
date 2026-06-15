import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const isChatbot = location.pathname === '/chatbot';

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 overflow-hidden font-sans relative selection:bg-violet-500/20 selection:text-violet-700">
      {/* Animated Holographic Background Layers */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-pink-400/20 rounded-full blur-[100px] animate-blob z-0 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-violet-400/20 rounded-full blur-[120px] animate-blob z-0 pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-orange-300/20 rounded-full blur-[150px] animate-blob z-0 pointer-events-none" style={{ animationDelay: '4s' }}></div>
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white/40 backdrop-blur-2xl border-l border-white/60 shadow-[-10px_0_30px_rgba(31,38,135,0.05)] relative z-10">
        <div className={`flex-1 overflow-y-auto scrollbar-hide relative ${isChatbot ? 'p-0 overflow-hidden' : 'p-6 md:p-10'}`}>
          <div className={`w-full mx-auto ${isChatbot ? 'absolute inset-0' : 'max-w-7xl'}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
