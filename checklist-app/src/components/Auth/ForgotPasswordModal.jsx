import { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/api/password/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'If an account with that email exists, a password reset link has been sent. Please check your inbox and spam/junk folder.'
                });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send reset email' });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-green-400 font-mono">&gt; Forgot Password</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-green-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded border ${message.type === 'success'
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
                    <div className="mb-6">
                        <p className="text-slate-400 font-mono text-sm mb-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-green-700 text-green-400 rounded font-mono focus:outline-none focus:border-green-500 transition-colors"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-500 text-slate-900 px-4 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 bg-slate-800 border border-green-700 text-green-400 rounded font-mono hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
