const INITIAL_DATABASE = {
    users: [
        {
            id: "usr_demo",
            name: "Nguyễn Văn Nam",
            email: "user@eduai.com",
            password: "123456",
            role: "user",
            goal: {
                title: "Trở thành lập trình viên Frontend Web ReactJS chuyên nghiệp",
                career: "frontend",
                level: "beginner",
                time: "2"
            },
            progress: 35,
            quizzesTaken: 1,
            tasks: [
                { id: "fe_task_1", name: "Học HTML5 & CSS3 căn bản (Cấu trúc thẻ, Box Model, Flexbox)", stage: 1, completed: true },
                { id: "fe_task_2", name: "Học Javascript ES6+ (Khai báo biến, Array methods, Promise/Async)", stage: 1, completed: true },
                { id: "fe_task_3", name: "Sử dụng Git & GitHub để quản lý mã nguồn", stage: 1, completed: true },
                { id: "fe_task_4", name: "Làm quen với CSS Frameworks (TailwindCSS/Bootstrap)", stage: 1, completed: false },
                { id: "fe_task_5", name: "Cơ bản về ReactJS (JSX, Components, Props, State)", stage: 2, completed: false },
                { id: "fe_task_6", name: "Xử lý Forms và Hook nâng cao (useEffect, useContext, useRef)", stage: 2, completed: false },
                { id: "fe_task_7", name: "Quản lý State toàn cục với Redux Toolkit hoặc Zustand", stage: 2, completed: false },
                { id: "fe_task_8", name: "Làm việc với Rest API (Fetch/Axios) & Routing (React Router)", stage: 2, completed: false },
                { id: "fe_task_9", name: "Tối ưu hóa hiệu năng React & Deployment (Vercel/Netlify)", stage: 3, completed: false },
                { id: "fe_task_10", name: "Viết Test căn bản (Jest & React Testing Library)", stage: 3, completed: false },
                { id: "fe_task_11", name: "Học Next.js (SSR, SSG, Routing cơ bản)", stage: 3, completed: false }
            ]
        },
        {
            id: "adm_demo",
            name: "Quản trị viên Hệ thống",
            email: "admin@eduai.com",
            password: "123456",
            role: "admin",
            goal: null,
            progress: 0,
            quizzesTaken: 0,
            tasks: []
        }
    ],
    logs: [
        { time: "2026-05-26 09:12:05", level: "info", text: "Hệ thống EduAI Planner đã khởi tạo thành công." },
        { time: "2026-05-26 09:15:30", level: "success", text: "Cơ sở dữ liệu SQLite giả lập đã nạp 2 tài khoản demo." },
        { time: "2026-05-26 09:30:12", level: "success", text: "Người dùng 'Nguyễn Văn Nam' đăng nhập thành công." },
        { time: "2026-05-26 10:05:40", level: "info", text: "AI phân tích thành công hồ sơ của Nguyễn Văn Nam & Sinh lộ trình Frontend." }
    ]
};

// ROADMAP TEMPLATES
const ROADMAP_TEMPLATES = {
    frontend: {
        title: "Lộ trình phát triển Frontend Web Developer",
        subtitle: "Lập trình viên giao diện chuyên nghiệp sử dụng HTML/CSS/JS và thư viện ReactJS",
        duration: "12 Tuần",
        stages: [
            {
                number: 1,
                title: "Nền tảng Giao diện & Tư duy Lập trình",
                duration: "Tuần 1 - Tuần 4",
                tasks: [
                    { id: "fe_task_1", name: "Học HTML5 & CSS3 căn bản (Cấu trúc thẻ, Box Model, Flexbox)" },
                    { id: "fe_task_2", name: "Học Javascript ES6+ (Khai báo biến, Array methods, Promise/Async)" },
                    { id: "fe_task_3", name: "Sử dụng Git & GitHub để quản lý mã nguồn" },
                    { id: "fe_task_4", name: "Làm quen với CSS Frameworks (TailwindCSS/Bootstrap)" }
                ]
            },
            {
                number: 2,
                title: "Chuyên sâu ReactJS & Quản lý State",
                duration: "Tuần 5 - Tuần 8",
                tasks: [
                    { id: "fe_task_5", name: "Cơ bản về ReactJS (JSX, Components, Props, State)" },
                    { id: "fe_task_6", name: "Xử lý Forms và Hook nâng cao (useEffect, useContext, useRef)" },
                    { id: "fe_task_7", name: "Quản lý State toàn cục với Redux Toolkit hoặc Zustand" },
                    { id: "fe_task_8", name: "Làm việc với Rest API (Fetch/Axios) & Routing (React Router)" }
                ]
            },
            {
                number: 3,
                title: "Tối ưu hóa, Next.js & Sẵn sàng đi làm",
                duration: "Tuần 9 - Tuần 12",
                tasks: [
                    { id: "fe_task_9", name: "Tối ưu hóa hiệu năng React & Deployment (Vercel/Netlify)" },
                    { id: "fe_task_10", name: "Viết Test căn bản (Jest & React Testing Library)" },
                    { id: "fe_task_11", name: "Học Next.js (SSR, SSG, Routing cơ bản)" }
                ]
            }
        ]
    },
    backend: {
        title: "Lộ trình đào tạo Backend Developer",
        subtitle: "Lập trình hệ thống server side, xây dựng RESTful API và quản lý hệ quản trị cơ sở dữ liệu",
        duration: "14 Tuần",
        stages: [
            {
                number: 1,
                title: "Tư duy ngôn ngữ NodeJS & Rest API",
                duration: "Tuần 1 - Tuần 5",
                tasks: [
                    { id: "be_task_1", name: "Nắm vững Javascript/Typescript nâng cao chạy trên Node.js runtime" },
                    { id: "be_task_2", name: "Xây dựng Server với ExpressJS (Routing, Middlewares, Error Handling)" },
                    { id: "be_task_3", name: "Thiết kế RESTful API chuẩn hóa (HTTP methods, Status codes)" },
                    { id: "be_task_4", name: "Tìm hiểu Authentication với JWT (Mã hóa, ký số, giải mã token)" }
                ]
            },
            {
                number: 2,
                title: "Cơ sở dữ liệu & Tương tác Server",
                duration: "Tuần 6 - Tuần 10",
                tasks: [
                    { id: "be_task_5", name: "SQL căn bản & Nâng cao với PostgreSQL / MySQL" },
                    { id: "be_task_6", name: "Cơ sở dữ liệu NoSQL: Thiết lập & Truy vấn với MongoDB" },
                    { id: "be_task_7", name: "Sử dụng ORM/ODM (Prisma, Sequelize, Mongoose) để quản lý Model" },
                    { id: "be_task_8", name: "Tối ưu hóa truy vấn cơ sở dữ liệu (Index, Query Optimization)" }
                ]
            },
            {
                number: 3,
                title: "Caching, System Design & Deployment",
                duration: "Tuần 11 - Tuần 14",
                tasks: [
                    { id: "be_task_9", name: "Cải tiến tốc độ đọc dữ liệu bằng Caching với Redis DB" },
                    { id: "be_task_10", name: "Đóng gói mã nguồn bằng Docker & Containerization" },
                    { id: "be_task_11", name: "Deploy dự án lên Render/AWS EC2 & Thiết lập CI/CD" }
                ]
            }
        ]
    },
    fullstack: {
        title: "Lộ trình Fullstack Web Developer",
        subtitle: "Làm chủ cả giao diện người dùng và hệ thống cơ sở dữ liệu phía máy chủ",
        duration: "16 Tuần",
        stages: [
            {
                number: 1,
                title: "Lập trình Giao diện Front-end",
                duration: "Tuần 1 - Tuần 6",
                tasks: [
                    { id: "fs_task_1", name: "Lập trình web responsive cơ bản HTML/CSS & Javascript ES6" },
                    { id: "fs_task_2", name: "Xây dựng UI Single Page App động sử dụng ReactJS" },
                    { id: "fs_task_3", name: "Quản lý giao diện cực nhanh với TailwindCSS utility framework" }
                ]
            },
            {
                number: 2,
                title: "Lập trình Server-side & CSDL Backend",
                duration: "Tuần 7 - Tuần 12",
                tasks: [
                    { id: "fs_task_4", name: "Xây dựng RESTful API máy chủ Node.js & ExpressJS" },
                    { id: "fs_task_5", name: "Làm việc với CSDL Postgres / MongoDB qua Prisma ORM" },
                    { id: "fs_task_6", name: "Thiết lập phân quyền đăng nhập an toàn JWT, Cookies & Sessions" }
                ]
            },
            {
                number: 3,
                title: "Tích hợp ứng dụng, Docker & AWS",
                duration: "Tuần 13 - Tuần 16",
                tasks: [
                    { id: "fs_task_7", name: "Tích hợp Frontend React với Backend Express, xử lý CORS" },
                    { id: "fs_task_8", name: "Đóng gói toàn bộ ứng dụng Client-Server bằng Docker Compose" },
                    { id: "fs_task_9", name: "Triển khai hoàn chỉnh lên AWS/Heroku và gắn tên miền" }
                ]
            }
        ]
    },
    mobile: {
        title: "Lộ trình lập trình viên Di Động Cross-platform",
        subtitle: "Xây dựng các ứng dụng trên iOS và Android từ một cơ sở mã nguồn duy nhất",
        duration: "12 Tuần",
        stages: [
            {
                number: 1,
                title: "Nền tảng Javascript & React Native",
                duration: "Tuần 1 - Tuần 4",
                tasks: [
                    { id: "mb_task_1", name: "Hiểu sâu ReactJS và triết lý luồng dữ liệu một chiều (Unidirectional data)" },
                    { id: "mb_task_2", name: "Khởi chạy dự án di động với Expo CLI & React Native Elements" },
                    { id: "mb_task_3", name: "Thiết kế layout UI di động sử dụng View, Text, StyleSheet và Flexbox" }
                ]
            },
            {
                number: 2,
                title: "Navigation, Storage & Device Features",
                duration: "Tuần 5 - Tuần 8",
                tasks: [
                    { id: "mb_task_4", name: "Cấu hình chuyển trang phức tạp với React Navigation (Stack, Tab, Drawer)" },
                    { id: "mb_task_5", name: "Lưu trữ dữ liệu offline cục bộ bằng Async Storage hoặc SQLite" },
                    { id: "mb_task_6", name: "Truy cập các API phần cứng (Camera, GPS Location, Push Notifications)" }
                ]
            },
            {
                number: 3,
                title: "Tối ưu hiệu năng & Phát hành lên App Store/CH Play",
                duration: "Tuần 9 - Tuần 12",
                tasks: [
                    { id: "mb_task_7", name: "Tối ưu hóa thời gian tải hình ảnh, FlatList cuộn mượt mà" },
                    { id: "mb_task_8", name: "Tích hợp dịch vụ Firebase Auth & Firestore Database" },
                    { id: "mb_task_9", name: "Đóng gói ứng dụng thành file APK/AAB (Android) & IPA (iOS) qua Expo EAS Build" }
                ]
            }
        ]
    },
    "data-analyst": {
        title: "Lộ trình trở thành nhà Phân Tích Dữ Liệu",
        subtitle: "Thu thập, làm sạch, phân tích thống kê và trực quan hóa dữ liệu để ra quyết định kinh doanh",
        duration: "10 Tuần",
        stages: [
            {
                number: 1,
                title: "Ngôn ngữ truy vấn SQL & Python căn bản",
                duration: "Tuần 1 - Tuần 4",
                tasks: [
                    { id: "da_task_1", name: "Viết truy vấn SQL lọc dữ liệu phức tạp (JOINs, Subqueries, Window Functions)" },
                    { id: "da_task_2", name: "Học Python cho khoa học dữ liệu (Biến, Loop, Function, Lists)" },
                    { id: "da_task_3", name: "Sử dụng thư viện Pandas & Numpy để xử lý và làm sạch dữ liệu khuyết thiếu" }
                ]
            },
            {
                number: 2,
                title: "Khám phá trực quan hóa dữ liệu",
                duration: "Tuần 5 - Tuần 7",
                tasks: [
                    { id: "da_task_4", name: "Vẽ biểu đồ phân tích xu hướng bằng Matplotlib & Seaborn" },
                    { id: "da_task_5", name: "Xử lý dữ liệu định tính và định lượng bằng thống kê mô tả (Descriptive Statistics)" },
                    { id: "da_task_6", name: "Xây dựng Dashboard kéo thả tương tác chuyên nghiệp bằng PowerBI / Tableau" }
                ]
            },
            {
                number: 3,
                title: "Kỹ năng Báo cáo kinh doanh & Portfolio",
                duration: "Tuần 8 - Tuần 10",
                tasks: [
                    { id: "da_task_7", name: "Khai phá dữ liệu kinh doanh thực tế (A/B testing, Marketing Metrics)" },
                    { id: "da_task_8", name: "Cách trình bày kết quả phân tích bằng dữ liệu trực quan (Data Storytelling)" },
                    { id: "da_task_9", name: "Đăng tải các Notebook lên Kaggle & GitHub để chứng minh năng lực" }
                ]
            }
        ]
    },
    "ai-ml": {
        title: "Lộ trình AI / Machine Learning Engineer",
        subtitle: "Nghiên cứu các thuật toán Học máy, Học sâu và ứng dụng các mô hình ngôn ngữ lớn (LLMs)",
        duration: "16 Tuần",
        stages: [
            {
                number: 1,
                title: "Toán học & Machine Learning cơ bản",
                duration: "Tuần 1 - Tuần 6",
                tasks: [
                    { id: "ai_task_1", name: "Lập trình Python chuyên sâu và toán cho ML (Đại số tuyến tính, Giải tích, Xác suất)" },
                    { id: "ai_task_2", name: "Thuật toán học có giám sát: Linear Regression, Decision Trees, SVM" },
                    { id: "ai_task_3", name: "Thuật toán học không giám sát: K-Means Clustering, PCA giảm chiều dữ liệu" }
                ]
            },
            {
                number: 2,
                title: "Deep Learning & Mạng Nơ-ron Nhân tạo",
                duration: "Tuần 7 - Tuần 11",
                tasks: [
                    { id: "ai_task_4", name: "Xây dựng Mạng Nơ-ron bằng thư viện PyTorch hoặc TensorFlow" },
                    { id: "ai_task_5", name: "Xử lý ảnh số với Mạng Nơ-ron Tích chập (CNN) và Transfer Learning" },
                    { id: "ai_task_6", name: "Xử lý ngôn ngữ tự nhiên (NLP) với Mạng RNN, LSTM và Attention Mechanism" }
                ]
            },
            {
                number: 3,
                title: "Kiến trúc Transformer, LLMs & Generative AI",
                duration: "Tuần 12 - Tuần 16",
                tasks: [
                    { id: "ai_task_7", name: "Tìm hiểu cơ chế Transformer & sử dụng các mô hình HuggingFace pre-trained" },
                    { id: "ai_task_8", name: "Fine-tuning mô hình ngôn ngữ lớn (LLMs) bằng kỹ thuật LoRA / QLoRA" },
                    { id: "ai_task_9", name: "Xây dựng ứng dụng RAG (Retrieval-Augmented Generation) với Vector Database (Pinecone/Chroma)" }
                ]
            }
        ]
    }
};

// QUIZ BANK
const QUIZ_BANK = {
    frontend: [
        {
            q: "Để căn giữa một phần tử con theo cả chiều dọc và chiều ngang bên trong một thẻ cha có thuộc tính display: flex, ta sử dụng các thuộc tính nào?",
            options: [
                "align-items: center; justify-content: center;",
                "text-align: center; vertical-align: middle;",
                "position: absolute; margin: auto;",
                "display: block; margin: auto;"
            ],
            correct: 0,
            expl: "Trong Flexbox CSS, 'justify-content: center' căn giữa theo chiều ngang (trục chính) và 'align-items: center' căn giữa theo chiều dọc (trục chéo)."
        },
        {
            q: "Trong ReactJS, Hook 'useEffect' không có dependency array (useEffect(() => { ... })) sẽ chạy vào khi nào?",
            options: [
                "Chỉ chạy duy nhất một lần sau khi component mount đầu tiên.",
                "Chạy mỗi lần component re-render (cập nhật).",
                "Không bao giờ chạy.",
                "Chỉ chạy trước khi component unmount."
            ],
            correct: 1,
            expl: "Nếu không truyền mảng phụ thuộc (dependency array), useEffect sẽ chạy ở mỗi lần component render/re-render."
        },
        {
            q: "Khai báo biến nào sau đây trong Javascript ES6 KHÔNG thể gán lại giá trị mới sau khi đã khởi tạo?",
            options: [
                "var",
                "let",
                "const",
                "Cả let và const"
            ],
            correct: 2,
            expl: "Biến khai báo bằng từ khóa 'const' là hằng số và không thể gán lại giá trị mới (tuy nhiên đối với Array/Object thì thuộc tính bên trong vẫn có thể sửa đổi)."
        },
        {
            q: "Gói NPM nào thường được sử dụng phổ biến nhất để quản lý Routing trong ứng dụng ReactJS đa trang?",
            options: [
                "React Router DOM",
                "React Redux",
                "Axios",
                "Next Router"
            ],
            correct: 0,
            expl: "React Router DOM là thư viện tiêu chuẩn để định tuyến các component tương ứng với URL trên trình duyệt trong các dự án React SPA."
        },
        {
            q: "Trong lập trình giao diện, thuộc tính CSS 'box-sizing: border-box' có tác dụng gì?",
            options: [
                "Giới hạn viền của phần tử tròn lại.",
                "Bao gồm cả padding và border vào kích thước chiều rộng (width) và chiều cao (height) tổng thể của phần tử.",
                "Loại bỏ hoàn toàn viền ngoài của khối.",
                "Chỉ áp dụng viền mà không có khoảng đệm."
            ],
            correct: 1,
            expl: "Với 'border-box', kích thước hiển thị của khối luôn bằng giá trị width/height đã đặt, do padding và border được cộng gộp vào bên trong thay vì phình to ra."
        }
    ],
    backend: [
        {
            q: "Phương thức HTTP nào được khuyến nghị sử dụng khi muốn cập nhật MỘT PHẦN dữ liệu của một tài nguyên hiện có trên Server?",
            options: [
                "PUT",
                "POST",
                "PATCH",
                "GET"
            ],
            correct: 2,
            expl: "Phương thức PATCH được thiết kế cho việc cập nhật một phần tài nguyên, trong khi PUT thường dùng để thay thế toàn bộ tài nguyên bằng dữ liệu mới."
        },
        {
            q: "Middleware trong ExpressJS là gì?",
            options: [
                "Là cơ sở dữ liệu lưu trữ tạm thời của server.",
                "Là các hàm có quyền truy cập vào đối tượng request (req), response (res) và hàm middleware tiếp theo (next) trong vòng đời request-response.",
                "Là giao diện người dùng để tương tác với backend.",
                "Là công cụ biên dịch mã nguồn Javascript sang mã máy."
            ],
            correct: 1,
            expl: "Middleware trong Express là các trung gian xử lý request trước khi phản hồi về client, có thể dùng để kiểm tra đăng nhập, log thông tin, parse dữ liệu..."
        },
        {
            q: "Cơ sở dữ liệu MongoDB thuộc nhóm cơ sở dữ liệu nào dưới đây?",
            options: [
                "Cơ sở dữ liệu quan hệ (RDBMS)",
                "Cơ sở dữ liệu hướng tài liệu (NoSQL Document-oriented)",
                "Cơ sở dữ liệu dạng đồ thị (Graph)",
                "Cơ sở dữ liệu dạng Key-Value thuần túy"
            ],
            correct: 1,
            expl: "MongoDB lưu trữ dữ liệu dưới dạng các tài liệu BSON (gần giống JSON) và được xếp vào lớp NoSQL Document Database."
        },
        {
            q: "Để lưu trữ phiên đăng nhập của người dùng một cách an toàn mà không cần lưu trạng thái trên Server (Stateless), ta dùng cơ chế nào?",
            options: [
                "Cookies Session",
                "JSON Web Token (JWT)",
                "Basic Authentication",
                "OAuth 1.0"
            ],
            correct: 1,
            expl: "JWT mã hóa thông tin người dùng thành một chuỗi mã chữ-số tự kiểm chứng bằng chữ ký mật, giúp server không cần lưu session trong bộ nhớ RAM."
        },
        {
            q: "Mục đích chính của việc tạo Index (chỉ mục) trên một cột trong bảng Cơ sở dữ liệu SQL là gì?",
            options: [
                "Để mã hóa dữ liệu cột tránh bị hack.",
                "Để tự động điền giá trị cho cột khi insert.",
                "Để tăng tốc độ tìm kiếm và truy vấn dữ liệu từ bảng.",
                "Để liên kết bảng đó với bảng khác."
            ],
            correct: 2,
            expl: "Index hoạt động giống như mục lục sách, giúp hệ quản trị CSDL tìm thấy dòng dữ liệu nhanh chóng mà không cần quét toàn bộ bảng (Table Scan)."
        }
    ],
    fullstack: [
        {
            q: "Lỗi CORS (Cross-Origin Resource Sharing) xuất hiện khi nào?",
            options: [
                "Khi code server NodeJS bị lỗi cú pháp.",
                "Khi trình duyệt của client chặn request gọi API từ một domain khác với domain hiện tại của trang web mà không được server cho phép rõ ràng.",
                "Khi kết nối internet bị gián đoạn.",
                "Khi cơ sở dữ liệu SQL bị khóa kết nối."
            ],
            correct: 1,
            expl: "CORS là cơ chế bảo mật của trình duyệt nhằm ngăn chặn mã độc gửi request lấy trộm thông tin từ domain lạ, đòi hỏi server phải cấu hình cho phép tên miền của client truy cập."
        },
        {
            q: "Trong Docker, file 'Dockerfile' dùng để làm gì?",
            options: [
                "Để lưu cơ sở dữ liệu của ứng dụng.",
                "Để mô tả các câu lệnh xây dựng (build) nên một Docker Image tùy chỉnh.",
                "Để lập cấu hình môi trường deploy tự động lên cloud.",
                "Để viết mã nguồn chạy cho backend."
            ],
            correct: 1,
            expl: "Dockerfile là tệp văn bản chứa chuỗi các chỉ dẫn (FROM, RUN, COPY, CMD...) để Docker tự động đóng gói ứng dụng thành một Docker Image."
        },
        {
            q: "Cơ chế Rendering SSR (Server-Side Rendering) của Next.js mang lại lợi ích lớn nhất gì so với CSR (Client-Side Rendering) thông thường?",
            options: [
                "Giúp code frontend chạy nhanh hơn trên trình duyệt.",
                "Tối ưu SEO tốt hơn do HTML được sinh sẵn ở server kèm nội dung đầy đủ để bot tìm kiếm dễ quét.",
                "Không cần viết server API nữa.",
                "Hạn chế hoàn toàn các lỗi bảo mật JavaScript."
            ],
            correct: 1,
            expl: "Nhờ SSR, trang web tải về trình duyệt đã chứa sẵn nội dung hiển thị thay vì một thẻ div rỗng, giúp các công cụ tìm kiếm (như Google) dễ dàng index bài viết, cải thiện vị trí tìm kiếm."
        },
        {
            q: "Giao thức WebSocket khác biệt thế nào so với HTTP thông thường?",
            options: [
                "WebSocket chỉ dùng để gửi file ảnh.",
                "WebSocket thiết lập kết nối hai chiều toàn song công (full-duplex) liên tục giữa client và server, thích hợp cho ứng dụng thời gian thực.",
                "WebSocket là giao thức không bảo mật bằng HTTP.",
                "WebSocket luôn chạy chậm hơn HTTP."
            ],
            correct: 1,
            expl: "HTTP tuân theo mô hình Request-Response (Client yêu cầu mới nhận phản hồi), còn WebSocket duy trì kết nối mở giúp cả hai bên có thể tự động đẩy dữ liệu cho nhau bất cứ lúc nào."
        },
        {
            q: "Công cụ ORM (như Prisma hay Sequelize) làm nhiệm vụ gì trong dự án Fullstack?",
            options: [
                "Thiết kế giao diện đẹp hơn.",
                "Ánh xạ các bảng cơ sở dữ liệu quan hệ sang đối tượng code trong ngôn ngữ lập trình, giúp tương tác dữ liệu không cần viết SQL thuần.",
                "Thay thế hoàn toàn database vật lý.",
                "Nén dung lượng ảnh tải lên hệ thống."
            ],
            correct: 1,
            expl: "Object-Relational Mapping (ORM) giúp lập trình viên thao tác với dữ liệu bằng các cú pháp đối tượng quen thuộc của ngôn ngữ lập trình (như Javascript/Python) thay vì viết các câu lệnh SELECT/INSERT phức tạp."
        }
    ],
    default: [
        {
            q: "Đâu là từ khóa khai báo biến trong JavaScript hiện đại (ES6)?",
            options: ["var", "let", "define", "dim"],
            correct: 1,
            expl: "JavaScript ES6 giới thiệu từ khóa 'let' và 'const' để khai báo biến có phạm vi khối (block scope), thay thế cho 'var'."
        },
        {
            q: "Giao thức mạng truyền tải siêu văn bản an toàn trên Web là?",
            options: ["HTTP", "FTP", "HTTPS", "SMTP"],
            correct: 2,
            expl: "HTTPS là phiên bản an toàn của HTTP, được mã hóa dữ liệu truyền tải bằng giao thức bảo mật SSL/TLS."
        },
        {
            q: "Hệ quản trị cơ sở dữ liệu quan hệ phổ biến là?",
            options: ["Redis", "PostgreSQL", "MongoDB", "Cassandra"],
            correct: 1,
            expl: "PostgreSQL là một hệ quản trị cơ sở dữ liệu quan hệ đối tượng mã nguồn mở rất mạnh mẽ và phổ biến."
        },
        {
            q: "Thư viện điều khiển giao diện phổ biến của Facebook viết bằng JavaScript là?",
            options: ["Angular", "VueJS", "ReactJS", "Svelte"],
            correct: 2,
            expl: "ReactJS là thư viện JavaScript dùng để xây dựng giao diện người dùng, được phát triển và duy trì bởi Meta (Facebook)."
        },
        {
            q: "Lệnh Git nào dùng để sao chép một kho chứa từ xa về máy cục bộ?",
            options: ["git clone", "git push", "git pull", "git init"],
            correct: 0,
            expl: "Lệnh 'git clone' sao chép toàn bộ mã nguồn cùng lịch sử commit của kho chứa trên server (như GitHub) về máy tính cá nhân."
        }
    ]
};

// CHATBOT RESPONSES
const CHATBOT_RESPONSES = {
    api: "Một **API (Application Programming Interface - Giao diện lập trình ứng dụng)** là cầu nối cho phép 2 phần mềm giao tiếp với nhau. Ví dụ: Khi bạn mở ứng dụng đặt xe, ứng dụng sẽ gọi API của Google Maps để lấy dữ liệu bản đồ hiển thị lên màn hình. API hoạt động theo chu trình: Request (yêu cầu) gửi đi từ Client -> Server xử lý -> Response (phản hồi) gửi về kèm dữ liệu (thường dạng JSON).",
    
    react: "ReactJS là thư viện Javascript xây dựng giao diện người dùng. Nó hoạt động dựa trên cơ chế: \n1. **Component-based**: Chia nhỏ UI thành các khối độc lập có thể tái sử dụng.\n2. **Virtual DOM**: Cập nhật giao diện ảo trước, chỉ render lại phần thay đổi trên giao diện thật để tăng tốc độ.\n3. **Hooks (React 16.8+)**: Giúp functional component quản lý được trạng thái (state) và vòng đời (lifecycle).",
    
    "lộ trình": "Để tự học lập trình hiệu quả, bạn nên tuân thủ quy trình 4 bước:\n1. **Xác định mục tiêu rõ ràng**: Chọn hướng đi cụ thể (Web, Mobile, Data...) thay vì học lan man.\n2. **Tập trung học nền tảng**: Đừng vội học framework lớn, hãy vững ngôn ngữ gốc (HTML/CSS/JS cho Web, Python cho Data).\n3. **Học qua dự án thực hành**: Code các project nhỏ ngay sau mỗi bài học (đọc code 10 lần không bằng tự tay viết 1 lần).\n4. **Sử dụng Git/GitHub**: Lưu trữ code hàng ngày để theo dõi tiến trình và làm đẹp portfolio.",
    
    "nextjs": "Next.js là một React Framework mạnh mẽ hỗ trợ **Server-Side Rendering (SSR)** và **Static Site Generation (SSG)**. Khác với React thuần chạy hoàn toàn ở trình duyệt (CSR), Next.js tải sẵn nội dung HTML từ server, mang lại trải nghiệm tải trang ban đầu cực nhanh và cải thiện đáng kể điểm SEO cho website.",
    
    "nodejs": "Để kết nối cơ sở dữ liệu SQL với NodeJS, bạn thực hiện qua các bước:\n1. Cài đặt driver phù hợp qua NPM (ví dụ: `npm install pg` cho PostgreSQL, hoặc `mysql2` cho MySQL).\n2. Import thư viện vào code và tạo một **Connection Pool** chứa thông tin kết nối (Host, User, Password, Database Name, Port).\n3. Dùng lệnh `pool.query('SELECT * FROM table')` để gửi câu lệnh SQL từ NodeJS sang cơ sở dữ liệu và nhận kết quả.\n\n*Khuyên dùng:* Sử dụng các thư viện ORM như **Prisma** hoặc **Sequelize** để thao tác CSDL bằng hàm Javascript thay vì viết lệnh SQL thủ công, giúp code an toàn và dễ bảo trì hơn.",
    
    "project": "Đối với người học lập trình Web ReactJS, đây là 3 dự án cực tốt để rèn luyện tay nghề và đưa vào CV xin việc:\n1. **Dự án Todolist/Notes nâng cao**: Giúp luyện kỹ năng quản lý trạng thái phức tạp, lưu dữ liệu LocalStorage.\n2. **Dự án Đọc tin tức/Thời tiết kết nối REST API**: Luyện kỹ năng gọi API bất đồng bộ với Fetch/Axios, quản lý trạng thái loading, error.\n3. **Dự án Web Bán hàng mini**: Luyện kỹ năng quản lý giỏ hàng toàn cục, phân trang, bộ lọc sản phẩm nâng cao.",
    
    "chào": "Xin chào! Mình là Trợ lý Học tập AI. Bạn có câu hỏi nào cần mình giải đáp liên quan đến lộ trình học tập, giải thích code hay tìm kiếm tài liệu không?",
    
    "cảm ơn": "Rất vui được hỗ trợ bạn! Hãy cố gắng học tập đều đặn hàng ngày nhé, lộ trình học tập của bạn đang tiến triển rất tốt đấy!",
    
    default: "Câu hỏi của bạn rất thú vị! Để giải đáp chi tiết nhất, bạn có thể nói rõ hơn bạn đang gặp vướng mắc cụ thể ở đoạn code nào không? Ngoài ra, dựa trên định hướng học tập của bạn, mình đề xuất bạn nên tham khảo thêm các tài liệu chính thống tại **MDN Web Docs** hoặc trang chủ của công nghệ đó để nắm chắc lý thuyết nhé."
};


module.exports = { INITIAL_DATABASE, ROADMAP_TEMPLATES, QUIZ_BANK, CHATBOT_RESPONSES };
