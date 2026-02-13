import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';
import disposableDomains from 'disposable-email-domains' with { type: 'json' };
import { sendVerificationOTP } from '../services/email.js';


const router = express.Router();

// Validation rules
const signupValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address')
        .custom((value) => {
            const domain = value.split('@')[1];
            if (disposableDomains.includes(domain)) {
                throw new Error('Disposable email addresses are not allowed');
            }
            return true;
        }),
    body('username')
        .isLength({ min: 3, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
        .withMessage('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character'),
];

const loginValidation = [
    body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// POST /api/auth/signup
router.post('/signup', authLimiter, signupValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id, email_verified FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create user with email_verified = false
        const result = await pool.query(
            `INSERT INTO users (email, username, password_hash, email_verified, email_otp, email_otp_expires, email_otp_attempts) 
             VALUES ($1, $2, $3, FALSE, $4, $5, 0) 
             RETURNING id, email, username, created_at`,
            [email, username, passwordHash, otp, otpExpires]
        );

        const user = result.rows[0];

        // Send OTP email
        try {
            await sendVerificationOTP(email, otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // Don't fail signup if email fails, user can resend
        }

        res.status(201).json({
            message: 'Account created. Please verify your email.',
            userId: user.id,
            email: user.email,
            requiresVerification: true,
            emailSent: true
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// POST /api/auth/verify-email
router.post('/verify-email', otpLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        // Find user by email
        const result = await pool.query(
            'SELECT id, email, username, email_verified, email_otp, email_otp_expires, email_otp_attempts FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Check if OTP exists
        if (!user.email_otp) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        // Check if OTP expired
        if (new Date() > new Date(user.email_otp_expires)) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        // Check attempts
        if (user.email_otp_attempts >= 3) {
            return res.status(429).json({ error: 'Too many failed attempts. Please request a new OTP.' });
        }

        // Verify OTP
        if (user.email_otp !== otp) {
            // Increment attempts
            await pool.query(
                'UPDATE users SET email_otp_attempts = email_otp_attempts + 1 WHERE id = $1',
                [user.id]
            );
            return res.status(400).json({
                error: 'Invalid OTP',
                attemptsRemaining: 3 - (user.email_otp_attempts + 1)
            });
        }

        // OTP is correct - verify email and clear OTP fields
        await pool.query(
            'UPDATE users SET email_verified = TRUE, email_otp = NULL, email_otp_expires = NULL, email_otp_attempts = 0 WHERE id = $1',
            [user.id]
        );

        // Generate new token with verified status
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
                emailVerified: true
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                emailVerified: true
            }
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Failed to verify email' });
    }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', otpLimiter, [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Find user by email
        const result = await pool.query(
            'SELECT id, email, email_verified FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Update user with new OTP and reset attempts
        await pool.query(
            'UPDATE users SET email_otp = $1, email_otp_expires = $2, email_otp_attempts = 0 WHERE id = $3',
            [otp, otpExpires, user.id]
        );

        // Send OTP email
        try {
            await sendVerificationOTP(email, otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        res.json({
            message: 'OTP sent successfully',
            emailSent: true
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

// POST /api/auth/migrate-signup-progress
// Called immediately after email verification for NEW users to migrate localStorage
router.post('/migrate-signup-progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if already migrated
        const userCheck = await pool.query(
            'SELECT has_migrated_localstorage FROM users WHERE id = $1',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userCheck.rows[0].has_migrated_localstorage) {
            return res.status(400).json({
                error: 'Progress already migrated'
            });
        }

        // Receive localStorage data from frontend
        const { checklists } = req.body; // Array of {type, id, items}

        if (!checklists || !Array.isArray(checklists) || checklists.length === 0) {
            // No data to migrate, just mark as migrated
            await pool.query(
                'UPDATE users SET has_migrated_localstorage = TRUE WHERE id = $1',
                [userId]
            );
            return res.json({
                message: 'No progress to migrate',
                migratedCount: 0
            });
        }

        console.log(`[Migration] User ${userId} migrating ${checklists.length} checklists from localStorage`);

        // Validate and process each checklist
        const validTypes = ['language_dsa', 'language_dev', 'dsa_topics', 'examination'];
        let totalInserted = 0;

        for (const checklist of checklists) {
            const { type, id, items } = checklist;

            if (!type || !id || !items || typeof items !== 'object') {
                console.warn(`[Migration] Skipping invalid checklist: ${JSON.stringify(checklist)}`);
                continue;
            }

            if (!validTypes.includes(type)) {
                console.warn(`[Migration] Invalid type: ${type}`);
                continue;
            }

            // Insert each item
            const itemKeys = Object.keys(items).filter(key => items[key] === true);

            for (const itemKey of itemKeys) {
                try {
                    await pool.query(
                        `INSERT INTO builtin_progress (user_id, checklist_type, checklist_id, item_key, completed, completed_at)
                         VALUES ($1::uuid, $2, $3, $4, TRUE, NOW())
                         ON CONFLICT (user_id, checklist_type, checklist_id, item_key) 
                         DO UPDATE SET completed = TRUE, completed_at = NOW()`,
                        [userId, type, id, itemKey]
                    );
                    totalInserted++;
                } catch (insertError) {
                    console.error(`[Migration] Failed to insert ${type}/${id}/${itemKey}:`, insertError);
                }
            }
        }

        // Mark as migrated
        await pool.query(
            'UPDATE users SET has_migrated_localstorage = TRUE WHERE id = $1',
            [userId]
        );

        console.log(`[Migration] Successfully migrated ${totalInserted} items for user ${userId}`);

        res.json({
            message: 'Progress migrated successfully',
            migratedCount: totalInserted
        });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ error: 'Failed to migrate progress' });
    }
});


// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { emailOrUsername, password } = req.body;

        // Find user by email or username - include email_verified
        const result = await pool.query(
            'SELECT id, email, username, password_hash, email_verified, created_at FROM users WHERE email = $1 OR username = $1',
            [emailOrUsername]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
                emailVerified: user.email_verified
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                emailVerified: user.email_verified,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, username, email_verified, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                emailVerified: user.email_verified,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// POST /api/auth/logout (client-side only, just for consistency)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

export default router;
