const express = require('express');
const router = express.Router();
const { pool, logActivity } = require('../helpers/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            await logActivity(`Đăng nhập thất bại cho email: '${email}'`, "warning");
            return res.status(401).json({ error: "Email hoặc mật khẩu không chính xác!" });
        }

        const user = rows[0];
        
        // Verify password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await logActivity(`Đăng nhập thất bại cho email: '${email}' (sai mật khẩu)`, "warning");
            return res.status(401).json({ error: "Email hoặc mật khẩu không chính xác!" });
        }
        
        // --- Streak & Login History Logic ---
        const today = new Date();
        // Adjust for timezone if needed, here we use local date string roughly by taking timezone offset
        const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        let newStreak = user.streak_count || 0;
        let loginHistory = user.login_history ? JSON.parse(user.login_history) : [];
        
        let lastLoginDate = user.last_login_date ? new Date(user.last_login_date) : null;
        const lastLoginStr = lastLoginDate ? new Date(lastLoginDate.getTime() - (lastLoginDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : null;

        if (lastLoginStr !== todayStr) {
            if (lastLoginStr) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                
                if (lastLoginStr === yesterdayStr) {
                    newStreak += 1;
                } else {
                    newStreak = 1; // reset streak
                }
            } else {
                newStreak = 1; // first time login
            }
            
            if (!loginHistory.includes(todayStr)) {
                loginHistory.push(todayStr);
                // Keep only last 30 days
                if (loginHistory.length > 30) loginHistory = loginHistory.slice(-30);
            }
            
            await pool.query('UPDATE users SET streak_count = ?, last_login_date = ?, login_history = ? WHERE id = ?', 
                [newStreak, todayStr, JSON.stringify(loginHistory), user.id]);
        }
        // ------------------------------------

        // Let's format the user object to match the frontend expectations
        // Goal needs to be fetched
        const [goalRows] = await pool.query('SELECT * FROM goals WHERE user_id = ?', [user.id]);
        let goal = null;
        if (goalRows.length > 0) {
            goal = {
                title: goalRows[0].title,
                career: goalRows[0].career,
                level: goalRows[0].level,
                time: goalRows[0].time
            };
        }

        const [taskRows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [user.id]);
        
        const returnUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            progress: user.progress,
            quizzesTaken: user.quizzes_taken,
            goal: goal,
            tasks: taskRows.map(t => ({
                id: t.id,
                name: t.name,
                stage: t.stage,
                completed: t.completed ? true : false
            })),
            streakCount: newStreak,
            loginHistory: loginHistory
        };

        // Create JWT payload
        const payload = {
            id: user.id,
            role: user.role
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'ai_learning_assistant_secret_123',
            { expiresIn: 360000 }, // 100 hours
            async (err, token) => {
                if (err) throw err;
                await logActivity(`Người dùng '${user.name}' đăng nhập thành công.`, "success");
                res.json({ token, user: returnUser });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: "Email này đã được đăng ký sử dụng!" });
        }

        const newId = "usr_" + Date.now();
        
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (id, name, email, password, role, progress, quizzes_taken) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newId, name, email, hashedPassword, 'user', 0, 0]
        );

        const newUser = {
            id: newId,
            name,
            email,
            role: "user",
            goal: null,
            progress: 0,
            quizzesTaken: 0,
            tasks: [],
            streakCount: 0,
            loginHistory: []
        };

        // Create JWT payload
        const payload = {
            id: newId,
            role: "user"
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'ai_learning_assistant_secret_123',
            { expiresIn: 360000 },
            async (err, token) => {
                if (err) throw err;
                await logActivity(`Đăng ký thành công tài khoản mới: '${name}' (${email})`, "success");
                res.status(201).json({ success: true, token, user: newUser });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

module.exports = router;
