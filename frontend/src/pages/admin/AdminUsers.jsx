import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Trash2, Edit2, Check, X } from 'lucide-react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', { headers: { 'x-user-role': 'admin' } });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, role: user.role, progress: user.progress });
  };

  const handleSave = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, editForm, { headers: { 'x-user-role': 'admin' } });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi cập nhật người dùng');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) return;
    try {
      await api.delete(`/admin/users/${userId}`, { headers: { 'x-user-role': 'admin' } });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi xóa người dùng');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Đang tải danh sách...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Quản lý Người dùng</h2>
          <p className="text-slate-400 mt-2">Xem danh sách, phân quyền và kiểm soát tiến độ học tập.</p>
        </div>
      </header>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm font-semibold">
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Quyền (Role)</th>
                <th className="p-4">Tiến độ</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4">
                    {editingId === user.id ? (
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-200 w-full"
                      />
                    ) : (
                      <div className="font-medium text-slate-200">{user.name}</div>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4">
                    {editingId === user.id ? (
                      <select 
                        value={editForm.role}
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-200"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === user.id ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={editForm.progress} 
                          onChange={(e) => setEditForm({...editForm, progress: parseInt(e.target.value) || 0})}
                          className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-200 w-16 text-center"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${user.progress}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-400">{user.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === user.id ? (
                        <>
                          <button onClick={() => handleSave(user.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors" title="Lưu">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-slate-600/20 text-slate-400 rounded hover:bg-slate-600/40 transition-colors" title="Hủy">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors" title="Sửa">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.email !== 'admin@eduai.com' && (
                            <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Không có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
