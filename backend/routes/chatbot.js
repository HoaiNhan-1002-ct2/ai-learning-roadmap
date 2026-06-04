const express = require('express');
const router = express.Router();
const { CHATBOT_RESPONSES } = require('../helpers/data');
const { readDB } = require('../helpers/db');

router.post('/', (req, res) => {
    const { question, userId } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.id === userId);
    const normalizedInput = question.toLowerCase();
    
    let matchedResponse = null;

    if (normalizedInput.includes("api")) {
        matchedResponse = CHATBOT_RESPONSES.api;
    } else if (normalizedInput.includes("react") || normalizedInput.includes("hook")) {
        matchedResponse = CHATBOT_RESPONSES.react;
    } else if (normalizedInput.includes("lộ trình") || normalizedInput.includes("cách học") || normalizedInput.includes("tự học")) {
        matchedResponse = CHATBOT_RESPONSES["lộ trình"];
    } else if (normalizedInput.includes("nextjs") || normalizedInput.includes("next.js")) {
        matchedResponse = CHATBOT_RESPONSES.nextjs;
    } else if (normalizedInput.includes("nodejs") || normalizedInput.includes("node") || normalizedInput.includes("database") || normalizedInput.includes("sql")) {
        matchedResponse = CHATBOT_RESPONSES.nodejs;
    } else if (normalizedInput.includes("project") || normalizedInput.includes("đồ án") || normalizedInput.includes("dự án")) {
        matchedResponse = CHATBOT_RESPONSES.project;
    } else if (normalizedInput.includes("chào") || normalizedInput.includes("hello") || normalizedInput.includes("hi ")) {
        matchedResponse = CHATBOT_RESPONSES.chào;
    } else if (normalizedInput.includes("cảm ơn") || normalizedInput.includes("thank")) {
        matchedResponse = CHATBOT_RESPONSES["cảm ơn"];
    }

    if (!matchedResponse) {
        matchedResponse = CHATBOT_RESPONSES.default;
    }

    // Integrate personalized suggestion if user has a goal
    if (user && user.goal) {
        const goalCareer = user.goal.career;
        const careerMap = {
            frontend: "Lập trình viên Frontend Web ReactJS",
            backend: "Lập trình viên Backend Node/Postgres",
            fullstack: "Lập trình viên Fullstack Client-Server",
            mobile: "Lập trình viên Di Động Expo/React Native",
            "data-analyst": "Chuyên viên Phân Tích Dữ Liệu SQL/PowerBI",
            "ai-ml": "Kỹ Sư AI/Machine Learning"
        };
        const careerName = careerMap[goalCareer] || goalCareer;
        
        matchedResponse += `\n\n*Lời khuyên từ Trợ lý AI:* Mục tiêu hiện tại của bạn là hướng tới trở thành **${careerName}**, hãy tập trung rèn luyện các tasks ở Giai đoạn học tập hiện tại của bạn trước khi bước vào các kỹ năng bổ trợ khác nhé!`;
    }

    res.json({ answer: matchedResponse });
});

module.exports = router;
