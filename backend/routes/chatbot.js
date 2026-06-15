const express = require('express');
const router = express.Router();
const { pool } = require('../helpers/db');
const { GoogleGenAI } = require('@google/genai');
const { generateGroqChat, generateGroqContent } = require('../helpers/groqHelper');

// Khởi tạo SDK (tự động lấy GEMINI_API_KEY từ .env)
const ai = new GoogleGenAI({});

// Lấy danh sách các phiên chat của user
router.get('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [sessions] = await pool.query('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY timestamp DESC', [userId]);
        res.json({ sessions });
    } catch (error) {
        console.error("Fetch Sessions Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Lấy tin nhắn của một phiên chat cụ thể
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const [rows] = await pool.query('SELECT role, text FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC', [sessionId]);
        const messages = rows.map((row, index) => ({
            id: index + 2,
            role: row.role,
            text: row.text
        }));
        res.json({ messages });
    } catch (error) {
        console.error("Fetch Session Messages Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { question, history, userId, sessionId, aiModel = 'gemini' } = req.body;
        
        let systemInstruction = "Bạn là EduAI, một trợ lý học tập cá nhân nhiệt tình và chuyên nghiệp. Bạn có nhiệm vụ giải đáp các thắc mắc về lập trình, giải thích code, và hướng dẫn lộ trình học tập cho người dùng. Hãy trả lời ngắn gọn, thân thiện, dễ hiểu và format bằng Markdown.";

        // Nếu có userId, lấy mục tiêu học tập để cá nhân hóa
        if (userId) {
            const [goals] = await pool.query('SELECT career FROM goals WHERE user_id = ?', [userId]);
            if (goals.length > 0) {
                const goalCareer = goals[0].career;
                const careerMap = {
                    frontend: "Lập trình viên Frontend Web ReactJS",
                    backend: "Lập trình viên Backend Node/Postgres",
                    fullstack: "Lập trình viên Fullstack Client-Server",
                    mobile: "Lập trình viên Di Động Expo/React Native",
                    "data-analyst": "Chuyên viên Phân Tích Dữ Liệu SQL/PowerBI",
                    "ai-ml": "Kỹ Sư AI/Machine Learning"
                };
                const careerName = careerMap[goalCareer] || goalCareer;
                systemInstruction += `\nĐặc biệt lưu ý: Người dùng này đang theo đuổi mục tiêu trở thành "${careerName}". Hãy ưu tiên đưa ra các ví dụ và lời khuyên bám sát với định hướng này nhé.`;
            }
        }

        let answerText = "";

        if (aiModel === 'groq') {
            let groqHistory = [{ role: 'system', content: systemInstruction }];
            if (history && Array.isArray(history) && history.length > 0) {
                history.forEach(msg => {
                    const role = msg.role === 'model' ? 'assistant' : msg.role;
                    const content = msg.parts[0].text;
                    groqHistory.push({ role, content });
                });
            } else {
                groqHistory.push({ role: 'user', content: question });
            }
            answerText = await generateGroqChat(groqHistory);
        } else {
            let contents = [];
            if (history && Array.isArray(history) && history.length > 0) {
                contents = history;
            } else {
                contents = [{ role: 'user', parts: [{ text: question }] }];
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });
            answerText = response.text;
        }

        let currentSessionId = sessionId;

        // Lưu vào DB nếu có userId
        if (userId) {
            // Nếu chưa có session, tạo session mới và nhờ AI tạo title ngắn
            if (!currentSessionId) {
                let title = "Cuộc trò chuyện mới";
                try {
                    const titlePrompt = `Tạo một tiêu đề cực kỳ ngắn gọn (không quá 5 chữ) mô tả câu hỏi sau của người dùng. Trả về đúng tiêu đề, không giải thích gì thêm.\nCâu hỏi: "${question}"`;
                    if (aiModel === 'groq') {
                        title = await generateGroqContent(titlePrompt);
                    } else {
                        const titleRes = await ai.models.generateContent({
                            model: 'gemini-2.5-flash',
                            contents: [{ role: 'user', parts: [{ text: titlePrompt }] }]
                        });
                        title = titleRes.text;
                    }
                    title = title.trim().replace(/^"|"$/g, '');
                } catch (e) {
                    console.error("AI Title generation failed", e);
                }
                
                const [result] = await pool.query('INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)', [userId, title]);
                currentSessionId = result.insertId;
            }

            await pool.query('INSERT INTO chat_messages (session_id, user_id, role, text) VALUES (?, ?, ?, ?)', [currentSessionId, userId, 'user', question]);
            await pool.query('INSERT INTO chat_messages (session_id, user_id, role, text) VALUES (?, ?, ?, ?)', [currentSessionId, userId, 'ai', answerText]);
        }

        res.json({ answer: answerText, sessionId: currentSessionId });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
