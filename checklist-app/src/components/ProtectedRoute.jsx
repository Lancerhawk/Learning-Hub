import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireVerification = false }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-green-500 font-mono">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If route requires email verification and user is not verified
    if (requireVerification && !user.emailVerified) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border-2 border-yellow-500 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-500 font-mono mb-2">
                        Email Verification Required
                    </h2>
                    <p className="text-slate-400 font-mono text-sm mb-6">
                        Please verify your email address to access this feature. Check your inbox for the verification OTP.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-green-500 text-slate-900 px-6 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
}
