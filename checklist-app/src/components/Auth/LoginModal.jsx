import React, { useState } from 'react';
import { X, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginModal({ onClose, onSwitchToSignup }) {
    const { login } = useAuth();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailOrUsername.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await login(emailOrUsername, password);
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
    };

    if (showForgotPassword) {
        return <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg max-w-md w-full shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-green-500">
                    <div className="flex items-center gap-3">
                        <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        <h2 className="text-lg sm:text-2xl font-bold text-green-500 font-mono">
                            [LOGIN]
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-red-500 hover:bg-slate-800 rounded transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500 rounded flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-500 font-mono text-sm">{error}</p>
                        </div>
                    )}

                    {/* Email or Username */}
                    <div>
                        <label className="block text-xs font-mono text-green-500 mb-2">
                            EMAIL OR USERNAME *
                        </label>
                        <input
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            placeholder="Enter your email or username"
                            className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-mono text-green-500 mb-2">
                            PASSWORD *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none pr-12"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-xs sm:text-sm text-green-500 hover:text-green-400 font-mono"
                            onClick={() => setShowForgotPassword(true)}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 sm:py-3 bg-green-500 text-slate-900 rounded font-mono text-sm sm:text-base font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>

                    {/* Switch to Signup */}
                    <div className="text-center pt-4 border-t border-slate-700">
                        <p className="text-green-400 font-mono text-xs sm:text-sm">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToSignup}
                                className="text-green-500 hover:text-green-400 font-bold"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
