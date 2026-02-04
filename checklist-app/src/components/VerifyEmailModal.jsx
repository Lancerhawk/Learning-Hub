import React, { useState } from 'react';
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailModal({ isOpen, onClose, userEmail }) {
    const { updateUserVerificationStatus } = useAuth();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);

    if (!isOpen) return null;

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Store new token with verified status
            localStorage.setItem('auth_token', data.token);

            // Update user state immediately
            updateUserVerificationStatus(true);

            // Close modal
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            setError(''); // Clear any previous errors
            setOtp(''); // Clear OTP input
        } catch (err) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg w-full max-w-md shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-green-700">
                    <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-bold font-mono text-green-500">
                            Verify Email
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-green-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleVerify} className="p-6 space-y-4">
                    <p className="text-slate-400 font-mono text-sm">
                        Enter the 6-digit OTP sent to <span className="text-green-400">{userEmail}</span>
                    </p>

                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-mono text-green-500 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full px-4 py-3 bg-slate-800 border-2 border-green-700 rounded text-green-400 font-mono text-center text-2xl tracking-widest focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500 rounded">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-400 font-mono text-sm">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-green-500 text-slate-900 px-6 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Verify Email
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resending}
                            className="w-full bg-slate-800 border border-green-700 text-green-400 px-6 py-3 rounded font-mono hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
