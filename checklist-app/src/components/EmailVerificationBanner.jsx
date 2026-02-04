import React, { useState } from 'react';
import { AlertTriangle, Mail, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VerifyEmailModal from './VerifyEmailModal';

export default function EmailVerificationBanner() {
    const { user, resendVerificationOTP } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    // Don't show banner if user is not logged in, is verified, or has dismissed it
    if (!user || user.emailVerified || dismissed) {
        return null;
    }

    const handleResendOTP = async () => {
        setLoading(true);
        setMessage(null);

        const result = await resendVerificationOTP(user.email);

        if (result.success) {
            setMessage({
                type: 'success',
                text: 'Verification OTP sent! Check your email.'
            });
            // Open verify modal after successful resend
            setTimeout(() => {
                setShowVerifyModal(true);
            }, 1000);
        } else {
            setMessage({
                type: 'error',
                text: result.error || 'Failed to send OTP. Please try again.'
            });
        }

        setLoading(false);

        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-900/95 border-b-2 border-yellow-500 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3 flex-1">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-yellow-100 font-mono text-sm">
                                    <strong>Email Verification Required:</strong> Please verify your email address to access custom lists and explore features.
                                </p>
                                {message && (
                                    <p className={`text-xs mt-1 font-mono ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {message.text}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="px-4 py-2 bg-yellow-500 text-slate-900 rounded font-mono text-sm font-bold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4" />
                                        Resend OTP
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setDismissed(true)}
                                className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                title="Dismiss (will reappear on page reload)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verify Email Modal */}
            <VerifyEmailModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                userEmail={user?.email}
            />
        </>
    );
}
