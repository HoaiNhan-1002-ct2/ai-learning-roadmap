require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main() {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Test" }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 100,
        });
        console.log("Success:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.error) console.error("Details:", error.error);
    }
}

main();
