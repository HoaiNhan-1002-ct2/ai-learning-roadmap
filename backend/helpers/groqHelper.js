const Groq = require('groq-sdk');
require('dotenv').config();

let groq;
try {
    groq = new Groq({
        apiKey: process.env.GROQ_API_KEY || "invalid_key"
    });
} catch (error) {
    console.error("Groq Init Error:", error.message);
}

// A helper function to call Groq's Llama 3 API for chat/JSON completion
async function generateGroqContent(prompt, systemPrompt = null, isJsonMode = false) {
    try {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({ role: "system", content: systemPrompt });
        }
        
        messages.push({ role: "user", content: prompt });

        const options = {
            messages: messages,
            model: "llama-3.3-70b-versatile", // We use the most powerful 70B model by default
            temperature: 0.7,
            max_tokens: 4096,
        };

        if (isJsonMode) {
            options.response_format = { type: "json_object" };
            options.temperature = 0.2; // Lower temperature for more stable JSON output
        }

        const completion = await groq.chat.completions.create(options);
        
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Lỗi khi gọi Groq API:", error);
        throw new Error("Không thể tạo nội dung từ Groq. Vui lòng kiểm tra lại cấu hình API.");
    }
}

// Keep a chat history function for Chatbot
async function generateGroqChat(messagesHistory) {
    try {
        const completion = await groq.chat.completions.create({
            messages: messagesHistory,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4096,
        });
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Lỗi khi gọi Groq Chat:", error);
        throw new Error("Không thể trò chuyện với Groq.");
    }
}

module.exports = {
    generateGroqContent,
    generateGroqChat
};
