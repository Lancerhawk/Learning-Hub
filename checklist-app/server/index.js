import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listsRouter from './routes/lists.js';
import sectionsRouter from './routes/sections.js';
import topicsRouter from './routes/topics.js';
import resourcesRouter from './routes/resources.js';
import progressRouter from './routes/progress.js';
import authRouter from './routes/auth.js';
import publicListsRouter from './routes/public-lists.js';
import passwordResetRouter from './routes/password-reset.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// HTTPS enforcement for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// CORS - Restrict to specific origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Custom Lists API is running' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/password', passwordResetRouter);
app.use('/api/public-lists', publicListsRouter);
app.use('/api/custom-lists', listsRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/progress', progressRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: { message: 'Route not found', status: 404 } });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
