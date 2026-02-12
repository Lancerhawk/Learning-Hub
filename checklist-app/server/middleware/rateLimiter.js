import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints (login, signup)
 * Limits: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many authentication attempts. Please try again after 10 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many authentication attempts. Please try again after 10 minutes.',
            retryAfter: '10 minutes'
        });
    }
});

/**
 * Rate limiter for password reset requests
 * Limits: 3 requests per 30 minutes per IP
 * More restrictive to prevent abuse
 */
export const passwordResetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many password reset requests. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many password reset requests. Please try again after 10 minutes.',
            retryAfter: '10 minutes'
        });
    }
});

/**
 * Rate limiter for OTP requests (send/resend)
 * Limits: 5 requests per 10 minutes per IP
 */
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 OTP requests per windowMs
    message: {
        error: 'Too many OTP requests. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many OTP requests. Please try again after 10 minutes.',
            retryAfter: '10 minutes'
        });
    }
});

/**
 * Rate limiter for list creation
 * Limits: 10 lists per 30 minutes per IP
 */
export const listCreationLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 10, // Limit each IP to 10 list creations per windowMs
    message: {
        error: 'Too many lists created. Please try again after 30 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many lists created. Please try again after 30 minutes.',
            retryAfter: '30 minutes'
        });
    }
});

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 * Applied to all API routes as a safety net
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests from this IP. Please try again after 15 minutes.',
            retryAfter: '15 minutes'
        });
    }
});

/**
 * Rate limiter for progress save (batch-all)
 * Limits: 20 requests per 1 minute per IP
 * Prevents spam saving
 */
export const progressSaveLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 save requests per minute
    message: {
        error: 'Too many save requests. Please wait 1 minute before saving again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many save requests. Please wait 1 minute before saving again.',
            retryAfter: '1 minute'
        });
    }
});

/**
 * Rate limiter for progress load (load-all)
 * Limits: 20 requests per 1 minute per IP
 * Prevents spam loading
 */
export const progressLoadLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 load requests per minute
    message: {
        error: 'Too many load requests. Please wait 1 minute before loading again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many load requests. Please wait 1 minute before loading again.',
            retryAfter: '1 minute'
        });
    }
});