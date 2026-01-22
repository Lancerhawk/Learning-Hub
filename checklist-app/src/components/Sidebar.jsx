import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Terminal, BookOpen, Menu, X } from 'lucide-react';

const languages = [
    { id: 'cpp', name: 'C++', icon: '⚡', color: 'text-blue-400' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'text-yellow-400' },
    { id: 'java', name: 'Java', icon: '☕', color: 'text-orange-400' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'text-green-400' },
    { id: 'ruby', name: 'Ruby', icon: '💎', color: 'text-red-400' },
    { id: 'golang', name: 'Go', icon: '🔷', color: 'text-cyan-400' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
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
                        <Terminal className="w-6 h-6 text-green-500" />
                        <span className="font-mono text-green-500 font-bold">LEARN.HUB</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-green-500 hover:text-green-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {/* Home */}
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded font-mono text-sm transition-all ${isActive
                                ? 'bg-green-500 text-slate-900 font-bold'
                                : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                            }`
                        }
                    >
                        <Terminal className="w-5 h-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* Languages */}
                    <div className="pt-4">
                        <div className="text-xs font-mono text-slate-500 px-4 mb-2">[LANGUAGES]</div>
                        {languages.map((lang) => (
                            <NavLink
                                key={lang.id}
                                to={`/${lang.id}`}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded font-mono text-sm transition-all ${isActive
                                        ? 'bg-green-500 text-slate-900 font-bold'
                                        : `${lang.color} hover:bg-slate-800`
                                    }`
                                }
                            >
                                <span className="text-xl">{lang.icon}</span>
                                <span>{lang.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* DSA Topics */}
                    <div className="pt-4">
                        <div className="text-xs font-mono text-slate-500 px-4 mb-2">[ALGORITHMS]</div>
                        <NavLink
                            to="/dsa"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded font-mono text-sm transition-all ${isActive
                                    ? 'bg-green-500 text-slate-900 font-bold'
                                    : 'text-green-400 hover:bg-slate-800 hover:text-green-300'
                                }`
                            }
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>DSA Topics</span>
                        </NavLink>
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
        </>
    );
}
