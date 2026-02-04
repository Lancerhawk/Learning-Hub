import React from 'react';
import { X, Package, Plus, Edit, Bug, Shield, FileText, Sparkles } from 'lucide-react';

const changelogData = [
    {
        version: 'v2.2.0',
        date: '2026-02-05',
        changes: {
            added: [
                'Changelog System: Implemented comprehensive version history tracking with floating button UI',
                'Version History Modal: Beautiful terminal-themed modal displaying all updates with color-coded categories',
                'CHANGELOG.md: Complete documentation of all versions from GitHub commit history'
            ],
            changed: [
                'Package Identity: Updated package.json to reflect the platform as a "Learning Hub" rather than just a DSA checklist',
                'Package Version: Bumped to v2.2.0 with proper metadata (description, author, license)'
            ]
        }
    },
    {
        version: 'v2.1.0',
        date: '2026-02-05',
        changes: {
            fixed: [
                'Fixed dropdown arrow icon positioning in filter buttons for better visual alignment'
            ]
        }
    },
    {
        version: 'v2.0.0',
        date: '2026-02-03',
        changes: {
            changed: [
                'Dashboard Metrics Update: Changed homepage dashboard from programming language completion tracking to DSA completion tracking for better focus on core learning objectives'
            ],
            fixed: [
                'Fixed sidebar layout issues',
                'Fixed localStorage checking logic on homepage for accurate progress tracking'
            ]
        }
    },
    {
        version: 'v1.9.0',
        date: '2026-02-01',
        changes: {
            added: [
                'OTP Verification System: Implemented email OTP verification for signup process',
                'Email Authenticity: Added email validation system to ensure genuine user registrations'
            ],
            changed: [
                'Moved README to root directory for better project structure'
            ],
            fixed: [
                'Fixed icon selector design in frontend for improved user experience',
                'Fixed password validation logic to ensure stronger security requirements',
                'Fixed Vercel deployment configuration'
            ],
            legal: [
                'Added MIT License file to the project'
            ]
        }
    },
    {
        version: 'v1.8.0',
        date: '2026-01-31',
        changes: {
            added: [
                'Custom Lists Feature: Users can now create, edit, and manage their own custom learning lists',
                'Explore Page: Browse and discover public learning lists created by the community',
                'Authentication System: Complete login/signup system with user accounts',
                'Deployment Ready: Application fully configured and ready for production deployment'
            ]
        }
    },
    {
        version: 'v1.7.0',
        date: '2026-01-23',
        changes: {
            added: [
                'Custom Scrollbar Design: Implemented themed scrollbar matching the terminal aesthetic',
                'Custom Cursor Design: Added unique cursor design for enhanced visual experience',
                'Custom Click Sound: Interactive audio feedback on user interactions',
                'Custom Selection Theme: Styled text selection to match the terminal theme',
                'Logo & Branding: Added application logo and updated website heading',
                'Enhanced DSA Content: Added more DSA topics and practice questions across multiple platforms'
            ],
            changed: [
                'Topic Organization: Removed redundancy from C++ topics and improved naming consistency'
            ],
            fixed: [
                'Fixed scrolling behavior - pages now scroll from top instead of middle',
                'Fixed topic names for better clarity and consistency'
            ]
        }
    },
    {
        version: 'v1.6.0',
        date: '2026-01-22',
        changes: {
            added: [
                'Typing Animations: Implemented smooth typing animations for hero sections',
                'Real Language Logos: Replaced emoji icons with official programming language logos from CDN',
                'Improved Sidebar Design: Enhanced sidebar with better navigation and visual hierarchy'
            ],
            changed: [
                'Overall UI/UX improvements for a more polished and professional appearance'
            ]
        }
    },
    {
        version: 'v1.0.0',
        date: '2026-01-22',
        changes: {
            added: [
                'Initial Release: DSA Learning Checklist Application',
                'Multi-Language Support: Checklists for Java, JavaScript, Python, C++, and more',
                'DSA Topics: Comprehensive Data Structures and Algorithms topics with resources',
                'Progress Tracking: LocalStorage-based progress tracking for all topics',
                'Responsive Design: Mobile-first responsive design with terminal theme',
                'Video Tutorials: Curated video resources for each topic',
                'Practice Problems: Links to practice problems on LeetCode, HackerRank, GeeksForGeeks, and CodeForces',
                'Dark Terminal Theme: Cyberpunk-inspired terminal aesthetic with green accents',
                'Expandable Sections: Collapsible sections for better content organization'
            ]
        }
    }
];

const getCategoryIcon = (category) => {
    switch (category) {
        case 'added':
            return <Plus className="w-4 h-4" />;
        case 'changed':
            return <Edit className="w-4 h-4" />;
        case 'fixed':
            return <Bug className="w-4 h-4" />;
        case 'legal':
            return <Shield className="w-4 h-4" />;
        case 'security':
            return <Shield className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

const getCategoryColor = (category) => {
    switch (category) {
        case 'added':
            return 'text-green-400 border-green-500';
        case 'changed':
            return 'text-blue-400 border-blue-500';
        case 'fixed':
            return 'text-yellow-400 border-yellow-500';
        case 'legal':
            return 'text-purple-400 border-purple-500';
        case 'security':
            return 'text-red-400 border-red-500';
        default:
            return 'text-slate-400 border-slate-500';
    }
};

export default function ChangelogModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-green-700">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-bold font-mono text-green-500 terminal-glow">
                            &gt; Version History
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-green-500 transition-colors p-2 hover:bg-slate-800 rounded"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                    <div className="space-y-8">
                        {changelogData.map((release, idx) => (
                            <div
                                key={release.version}
                                className="border-2 border-green-700 rounded-lg p-5 bg-slate-800/50 hover:border-green-500 transition-all"
                            >
                                {/* Version Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-700/50">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-green-500" />
                                        <h3 className="text-xl font-bold font-mono text-green-400">
                                            {release.version}
                                        </h3>
                                        {idx === 0 && (
                                            <span className="px-2 py-1 bg-green-500 text-slate-900 text-xs font-bold rounded font-mono">
                                                LATEST
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-500 font-mono">
                                        {release.date}
                                    </span>
                                </div>

                                {/* Changes */}
                                <div className="space-y-4">
                                    {Object.entries(release.changes).map(([category, items]) => (
                                        <div key={category}>
                                            <div className={`flex items-center gap-2 mb-2 ${getCategoryColor(category)}`}>
                                                {getCategoryIcon(category)}
                                                <h4 className="font-bold font-mono text-sm uppercase">
                                                    {category}
                                                </h4>
                                            </div>
                                            <ul className="space-y-2 ml-6">
                                                {items.map((item, itemIdx) => (
                                                    <li
                                                        key={itemIdx}
                                                        className="text-sm text-slate-300 font-mono flex items-start gap-2"
                                                    >
                                                        <span className="text-green-500 mt-1">▸</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t-2 border-green-700 bg-slate-800/50">
                    <p className="text-xs text-slate-500 font-mono text-center">
                        Following Semantic Versioning (SemVer) • Major.Minor.Patch
                    </p>
                </div>
            </div>
        </div>
    );
}
