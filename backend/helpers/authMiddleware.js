const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided." });

    const bearer = token.split(' ')[1]; // Expecting "Bearer <token>"
    if (!bearer) return res.status(403).json({ error: "Invalid token format." });

    jwt.verify(bearer, process.env.JWT_SECRET || 'ai_learning_assistant_secret_123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Failed to authenticate token." });
        }
        req.userId = decoded.id; // Save user id to request for use in other routes
        next();
    });
}

module.exports = verifyToken;
