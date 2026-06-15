require('dotenv').config({ path: '.env' });
const { generateGroqContent } = require('./helpers/groqHelper.js');

async function test() {
  const taskName = 'Tìm hiểu các khái niệm cốt lõi của DevOps';
  const prompt = `Bạn là chuyên gia giáo dục. Hãy cung cấp 3 tài liệu học tập (khóa học, tài liệu, hoặc video) tốt nhất để học chủ đề sau: "${taskName}".
Yêu cầu trả về định dạng JSON array chính xác, không bọc trong object. Mỗi item có các trường (key tiếng Anh):
- "title": Tên tài liệu
- "type": Loại tài liệu (Video, Bài viết, Khóa học)
- "url": BẮT BUỘC sử dụng cấu trúc link tìm kiếm để tránh lỗi 404.
  + Nếu là Video: "https://www.youtube.com/results?search_query=" + từ khóa
  + Nếu là Bài viết/Khóa học: "https://www.google.com/search?q=" + từ khóa
Không bao giờ tự bịa ra các đường dẫn URL chi tiết bài viết (ví dụ blog.com/abc-xyz) vì chúng thường không tồn tại.`;
  try {
    console.log('Sending prompt...');
    const res = await generateGroqContent(prompt, 'Bạn là chuyên gia giáo dục phân tích lộ trình học tập. Trả về đúng JSON array.', true);
    console.log('Raw output:');
    console.log(res);
    let parsed = JSON.parse(res);
    let resources = Array.isArray(parsed) ? parsed : (parsed.resources || parsed.data || []);
    console.log('Extracted array:');
    console.dir(resources, { depth: null });
  } catch (e) {
    console.error(e);
  }
}
test();
