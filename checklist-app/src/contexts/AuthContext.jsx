import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('auth_token');
                    setLoading(false);
                    return;
                }

                setToken(storedToken);
                setUser({
                    id: decoded.userId,
                    username: decoded.username,
                    email: decoded.email,
                    emailVerified: decoded.emailVerified // May be undefined for old tokens
                });
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('auth_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (emailOrUsername, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token
            localStorage.setItem('auth_token', data.token);
            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0]?.msg || 'Signup failed');
            }

            // Check if email verification is required
            if (data.requiresVerification) {
                return {
                    success: true,
                    requiresVerification: true,
                    userId: data.userId,
                    email: data.email
                };
            }

            // Old flow (if backend doesn't require verification)
            localStorage.setItem('auth_token', data.token);
            setToken(data.token);
            setUser(data.user);

            return { success: true, requiresVerification: false };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resendVerificationOTP = async (email) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    const updateUserVerificationStatus = (verified = true) => {
        if (user) {
            setUser({
                ...user,
                emailVerified: verified
            });
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        resendVerificationOTP,
        updateUserVerificationStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
