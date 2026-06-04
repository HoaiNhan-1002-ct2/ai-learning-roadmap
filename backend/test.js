require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({});
const prompt = `Bạn là một chuyên gia giáo dục thiết kế lộ trình học tập. Hãy thiết kế một lộ trình chi tiết bằng tiếng Việt cho mục tiêu: 'Backend' (Ngành: Backend Developer, Trình độ hiện tại: beginner, Thời gian học mỗi ngày: 1).
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
}`;

ai.models.generateContent({ 
  model: 'gemini-2.5-flash', 
  contents: prompt, 
  config: { responseMimeType: 'application/json' } 
})
.then(res => { 
  console.log('RESPONSE TEXT:', res.text);
  let t = JSON.parse(res.text);
  console.log('STAGES COUNT:', t.stages ? t.stages.length : 'NO STAGES');
})
.catch(console.error);
