import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Terminal, BookOpen, Menu, X, LogIn, UserPlus, LogOut, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/LoginModal';
import SignupModal from './Auth/SignupModal';
import { playClickSound } from '../utils/sounds';

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
                    } w-64 flex flex-col`}
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
        </>
    );
}
