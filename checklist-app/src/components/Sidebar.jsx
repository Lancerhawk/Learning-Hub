import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Terminal, BookOpen, Menu, X } from 'lucide-react';

const languages = [
    { id: 'cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', color: 'text-blue-400' },
    { id: 'javascript', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'text-yellow-400' },
    { id: 'java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: 'text-orange-400' },
    { id: 'python', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'text-green-400' },
    { id: 'ruby', name: 'Ruby', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg', color: 'text-red-400' },
    { id: 'golang', name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg', color: 'text-cyan-400' },
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
                <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Dashboard Section */}
                    <div className="border-2 border-green-700 rounded-lg p-2 bg-slate-800/30">
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
                    </div>

                    {/* Languages Section */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <div className="text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2">
                            &gt; [LANGUAGES]
                        </div>
                        <div className="space-y-0">
                            {languages.map((lang, index) => (
                                <NavLink
                                    key={lang.id}
                                    to={`/${lang.id}`}
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

                    {/* DSA Topics Section */}
                    <div className="border-2 border-green-700 rounded-lg p-3 bg-slate-800/30">
                        <div className="text-xs font-mono text-green-500 px-2 mb-3 font-bold border-b border-green-700 pb-2">
                            &gt; [ALGORITHMS]
                        </div>
                        <NavLink
                            to="/dsa"
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
