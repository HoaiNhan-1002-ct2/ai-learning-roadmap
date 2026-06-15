CREATE DATABASE IF NOT EXISTS eduai_planner;
USE eduai_planner;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    progress INT DEFAULT 0,
    quizzes_taken INT DEFAULT 0,
    avatar LONGTEXT,
    bio TEXT,
    streak_count INT DEFAULT 0,
    last_login_date DATE,
    login_history TEXT
);

CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255),
    career VARCHAR(100),
    level VARCHAR(50),
    time VARCHAR(50),
    roadmap_json TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(100),
    user_id VARCHAR(50),
    name VARCHAR(255),
    stage INT,
    completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    time VARCHAR(50),
    level VARCHAR(20),
    text TEXT
);

-- Insert a default admin account so you can log into the Admin panel
INSERT IGNORE INTO users (id, name, email, password, role) 
VALUES ('admin_root', 'Super Admin', 'admin@eduai.com', '$2b$10$j.LkZKTQWgI8BihGO.J28.CW3kKHdF/WgwDTY9V8sh/zAqFwOjdeu', 'admin');

CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) DEFAULT 'Cuộc trò chuyện mới',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
