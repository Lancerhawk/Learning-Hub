import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Show nothing while checking auth status
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-green-500 font-mono">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}
