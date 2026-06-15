// Trigger restart to load .env variables
const express = require('express');
const cors = require('cors');

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS and parsing of JSON request bodies
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const chatbotRoutes = require('./routes/chatbot');
const adminRoutes = require('./routes/admin');
const roadmapRoutes = require('./routes/roadmap');

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Initialize Database
async function initDatabase() {
    try {
        // We need a connection WITHOUT a specific database to create it first
        const rootConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        // Initialize Database safely without dropping it
        console.log("Connecting to MySQL to verify database...");
        
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaQuery = fs.readFileSync(schemaPath, 'utf8');
        
        await rootConn.query(schemaQuery);
        console.log("Database initialized successfully from schema.sql.");
        await rootConn.end();
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

// Start express server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
