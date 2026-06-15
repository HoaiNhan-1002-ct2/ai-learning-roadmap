const express = require('express');
const router = express.Router();
const { ROADMAP_TEMPLATES } = require('../helpers/data');
const { pool } = require('../helpers/db');
const { generateGroqContent } = require('../helpers/groqHelper');

router.get('/resources', async (req, res) => {
    const { taskName } = req.query;
    try {
        const prompt = `Bạn là chuyên gia giáo dục. Hãy cung cấp 3 tài liệu học tập (khóa học, tài liệu, hoặc video) tốt nhất để học chủ đề sau: "${taskName}".
Yêu cầu trả về định dạng JSON array chính xác, không bọc trong object. Mỗi item có các trường (key tiếng Anh):
- "title": Tên tài liệu
- "type": Loại tài liệu (Video, Bài viết, Khóa học)
- "url": BẮT BUỘC sử dụng cấu trúc link tìm kiếm để tránh lỗi 404.
  + Nếu là Video: "https://www.youtube.com/results?search_query=" + từ khóa
  + Nếu là Bài viết/Khóa học: "https://www.google.com/search?q=" + từ khóa
Không bao giờ tự bịa ra các đường dẫn URL chi tiết bài viết (ví dụ blog.com/abc-xyz) vì chúng thường không tồn tại.`;

        const responseText = await generateGroqContent(prompt, "Bạn là chuyên gia giáo dục phân tích lộ trình học tập. Trả về đúng JSON array.", true);
        let parsed = JSON.parse(responseText);
        let resources = [];
        if (Array.isArray(parsed)) {
            resources = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
            for (let key in parsed) {
                if (Array.isArray(parsed[key])) {
                    resources = parsed[key];
                    break;
                }
            }
        }
        res.json({ resources });
    } catch (err) {
        console.error(err);
        res.json({ resources: [
            { title: "Tài liệu MDN Web Docs", type: "Bài viết", url: "https://developer.mozilla.org" },
            { title: "Khóa học trên W3Schools", type: "Khóa học", url: "https://www.w3schools.com" },
            { title: "Video hướng dẫn trên YouTube", type: "Video", url: "https://youtube.com" }
        ]});
    }
});

router.get('/lesson', async (req, res) => {
    const { taskName } = req.query;
    try {
        const prompt = `Bạn là một gia sư AI xuất sắc. Hãy viết một bài giảng chi tiết, dễ hiểu về chủ đề sau: "${taskName}".
Yêu cầu định dạng bằng Markdown (.md) và không cần bọc trong JSON. Bài giảng phải có cấu trúc:
1. Giải thích khái niệm cốt lõi một cách sinh động (sử dụng ví dụ thực tế).
2. Code minh họa hoặc các bước thực hành chi tiết (nếu có).
3. Tóm tắt 3 ý chính quan trọng nhất cần nhớ.
Luôn trình bày bằng ngôn ngữ dễ gần, khuyến khích người học.`;

        const responseText = await generateGroqContent(prompt, "Bạn là chuyên gia giáo dục cung cấp bài giảng markdown.", false);
        res.json({ lesson: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi sinh bài giảng." });
    }
});

router.get('/custom/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query('SELECT roadmap_json, career FROM goals WHERE user_id = ?', [userId]);
        if (rows.length > 0) {
            if (rows[0].roadmap_json) {
                let template = rows[0].roadmap_json;
                if (typeof template === 'string') template = JSON.parse(template);
                return res.json({ template });
            } else {
                const career = rows[0].career;
                const template = ROADMAP_TEMPLATES[career];
                if (template) return res.json({ template });
            }
        }
        res.status(404).json({ error: "Không tìm thấy lộ trình!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.get('/:career', (req, res) => {
    const { career } = req.params;
    const template = ROADMAP_TEMPLATES[career];
    if (template) {
        res.json({ template });
    } else {
        res.status(404).json({ error: "Không tìm thấy lộ trình!" });
    }
});

router.get('/', (req, res) => {
    res.json({ templates: ROADMAP_TEMPLATES });
});

module.exports = router;
