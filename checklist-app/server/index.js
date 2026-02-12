import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listsRoutes from './routes/lists.js';
import sectionsRoutes from './routes/sections.js';
import topicsRoutes from './routes/topics.js';
import resourcesRoutes from './routes/resources.js';
import progressRoutes from './routes/progress.js';
import authRoutes from './routes/auth.js';
import publicListsRoutes from './routes/public-lists.js';
import passwordResetRoutes from './routes/password-reset.js';
import builtinProgressRoutes from './routes/builtin-progress.js';


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
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordResetRoutes);
app.use('/api/public-lists', publicListsRoutes);
app.use('/api/custom-lists', listsRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/builtin-progress', builtinProgressRoutes);


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
