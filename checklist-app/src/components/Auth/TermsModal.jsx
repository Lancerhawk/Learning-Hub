import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function TermsModal({ onAccept, onDecline }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-green-500">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        <h2 className="text-lg sm:text-2xl font-bold text-green-500 font-mono">
                            [TERMS & GUIDELINES]
                        </h2>
                    </div>
                    <button
                        onClick={onDecline}
                        className="p-2 text-red-500 hover:bg-slate-800 rounded transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-green-400 font-mono text-sm space-y-4">
                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">1. Account Usage</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>You must be at least 13 years old to create an account</li>
                            <li>One account per person - no duplicate accounts</li>
                            <li>You are responsible for maintaining account security</li>
                            <li>Do not share your password with anyone</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">2. Content Guidelines</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Create original, helpful learning lists</li>
                            <li>Do not post offensive, harmful, or inappropriate content</li>
                            <li>Respect intellectual property - link to sources properly</li>
                            <li>No spam, advertisements, or promotional content</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">3. Public Lists</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Public lists can be viewed and copied by all users</li>
                            <li>You retain ownership of your original lists</li>
                            <li>Copied lists will show attribution to the original creator</li>
                            <li>We reserve the right to remove inappropriate public lists</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">4. Ratings & Reviews</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Rate lists honestly and constructively</li>
                            <li>Do not manipulate ratings (no fake accounts, vote brigading)</li>
                            <li>Ratings are meant to help others find quality content</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">5. Privacy</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>We store your email, username, and password (encrypted)</li>
                            <li>Your progress data is saved to your account</li>
                            <li>Public lists show your username as the creator</li>
                            <li>We do not sell your data to third parties</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">6. Termination</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>We may suspend or terminate accounts that violate these terms</li>
                            <li>You can delete your account at any time</li>
                            <li>Deleted accounts cannot be recovered</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">7. Disclaimer</h3>
                        <p className="ml-2">
                            This platform is provided "as is" without warranties. We are not responsible for the
                            accuracy or quality of user-generated content. Use learning resources at your own
                            discretion.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-green-500 font-bold text-base mb-2">8. Changes to Terms</h3>
                        <p className="ml-2">
                            We may update these terms at any time. Continued use of the platform constitutes
                            acceptance of updated terms.
                        </p>
                    </section>

                    <div className="mt-6 p-4 bg-slate-800 border border-green-500 rounded">
                        <p className="text-green-400 font-bold">
                            By clicking "I Accept", you agree to these Terms & Guidelines.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 sm:p-6 border-t-2 border-green-500">
                    <button
                        onClick={onDecline}
                        className="flex-1 py-2 sm:py-3 bg-slate-800 border border-red-500 text-red-500 rounded font-mono text-sm sm:text-base hover:bg-red-500 hover:text-white transition-all"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-2 sm:py-3 bg-green-500 text-slate-900 rounded font-mono text-sm sm:text-base font-bold hover:bg-green-400 transition-all"
                    >
                        I Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
