const express = require('express');
const router = express.Router();
const { pool, logActivity } = require('../helpers/db');
const { ROADMAP_TEMPLATES } = require('../helpers/data');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

const verifyToken = require('../helpers/authMiddleware');

router.use(verifyToken);

function checkOwner(req, res, next) {
    const callerId = String(req.userId);
    const { userId } = req.params;
    if (callerId !== String(userId)) {
        return res.status(403).json({ error: "Không có quyền thao tác trên tài khoản này!" });
    }
    next();
}

// Lấy thông tin user full
async function getUserFull(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return null;
    const user = rows[0];

    const [goalRows] = await pool.query('SELECT * FROM goals WHERE user_id = ?', [userId]);
    let goal = null;
    if (goalRows.length > 0) {
        goal = {
            title: goalRows[0].title,
            career: goalRows[0].career,
            level: goalRows[0].level,
            time: goalRows[0].time
        };
    }

    const [taskRows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        progress: user.progress,
        quizzesTaken: user.quizzes_taken,
        avatar: user.avatar,
        bio: user.bio,
        goal: goal,
        tasks: taskRows.map(t => ({
            id: t.id,
            name: t.name,
            stage: t.stage,
            completed: t.completed ? true : false
        }))
    };
}

router.put('/:userId/profile', checkOwner, async (req, res) => {
    const { userId } = req.params;
    const { name, avatar, bio, password } = req.body;
    
    try {
        const user = await getUserFull(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        const oldName = user.name;
        
        let query = 'UPDATE users SET name = ?, avatar = ?, bio = ?';
        let params = [name, avatar || null, bio || null];
        
        if (password && password.trim() !== '') {
            query += ', password = ?';
            params.push(password);
        }
        
        query += ' WHERE id = ?';
        params.push(userId);
        
        await pool.query(query, params);
        await logActivity(`Người dùng '${oldName}' đã cập nhật thông tin hồ sơ.`, "info");
        
        const updatedUser = await getUserFull(userId);
        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/:userId/goal', checkOwner, async (req, res) => {
    const { userId } = req.params;
    const { title, career, level, time } = req.body;
    
    try {
        const user = await getUserFull(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        // Dùng AI sinh lộ trình
        const prompt = `Bạn là một chuyên gia giáo dục thiết kế lộ trình học tập. Hãy thiết kế một lộ trình chi tiết bằng tiếng Việt cho mục tiêu: "${title}" (Ngành: ${career}, Trình độ hiện tại: ${level}, Thời gian học mỗi ngày: ${time}).
Trả về chính xác định dạng JSON (cấu trúc JSON Object). Không bọc trong Markdown hay mảng array ngoài cùng.
Cấu trúc JSON bắt buộc:
{
  "title": "Tên lộ trình",
  "subtitle": "Mô tả ngắn gọn",
  "duration": "Tổng thời gian ước tính (ví dụ: 12 Tuần)",
  "stages": [
    {
      "number": 1,
      "title": "Tên giai đoạn 1",
      "duration": "Thời gian (ví dụ: Tuần 1 - Tuần 4)",
      "tasks": [
        { "id": "task_1", "name": "Tên nhiệm vụ 1" },
        { "id": "task_2", "name": "Tên nhiệm vụ 2" }
      ]
    }
  ]
}
Hãy sinh ra khoảng 3-4 giai đoạn (stages) và 3-4 nhiệm vụ (tasks) cho mỗi giai đoạn. Đảm bảo trường 'id' của mỗi task là duy nhất (ví dụ: cstm_task_1, cstm_task_2, ...).`;

        let template = null;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });
            let rawText = response.text;
            if (rawText.startsWith('```json')) {
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            } else if (rawText.startsWith('```')) {
                rawText = rawText.replace(/```/g, '').trim();
            }
            template = JSON.parse(rawText);
        } catch (aiErr) {
            console.error("AI Gen Roadmap Error:", aiErr);
            if (aiErr.status === 503) {
                return res.status(503).json({ error: "Hệ thống AI của Google hiện đang quá tải. Vui lòng thử lại sau ít phút!" });
            }
            return res.status(500).json({ error: "Lỗi trong quá trình AI phân tích mục tiêu. Vui lòng thử lại!" });
        }

        await pool.query('DELETE FROM goals WHERE user_id = ?', [userId]);
        await pool.query(
            'INSERT INTO goals (user_id, title, career, level, time, roadmap_json) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, title, career, level, time, JSON.stringify(template)]
        );

        if (template) {
            await pool.query('DELETE FROM tasks WHERE user_id = ?', [userId]);
            for (const stage of template.stages) {
                for (const task of stage.tasks) {
                    await pool.query(
                        'INSERT INTO tasks (id, user_id, name, stage, completed) VALUES (?, ?, ?, ?, ?)',
                        [task.id, userId, task.name, stage.number, false]
                    );
                }
            }
            
            await pool.query('UPDATE users SET progress = 0 WHERE id = ?', [userId]);
            await logActivity(`Hệ thống AI đã phân tích và sinh lộ trình '${template.title}' cho tài khoản '${user.name}'.`, "success");
        }

        const updatedUser = await getUserFull(userId);
        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/:userId/tasks/toggle', checkOwner, async (req, res) => {
    const { userId } = req.params;
    const { taskId } = req.body;
    
    try {
        const user = await getUserFull(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        const task = user.tasks.find(t => t.id === taskId);
        if (!task) return res.status(404).json({ error: "Không tìm thấy task!" });

        const newStatus = !task.completed;
        await pool.query('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [newStatus, taskId, userId]);

        // Recalculate percent progress
        const [taskRows] = await pool.query('SELECT completed FROM tasks WHERE user_id = ?', [userId]);
        const total = taskRows.length;
        const completed = taskRows.filter(t => t.completed).length;
        const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        await pool.query('UPDATE users SET progress = ? WHERE id = ?', [newProgress, userId]);
        await logActivity(`Người dùng '${user.name}' đã ${newStatus ? 'hoàn thành' : 'bỏ hoàn thành'} task: '${task.name}'. Tiến độ mới: ${newProgress}%`, "info");

        const updatedUser = await getUserFull(userId);
        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/:userId/reset', checkOwner, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await getUserFull(userId);
        if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        await pool.query('DELETE FROM goals WHERE user_id = ?', [userId]);
        await pool.query('DELETE FROM tasks WHERE user_id = ?', [userId]);
        await pool.query('UPDATE users SET progress = 0, quizzes_taken = 0 WHERE id = ?', [userId]);

        await logActivity(`Người dùng '${user.name}' đã thiết lập lại (reset) toàn bộ lộ trình học tập của mình.`, "warning");
        
        const updatedUser = await getUserFull(userId);
        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

module.exports = router;
