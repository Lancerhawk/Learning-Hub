import jwt from 'jsonwebtoken';

// Validate JWT_SECRET on startup
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Application cannot start.');
}

if (process.env.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long for security.');
}

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user info to request
        req.user = {
            id: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Optional auth - doesn't fail if no token
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = {
                id: decoded.userId,
                username: decoded.username,
                email: decoded.email
            };
        }
    } catch (error) {
        // Ignore errors for optional auth
    }
    next();
};

export { authMiddleware, optionalAuth, JWT_SECRET };
