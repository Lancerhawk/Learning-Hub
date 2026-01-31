import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setMessage({ type: 'error', text: 'No reset token provided' });
                setVerifying(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/password/verify-reset-token/${token}`);
                const data = await response.json();

                if (response.ok && data.valid) {
                    setTokenValid(true);
                } else {
                    setMessage({ type: 'error', text: data.error || 'Invalid or expired reset token' });
                }
            } catch (error) {
                console.error('Token verification error:', error);
                setMessage({ type: 'error', text: 'Failed to verify reset token' });
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/api/password/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                // Backend returns specific error messages
                setMessage({ type: 'error', text: data.error || 'Failed to reset password' });
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-green-500 font-mono">Verifying reset token...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-8 max-w-md w-full shadow-2xl shadow-red-500/30">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-400 font-mono mb-4">Invalid Reset Link</h2>
                        <p className="text-slate-400 font-mono mb-6">
                            {message?.text || 'This password reset link is invalid or has expired.'}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-green-500 text-slate-900 px-6 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 max-w-md w-full shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-400 font-mono mb-2">&gt; Reset Password</h1>
                    <p className="text-slate-400 font-mono text-sm">Enter your new password below</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-3 rounded border ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500 text-green-400'
                        : 'bg-red-500/10 border-red-500 text-red-400'
                        } flex items-start gap-2`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm font-mono">{message.text}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="mb-4">
                        <label className="block text-green-400 font-mono text-sm mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-green-700 text-green-400 rounded font-mono focus:outline-none focus:border-green-500 transition-colors text-sm"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-500 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="block text-green-400 font-mono text-sm mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-green-700 text-green-400 rounded font-mono focus:outline-none focus:border-green-500 transition-colors"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-500 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-slate-900 px-4 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    {/* Back to Login */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full px-4 py-3 bg-slate-800 border border-green-700 text-green-400 rounded font-mono hover:bg-slate-700 transition-all"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}
