import React from 'react';
import { Link } from 'react-router-dom';
import { Code, BookOpen, TrendingUp, Terminal } from 'lucide-react';

const languages = [
    { id: 'cpp', name: 'C++', icon: '⚡', color: 'border-blue-500', textColor: 'text-blue-400' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'border-yellow-500', textColor: 'text-yellow-400' },
    { id: 'java', name: 'Java', icon: '☕', color: 'border-orange-500', textColor: 'text-orange-400' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'border-green-500', textColor: 'text-green-400' },
    { id: 'ruby', name: 'Ruby', icon: '💎', color: 'border-red-500', textColor: 'text-red-400' },
    { id: 'golang', name: 'Go', icon: '🔷', color: 'border-cyan-500', textColor: 'text-cyan-400' },
];

export default function HomePage({ calculateLanguageProgress }) {
    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Terminal className="w-12 h-12 text-green-500" />
                        <div>
                            <h1 className="text-4xl font-bold text-green-500 font-mono terminal-glow">
                                $ ./learn_hub
                            </h1>
                            <p className="text-green-400 font-mono text-sm mt-2">
                                Master programming languages & algorithms
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[LANGUAGES]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">{languages.length}</div>
                        </div>

                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[SECTIONS]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">{languages.length * 2 + 1}</div>
                        </div>

                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[PROGRESS]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">0%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Languages Grid */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-green-500 font-mono mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    [SELECT LANGUAGE]
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {languages.map((lang) => {
                        const progress = calculateLanguageProgress ? calculateLanguageProgress(lang.id) : 0;

                        return (
                            <Link
                                key={lang.id}
                                to={`/${lang.id}`}
                                className={`bg-slate-900 border-2 ${lang.color} rounded-lg p-6 hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-${lang.color}/20 group`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{lang.icon}</span>
                                    <div>
                                        <h3 className={`text-xl font-bold ${lang.textColor} font-mono`}>
                                            {lang.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-mono">2 sections</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-green-500">DSA Mastery</span>
                                        <span className="text-green-400">{progress.dsa}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${progress.dsa}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-green-500">Dev Mastery</span>
                                        <span className="text-green-400">{progress.dev}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${progress.dev}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-xs font-mono text-green-600 group-hover:text-green-500">
                                        → START LEARNING
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* DSA Topics Card */}
                <div className="mt-6">
                    <Link
                        to="/dsa"
                        className="block bg-slate-900 border-2 border-green-500 rounded-lg p-6 hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-green-500/20 group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-green-500" />
                                <div>
                                    <h3 className="text-xl font-bold text-green-500 font-mono">
                                        DSA Topics
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono">Language-agnostic algorithms & data structures</p>
                                </div>
                            </div>
                            <span className="text-sm font-mono text-green-600 group-hover:text-green-500">
                                → EXPLORE
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
