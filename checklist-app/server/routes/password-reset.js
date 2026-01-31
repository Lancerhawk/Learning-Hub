import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../db.js';
import { sendPasswordResetEmail } from '../services/email.js';
import { passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Request password reset - with rate limiting
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        // Always return success to prevent email enumeration
        if (result.rows.length === 0) {
            return res.json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        const user = result.rows[0];

        // Generate reset token (plain text for email)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before storing in database for security
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save HASHED token to database
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
            [hashedToken, resetTokenExpires, user.id]
        );

        // Send email with PLAIN token (user needs this to reset password)
        try {
            await sendPasswordResetEmail(user.email, resetToken, user.username);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({
                error: 'Failed to send password reset email. Please try again later.'
            });
        }

        res.json({
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        // Specific password validation with detailed errors
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Check for uppercase
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
        }

        // Check for lowercase
        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
        }

        // Check for number
        if (!/\d/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one number' });
        }

        // Check for special character
        if (!/[@$!%*?&]/.test(newPassword)) {
            return res.status(400).json({ error: 'Password must contain at least one special character (@$!%*?&)' });
        }

        // Hash the incoming token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid reset token (compare hashed token)
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [hashedToken]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const user = result.rows[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify reset token (optional - for frontend to check if token is valid before showing form)
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Hash the incoming token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const result = await pool.query(
            'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [hashedToken]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ valid: false, error: 'Invalid or expired reset token' });
        }

        res.json({ valid: true });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
