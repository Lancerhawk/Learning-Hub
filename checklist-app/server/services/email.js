import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} username - User's username
 */
export async function sendPasswordResetEmail(to, resetToken, username) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const msg = {
        to,
        from: process.env.FROM_EMAIL,
        subject: 'Password Reset Request - DSA Learning Checklist',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #0f172a;
                        color: #e2e8f0;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #1e293b;
                        border: 2px solid #22c55e;
                        border-radius: 8px;
                        padding: 40px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #22c55e;
                        font-size: 28px;
                        margin: 0;
                        font-family: 'Courier New', monospace;
                    }
                    .content {
                        line-height: 1.6;
                        color: #cbd5e1;
                    }
                    .button {
                        display: inline-block;
                        background-color: #22c55e;
                        color: #0f172a;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                        margin: 20px 0;
                        font-family: 'Courier New', monospace;
                    }
                    .button:hover {
                        background-color: #16a34a;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #334155;
                        font-size: 12px;
                        color: #64748b;
                        text-align: center;
                    }
                    .code {
                        background-color: #334155;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-family: 'Courier New', monospace;
                        color: #22c55e;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>&gt; Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hello <span class="code">${username}</span>,</p>
                        <p>We received a request to reset your password for your DSA Learning Checklist account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background-color: #334155; padding: 10px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 12px;">
                            ${resetUrl}
                        </p>
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DSA Learning Checklist. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Hello ${username},

We received a request to reset your password for your DSA Learning Checklist account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
This is an automated email from DSA Learning Checklist.
        `
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        if (error.response) {
            console.error('SendGrid error:', error.response.body);
        }
        throw new Error('Failed to send password reset email');
    }
}
