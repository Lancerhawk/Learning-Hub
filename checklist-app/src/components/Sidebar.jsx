import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Terminal, BookOpen, Menu, X, LogIn, UserPlus, LogOut, User, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/LoginModal';
import SignupModal from './Auth/SignupModal';
import { playClickSound } from '../utils/sounds';
import { getAllExams, isExamComingSoon } from '../data/examinationsData';

const languages = [
    { id: 'cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', color: 'text-blue-400' },
    { id: 'javascript', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'text-yellow-400' },
    { id: 'java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: 'text-orange-400' },
    { id: 'python', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'text-green-400' },
    { id: 'ruby', name: 'Ruby', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg', color: 'text-red-400' },
    { id: 'golang', name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg', color: 'text-cyan-400' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { user, isAuthenticated, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [languagesExpanded, setLanguagesExpanded] = useState(true);
    const [examinationsSectionExpanded, setExaminationsSectionExpanded] = useState(true);
    const [overlayExpanded, setOverlayExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null); // Track which category's overlay is shown
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
    const hoverTimerRef = useRef(null); // Timer for hover delay

    const examinations = getAllExams();

    // Function to calculate overlay position from a button element
    const calculateOverlayPosition = (buttonElement) => {
        const rect = buttonElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const overlayHeight = 300; // Approximate height
        const overlayWidth = 250; // Min width from CSS

        // Simple positioning: align with button, but ensure it fits in viewport
        let top = rect.top;

        // If overlay would go below viewport, shift it up
        if (top + overlayHeight > viewportHeight) {
            top = Math.max(10, viewportHeight - overlayHeight - 10);
        }

        // Calculate left position - handle mobile screens
        let left = rect.right + 8;
        if (left + overlayWidth > viewportWidth) {
            // Position to the left of the button instead
            left = Math.max(10, rect.left - overlayWidth - 8);
            // If still doesn't fit, center it
            if (left < 10) {
                left = Math.max(10, (viewportWidth - overlayWidth) / 2);
            }
        }

        setOverlayPosition({ top, left });
    };

    // Handle mouse enter with immediate show
    const handleCategoryMouseEnter = (e, category) => {
        // Clear any pending close timer
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        calculateOverlayPosition(e.currentTarget);
        setActiveCategory(category);
        setOverlayExpanded(true);
    };

    // Handle mouse leave with delay
    const handleCategoryMouseLeave = () => {
        // Don't auto-close on mobile/tablet devices
        // Check if it's a touch-primary device (mobile/tablet) vs touch-capable desktop
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches);

        if (isMobileDevice) {
            return; // On mobile, only close via click or close button
        }
        // Add a small delay before closing to allow cursor to reach overlay
        hoverTimerRef.current = setTimeout(() => {
            setOverlayExpanded(false);
            setActiveCategory(null);
        }, 150); // 150ms delay
    };

    // Handle overlay mouse enter - cancel close timer
    const handleOverlayMouseEnter = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        setOverlayExpanded(true);
    };

    // Handle overlay mouse leave - close with delay
    const handleOverlayMouseLeave = () => {
        // Don't auto-close on mobile/tablet devices
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches);

        if (isMobileDevice) {
            return; // On mobile, only close via click or close button
        }
        hoverTimerRef.current = setTimeout(() => {
            setOverlayExpanded(false);
            setActiveCategory(null);
        }, 150);
    };

    const handleLogout = () => {
        logout();
        playClickSound();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-900 border-r-2 border-green-500 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-72 flex flex-col`}
            >
                {/* Header */}
                <div className="p-4 border-b-2 border-green-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="LEARN.HUB" className="w-6 h-6" />
                        <span className="font-mono text-green-500 font-bold">LEARN.HUB</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-green-500 hover:text-green-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Section */}
                {isAuthenticated ? (
                    <div className="p-4 border-b-2 border-green-700 bg-slate-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-green-500" />
                            <span className="font-mono text-green-400 text-sm font-bold">
                                {user?.username}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded font-mono text-xs hover:bg-red-500 hover:text-white transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border-b-2 border-green-700 bg-slate-800/50 space-y-2">
                        <button
                            onClick={() => {
                                setShowLogin(true);
                                playClickSound();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-slate-900 rounded font-mono text-xs font-bold hover:bg-green-400 transition-all"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowSignup(true);
                                playClickSound();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-green-500 text-green-500 rounded font-mono text-xs hover:bg-slate-700 transition-all"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Sign Up</span>
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* General Section */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <div className="text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2">
                            &gt; [GENERAL]
                        </div>
                        <div className="space-y-0">
                            <NavLink
                                to="/"
                                end
                                onClick={playClickSound}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 font-mono text-sm transition-all border-b border-green-800/50 ${isActive
                                        ? 'bg-green-500 text-slate-900 font-bold'
                                        : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                    }`
                                }
                            >
                                <Terminal className="w-5 h-5" />
                                <span>Dashboard</span>
                            </NavLink>

                            {isAuthenticated && (
                                <>
                                    <NavLink
                                        to="/custom-lists"
                                        onClick={(e) => {
                                            if (user && !user.emailVerified) {
                                                e.preventDefault();
                                            }
                                            playClickSound();
                                        }}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 font-mono text-sm transition-all border-b border-green-800/50 group relative ${isActive
                                                ? 'bg-green-500 text-slate-900 font-bold'
                                                : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                            } ${user && !user.emailVerified ? 'opacity-60' : ''}`
                                        }
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        <span>My Lists</span>
                                        {user && !user.emailVerified && (
                                            <Lock className="w-4 h-4 ml-auto" title="Email verification required" />
                                        )}
                                    </NavLink>
                                    <NavLink
                                        to="/explore"
                                        onClick={(e) => {
                                            if (user && !user.emailVerified) {
                                                e.preventDefault();
                                            }
                                            playClickSound();
                                        }}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 font-mono text-sm transition-all group relative ${isActive
                                                ? 'bg-green-500 text-slate-900 font-bold'
                                                : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                            } ${user && !user.emailVerified ? 'opacity-60' : ''}`
                                        }
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        <span>Explore Lists</span>
                                        {user && !user.emailVerified && (
                                            <Lock className="w-4 h-4 ml-auto" title="Email verification required" />
                                        )}
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Algorithms Section */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <div className="text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2">
                            &gt; [ALGORITHMS]
                        </div>
                        <NavLink
                            to="/dsa"
                            onClick={playClickSound}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded font-mono text-sm transition-all ${isActive
                                    ? 'bg-green-500 text-slate-900 font-bold'
                                    : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                }`
                            }
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>DSA Topics</span>
                        </NavLink>
                    </div>

                    {/* Examinations Section - Collapsible */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <button
                            onClick={() => {
                                setExaminationsSectionExpanded(!examinationsSectionExpanded);
                                playClickSound();
                            }}
                            className="w-full flex items-center justify-between text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2 hover:text-green-400 transition-colors"
                        >
                            <span>&gt; [EXAMINATIONS]</span>
                            <span className={`transition-transform duration-300 ease-in-out ${examinationsSectionExpanded ? 'rotate-90' : ''}`}>
                                ▶
                            </span>
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${examinationsSectionExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="space-y-0">
                                {/* Group exams by category (e.g., GATE) */}
                                {Object.entries(
                                    examinations.reduce((acc, exam) => {
                                        const category = exam.name.split(' ')[0]; // Extract "GATE" from "GATE Computer Science"
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(exam);
                                        return acc;
                                    }, {})
                                ).map(([category, exams]) => {
                                    const allComingSoon = exams.every(exam => isExamComingSoon(exam));
                                    const hasMultipleExams = exams.length > 1;

                                    return (
                                        <div key={category}>
                                            {hasMultipleExams ? (
                                                // Multiple exams - show overlay on hover
                                                <div
                                                    onMouseEnter={(e) => handleCategoryMouseEnter(e, category)}
                                                    onMouseLeave={handleCategoryMouseLeave}
                                                    onClick={(e) => {
                                                        calculateOverlayPosition(e.currentTarget);
                                                        setActiveCategory(category);
                                                        setOverlayExpanded(!overlayExpanded);
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded font-mono text-sm transition-all text-green-400 hover:bg-slate-800 hover:text-green-300 cursor-pointer"
                                                >
                                                    <GraduationCap className="w-5 h-5" />
                                                    <span className="flex-1">{category}</span>
                                                    {allComingSoon && (
                                                        <span className="text-xs bg-slate-900 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/50 font-semibold">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                // Single exam - navigate directly
                                                <NavLink
                                                    to={`/examinations/${exams[0].id}`}
                                                    onClick={playClickSound}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-2.5 rounded font-mono text-sm transition-all ${isActive
                                                            ? 'bg-green-500 text-slate-900 font-bold'
                                                            : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                                        }`
                                                    }
                                                >
                                                    <GraduationCap className="w-5 h-5" />
                                                    <span className="flex-1">{category}</span>
                                                    {allComingSoon && (
                                                        <span className="text-xs bg-slate-900 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/50 font-semibold">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </NavLink>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Languages Section - Collapsible */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <button
                            onClick={() => {
                                setLanguagesExpanded(!languagesExpanded);
                                playClickSound();
                            }}
                            className="w-full flex items-center justify-between text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2 hover:text-green-400 transition-colors"
                        >
                            <span>&gt; [LANGUAGES]</span>
                            <span className={`transition-transform duration-300 ease-in-out ${languagesExpanded ? 'rotate-90' : ''}`}>
                                ▶
                            </span>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${languagesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="space-y-0">
                                {languages.map((lang, index) => (
                                    <NavLink
                                        key={lang.id}
                                        to={`/${lang.id}`}
                                        onClick={playClickSound}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 font-mono text-sm transition-all ${index < languages.length - 1 ? 'border-b border-green-800/50' : ''
                                            } ${isActive
                                                ? 'bg-green-500 text-slate-900 font-bold'
                                                : `${lang.color} hover:bg-slate-800`
                                            }`
                                        }
                                    >
                                        <img src={lang.icon} alt={lang.name} className="w-5 h-5" />
                                        <span>{lang.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t-2 border-green-500">
                    <div className="text-xs font-mono text-green-600">
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse">●</span>
                            <span>Auto-save enabled</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Modals */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitchToSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                />
            )}

            {showSignup && (
                <SignupModal
                    onClose={() => setShowSignup(false)}
                    onSwitchToLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}

            {/* Examinations Overlay - Rendered outside sidebar */}
            {overlayExpanded && activeCategory && (() => {
                // Filter exams for the active category
                const filteredExams = examinations.filter(exam => {
                    const examCategory = exam.name.split(' ')[0];
                    return examCategory === activeCategory;
                });

                // Only render overlay if there are exams to show
                if (filteredExams.length === 0) return null;

                return (
                    <div
                        className="fixed z-[9999] p-6"
                        style={{ top: `${overlayPosition.top - 24}px`, left: `${overlayPosition.left - 24}px` }}
                        onMouseEnter={handleOverlayMouseEnter}
                        onMouseLeave={handleOverlayMouseLeave}
                    >
                        <div className="bg-slate-900 border-2 border-green-500 rounded-lg shadow-2xl shadow-green-500/30 min-w-[250px] overflow-hidden">
                            <div className="p-2 border-b border-green-700 bg-slate-800 flex items-center justify-between">
                                <span className="text-xs font-mono text-green-500 font-bold">SELECT STREAM</span>
                                <button
                                    onClick={() => setOverlayExpanded(false)}
                                    className="lg:hidden text-green-500 hover:text-green-300 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {filteredExams.map((exam, index) => {
                                    const comingSoon = isExamComingSoon(exam);
                                    return (
                                        <NavLink
                                            key={exam.id}
                                            to={`/examinations/${exam.id}`}
                                            onClick={(e) => {
                                                playClickSound();
                                                setOverlayExpanded(false);
                                            }}
                                            className={({ isActive }) =>
                                                `flex items-start gap-3 px-4 py-3 font-mono text-sm transition-all ${index < filteredExams.length - 1 ? 'border-b border-green-800/50' : ''
                                                } ${isActive
                                                    ? 'bg-green-500 text-slate-900 font-bold'
                                                    : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                                }`
                                            }
                                        >
                                            <GraduationCap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-bold flex items-center gap-2">
                                                    {exam.stream}
                                                    {comingSoon && (
                                                        <span className="text-xs bg-slate-900 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/50 font-semibold">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs opacity-75">{exam.year}</div>
                                            </div>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}
