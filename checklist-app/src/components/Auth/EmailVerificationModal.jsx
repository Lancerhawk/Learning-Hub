import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function EmailVerificationModal({ email, onVerified, onClose }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
    const inputRefs = useRef([]);

    // Countdown timer for OTP expiry
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are entered
        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6).split('');
                const newOtp = [...otp];
                digits.forEach((digit, i) => {
                    if (i < 6) newOtp[i] = digit;
                });
                setOtp(newOtp);
                if (digits.length === 6) {
                    handleVerify(newOtp.join(''));
                }
            });
        }
    };

    const handleVerify = async (otpCode = otp.join('')) => {
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode })
            });

            const data = await response.json();

            if (response.ok) {
                onVerified(data.token, data.user);
            } else {
                setError(data.error || 'Verification failed');
                if (data.attemptsRemaining !== undefined) {
                    setError(`${data.error} (${data.attemptsRemaining} attempts remaining)`);
                }
                // Clear OTP on error
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setResendCooldown(60); // 60 second cooldown
                setTimeRemaining(600); // Reset 10 minute timer
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                setError(''); // Clear any previous errors
            } else {
                setError(data.error || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg max-w-md w-full shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-green-500">
                    <div className="flex items-center gap-3">
                        <Mail className="w-8 h-8 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-500 font-mono">
                            [VERIFY EMAIL]
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-red-500 hover:bg-slate-800 rounded transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-green-400 font-mono text-sm mb-2">
                            We sent a 6-digit code to:
                        </p>
                        <p className="text-green-500 font-mono font-bold text-lg">
                            {email}
                        </p>
                    </div>

                    {/* Spam Folder Notice */}
                    <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-500 font-mono font-bold text-sm mb-1">
                                    📧 Check Your Spam/Junk Folder!
                                </p>
                                <p className="text-yellow-400 font-mono text-xs">
                                    The email might be in your spam folder. Please check there if you don't see it in your inbox.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                        <p className="text-slate-400 font-mono text-sm">
                            Code expires in:{' '}
                            <span className={`font-bold ${timeRemaining < 60 ? 'text-red-500' : 'text-green-500'}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </p>
                    </div>

                    {/* OTP Input */}
                    <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono focus:border-green-500 focus:outline-none transition-all"
                                disabled={loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500 rounded flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-500 font-mono text-sm">{error}</p>
                        </div>
                    )}

                    {/* Verify Button */}
                    <button
                        onClick={() => handleVerify()}
                        disabled={loading || otp.some(d => !d)}
                        className="w-full py-3 bg-green-500 text-slate-900 rounded font-mono font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                VERIFYING...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                VERIFY EMAIL
                            </>
                        )}
                    </button>

                    {/* Resend Button */}
                    <div className="text-center">
                        <p className="text-slate-400 font-mono text-sm mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={loading || resendCooldown > 0}
                            className="text-green-500 hover:text-green-400 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
