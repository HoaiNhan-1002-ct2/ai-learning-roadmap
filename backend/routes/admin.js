const express = require('express');
const router = express.Router();
const { pool, logActivity } = require('../helpers/db');

// Middleware phân quyền
function checkAdmin(req, res, next) {
    const role = req.headers['x-user-role'];
    if (role !== 'admin') {
        return res.status(403).json({ error: "Không có quyền truy cập!" });
    }
    next();
}

router.use(checkAdmin);

router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, progress, quizzes_taken FROM users');
        const [goals] = await pool.query('SELECT * FROM goals');
        
        // attach goals
        const formattedUsers = users.map(u => {
            const goal = goals.find(g => g.user_id === u.id);
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                progress: u.progress,
                quizzesTaken: u.quizzes_taken,
                goal: goal ? {
                    title: goal.title,
                    career: goal.career,
                    level: goal.level,
                    time: goal.time
                } : null,
                tasks: [] // Admin list doesn't strictly need tasks unless shown in UI. We can omit or fetch if needed.
            };
        });

        res.json({ users: formattedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, role, progress } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT name, role, progress FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: "User không tồn tại!" });
        const oldData = rows[0];

        await pool.query('UPDATE users SET name = ?, role = ?, progress = ? WHERE id = ?', [name, role, progress, userId]);
        
        await logActivity(`Cập nhật thông tin tài khoản '${name}': Quyền [${oldData.role} -> ${role}], Tiến độ [${oldData.progress}% -> ${progress}%].`, "warning");
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: "User không tồn tại!" });
        const name = rows[0].name;

        // Because of ON DELETE CASCADE, goals and tasks will be deleted automatically
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        
        await logActivity(`Tài khoản '${name}' đã bị xóa khỏi hệ thống bởi Admin.`, "error");
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const [logs] = await pool.query('SELECT * FROM logs ORDER BY id DESC');
        res.json({ logs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/logs/clear', async (req, res) => {
    try {
        await pool.query('DELETE FROM logs');
        // Need to log the clearing action itself
        await logActivity("Toàn bộ nhật ký hệ thống đã được dọn dẹp.", "warning");
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/reset-data', async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks');
        await pool.query('DELETE FROM goals');
        await pool.query('UPDATE users SET progress = 0, quizzes_taken = 0');
        await pool.query('DELETE FROM logs');
        
        await logActivity("Toàn bộ cơ sở dữ liệu học tập đã được reset (Users được giữ lại).", "error");
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

module.exports = router;
