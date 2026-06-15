import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-react';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs', { headers: { 'x-user-role': 'admin' } });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ nhật ký hệ thống?')) return;
    try {
      await api.post('/admin/logs/clear', {}, { headers: { 'x-user-role': 'admin' } });
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi xóa nhật ký');
    }
  };

  const handleResetData = async () => {
    const code = window.prompt('CẢNH BÁO: Hành động này sẽ xóa toàn bộ tiến độ học tập, mục tiêu và lộ trình của tất cả người dùng. Nhập "CONFIRM" để tiếp tục.');
    if (code !== 'CONFIRM') return;
    
    try {
      await api.post('/admin/reset-data', {}, { headers: { 'x-user-role': 'admin' } });
      alert('Đã reset dữ liệu học tập thành công!');
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi reset dữ liệu');
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Đang tải nhật ký...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Nhật ký Hệ thống</h2>
          <p className="text-slate-400 mt-2">Theo dõi các hoạt động, cảnh báo và lỗi diễn ra trên hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleClearLogs}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors border border-slate-700"
          >
            <Trash2 className="w-4 h-4" /> Dọn dẹp Logs
          </button>
          <button 
            onClick={handleResetData}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <AlertTriangle className="w-4 h-4" /> Reset Dữ Liệu Học Tập
          </button>
        </div>
      </header>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
        <ul className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
          {logs.map(log => (
            <li key={log.id} className="p-4 hover:bg-slate-700/20 transition-colors flex gap-4 items-start">
              <div className="mt-0.5">{getLogIcon(log.level)}</div>
              <div className="flex-1">
                <p className="text-slate-200 text-sm">{log.text}</p>
                <p className="text-slate-500 text-xs mt-1 font-mono">{log.time}</p>
              </div>
            </li>
          ))}
          {logs.length === 0 && (
            <li className="p-8 text-center text-slate-500">Nhật ký hệ thống trống.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AdminLogs;
