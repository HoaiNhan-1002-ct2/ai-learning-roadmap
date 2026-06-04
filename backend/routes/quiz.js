const express = require('express');
const router = express.Router();
const { pool, logActivity } = require('../helpers/db');
const { QUIZ_BANK } = require('../helpers/data');
const { GoogleGenAI } = require('@google/genai');

// Khởi tạo Gemini client, tự động dùng biến môi trường GEMINI_API_KEY
const ai = new GoogleGenAI({});

function checkOwner(req, res, next) {
    const callerId = req.headers['x-user-id'];
    const { userId } = req.params;
    if (callerId !== userId) {
        return res.status(403).json({ error: "Không có quyền truy cập!" });
    }
    next();
}

router.get('/:userId', checkOwner, async (req, res) => {
    const { career } = req.query;
    try {
        const careerName = career || 'công nghệ thông tin';
        const prompt = `Tạo 15 câu hỏi trắc nghiệm tiếng Việt chất lượng và phù hợp cho lĩnh vực: ${careerName}.
Yêu cầu:
- Trả về danh sách (array) chính xác định dạng JSON. Không bọc trong bất kỳ object nào.
- Mỗi câu hỏi bao gồm các trường có TÊN KEY tiếng Anh chính xác như sau:
  - "id": Số thứ tự từ 1 đến 15.
  - "text": Nội dung câu hỏi.
  - "options": Mảng gồm đúng 4 câu trả lời.
  - "correct": Vị trí của đáp án đúng trong mảng options (từ 0 đến 3).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const questions = JSON.parse(response.text);
        res.json({ questions });
    } catch (err) {
        console.error("Gemini AI error in quiz:", err);
        // Fallback to hardcoded bank
        const poolData = QUIZ_BANK[career] || QUIZ_BANK["default"];
        res.json({ questions: poolData });
    }
});

router.post('/:userId/submit', checkOwner, async (req, res) => {
    const { userId } = req.params;
    const { score, total, ratio, evaluation } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT name, quizzes_taken FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy người dùng!" });

        const user = rows[0];
        await pool.query('UPDATE users SET quizzes_taken = quizzes_taken + 1 WHERE id = ?', [userId]);

        await logActivity(`Người dùng '${user.name}' hoàn thành bài AI Quiz. Kết quả đạt: ${score}/${total} (${ratio}%). Học lực: ${evaluation}.`, "info");
        
        // We just need to return something, frontend expects user object back, so let's get the full user
        // Instead of writing the full user fetch logic again, we can just return success 
        // since frontend quiz.js calls saveCurrentUser(response.user). Let's fetch it.
        const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const updatedUser = userRows[0];
        
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
        
        const returnUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            progress: updatedUser.progress,
            quizzesTaken: updatedUser.quizzes_taken,
            goal: goal,
            tasks: taskRows.map(t => ({
                id: t.id,
                name: t.name,
                stage: t.stage,
                completed: t.completed ? true : false
            }))
        };

        res.json({ user: returnUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

module.exports = router;
