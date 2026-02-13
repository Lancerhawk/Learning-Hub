import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TermsModal from './TermsModal';
import EmailVerificationModal from './EmailVerificationModal';

export default function SignupModal({ onClose, onSwitchToLogin }) {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'text-red-500' };
        if (strength <= 3) return { strength, label: 'Medium', color: 'text-yellow-500' };
        return { strength, label: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    const validateForm = () => {
        if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            setError('Username must be 3-20 characters');
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return false;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }

        if (!/\d/.test(password)) {
            setError('Password must contain at least one number');
            return false;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError('Password must contain at least one special character');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (!agreedToTerms) {
            setError('You must agree to the Terms & Guidelines');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const result = await signup(email, username, password);
        setLoading(false);

        if (result.success) {
            // Check if email verification is required
            if (result.requiresVerification) {
                setSignupEmail(email);
                setShowVerification(true);
            } else {
                // Old flow (shouldn't happen with new backend)
                onClose();
            }
        } else {
            setError(result.error);
        }
    };

    const handleVerified = async (token) => {
        // Store token in localStorage
        localStorage.setItem('auth_token', token);

        // Check if there's localStorage progress to migrate
        const hasLocalProgress = checkForLocalStorageProgress();

        if (hasLocalProgress) {
            try {
                console.log('🔄 Migrating localStorage progress to new account...');

                // Collect all localStorage progress
                const checklists = collectLocalStorageProgress();

                // Send to migration endpoint
                const { authAPI } = await import('../../utils/api.js');
                await authAPI.migrateSignupProgress(checklists);

                console.log('✅ Signup progress migrated to database');

                // Clear localStorage after successful migration
                clearProgressFromLocalStorage();
            } catch (error) {
                console.error('Failed to migrate signup progress:', error);
                // Don't block signup if migration fails
            }
        }

        // Reload page to initialize with database
        window.location.reload();
    };

    // Helper: Check if localStorage has any progress
    const checkForLocalStorageProgress = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith('_progress')) {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        if (Object.keys(parsed).length > 0) {
                            return true;
                        }
                    } catch {
                        // Ignore invalid JSON
                    }
                }
            }
        }
        return false;
    };

    // Helper: Collect all progress from localStorage
    const collectLocalStorageProgress = () => {
        const checklists = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith('_progress')) {
                const storageKey = key.replace('_progress', '');
                const data = localStorage.getItem(key);

                if (data) {
                    try {
                        const items = JSON.parse(data);
                        if (Object.keys(items).length > 0) {
                            // Parse storage key inline to avoid require()
                            let type, id;
                            if (storageKey === 'dsa') {
                                type = 'dsa_topics';
                                id = 'dsa';
                            } else if (storageKey.includes('_dsa')) {
                                type = 'language_dsa';
                                id = storageKey.replace('_dsa', '');
                            } else if (storageKey.includes('_dev')) {
                                type = 'language_dev';
                                id = storageKey.replace('_dev', '');
                            } else {
                                type = 'examination';
                                id = storageKey;
                            }
                            checklists.push({ type, id, items });
                        }
                    } catch {
                        // Ignore invalid JSON
                    }
                }
            }
        }

        return checklists;
    };

    // Helper: Clear all progress from localStorage
    const clearProgressFromLocalStorage = () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith('_progress')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem('progress_owner_id');

        console.log(`🧹 Cleared ${keysToRemove.length} progress items from localStorage`);
    };



    return (
        <>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg max-w-md w-full shadow-2xl shadow-green-500/30 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-green-500 sticky top-0 bg-slate-900 z-10">
                        <div className="flex items-center gap-3">
                            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                            <h2 className="text-lg sm:text-2xl font-bold text-green-500 font-mono">
                                [SIGN UP]
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

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-mono text-green-500 mb-2">
                                EMAIL *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none"
                                disabled={loading}
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-mono text-green-500 mb-2">
                                USERNAME * (3-20 characters)
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="cool_username"
                                className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none"
                                disabled={loading}
                            />
                            <p className="text-xs text-slate-400 font-mono mt-1">
                                Letters, numbers, and underscores only
                            </p>
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
                                    placeholder="enter your password"
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
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded ${i < passwordStrength.strength
                                                    ? passwordStrength.strength <= 2
                                                        ? 'bg-red-500'
                                                        : passwordStrength.strength <= 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    : 'bg-slate-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-mono ${passwordStrength.color}`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-mono text-green-500 mb-2">
                                CONFIRM PASSWORD *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none pr-12"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <p className="text-xs text-green-500 font-mono">Passwords match</p>
                                </div>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-2 p-3 bg-slate-800 border border-slate-700 rounded">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-green-500"
                                disabled={loading}
                            />
                            <label htmlFor="terms" className="text-xs sm:text-sm text-green-400 font-mono">
                                I agree to the{' '}
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(true)}
                                    className="text-green-500 hover:text-green-400 font-bold underline"
                                >
                                    Terms & Guidelines
                                </button>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 sm:py-3 bg-green-500 text-slate-900 rounded font-mono text-sm sm:text-base font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>

                        {/* Switch to Login */}
                        <div className="text-center pt-4 border-t border-slate-700">
                            <p className="text-green-400 font-mono text-xs sm:text-sm">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-green-500 hover:text-green-400 font-bold"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <TermsModal
                    onAccept={() => {
                        setAgreedToTerms(true);
                        setShowTerms(false);
                    }}
                    onDecline={() => {
                        setAgreedToTerms(false);
                        setShowTerms(false);
                    }}
                />
            )}

            {/* Email Verification Modal */}
            {showVerification && (
                <EmailVerificationModal
                    email={signupEmail}
                    onVerified={handleVerified}
                    onClose={() => {
                        setShowVerification(false);
                        onClose();
                    }}
                />
            )}
        </>
    );
}
