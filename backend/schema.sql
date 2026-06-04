CREATE DATABASE IF NOT EXISTS eduai_planner;
USE eduai_planner;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    progress INT DEFAULT 0,
    quizzes_taken INT DEFAULT 0
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
VALUES ('admin_root', 'Super Admin', 'admin@eduai.com', '123456', 'admin');
