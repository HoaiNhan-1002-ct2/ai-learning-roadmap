const express = require('express');
const router = express.Router();
const { pool, logActivity } = require('../helpers/db');
const { QUIZ_BANK } = require('../helpers/data');
const { generateGroqContent } = require('../helpers/groqHelper');

function checkOwner(req, res, next) {
    const callerId = req.headers['x-user-id'];
    const { userId } = req.params;
    if (callerId !== userId) {
        return res.status(403).json({ error: "Không có quyền truy cập!" });
    }
    next();
}

router.get('/:userId', checkOwner, async (req, res) => {
    const { career, topic } = req.query;
    try {
        const careerName = career || 'công nghệ thông tin';
        const numQuestions = topic ? 15 : 20;
        const focus = topic ? `Bài kiểm tra này tập trung chuyên sâu vào chủ đề/giai đoạn: "${topic}" thuộc lĩnh vực ${careerName}.` : `Bài kiểm tra tổng hợp kiến thức lĩnh vực: ${careerName}.`;
        
        const prompt = `Tạo ${numQuestions} câu hỏi trắc nghiệm tiếng Việt chất lượng. ${focus}
Yêu cầu:
- Trả về danh sách (array) chính xác định dạng JSON. Không bọc trong bất kỳ object nào.
- Mỗi câu hỏi bao gồm các trường có TÊN KEY tiếng Anh chính xác như sau:
  - "id": Số thứ tự từ 1 đến ${numQuestions}.
  - "text": Nội dung câu hỏi.
  - "options": Mảng gồm đúng 4 câu trả lời.
  - "correct": Vị trí của đáp án đúng trong mảng options (từ 0 đến 3).
  - "explanation": Lời giải thích chi tiết. Bắt buộc phải chỉ ra RÕ RÀNG đâu là đáp án đúng và vì sao đáp án người dùng chọn là sai.`;

        const responseText = await generateGroqContent(prompt, "Bạn là một chuyên gia tạo bài kiểm tra trắc nghiệm (AI Quiz Generator). Trả về duy nhất JSON array, không kèm code block hay text dư thừa.", true);
        
        const questions = JSON.parse(responseText);
        res.json({ questions });
    } catch (err) {
        console.error("Groq AI error in quiz:", err);
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
