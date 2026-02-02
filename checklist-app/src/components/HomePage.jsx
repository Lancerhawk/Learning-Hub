import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Code, BookOpen, TrendingUp, Terminal, Award, Target, Zap, CheckCircle2 } from 'lucide-react';
import TypingAnimation from './TypingAnimation';
import { dsaTopicsData } from '../data/checklistData';

const languages = [
    { id: 'cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', color: 'border-blue-500', textColor: 'text-blue-400', bgColor: 'bg-blue-500' },
    { id: 'javascript', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'border-yellow-500', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500' },
    { id: 'java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: 'border-orange-500', textColor: 'text-orange-400', bgColor: 'bg-orange-500' },
    { id: 'python', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'border-green-500', textColor: 'text-green-400', bgColor: 'bg-green-500' },
    { id: 'ruby', name: 'Ruby', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg', color: 'border-red-500', textColor: 'text-red-400', bgColor: 'bg-red-500' },
    { id: 'golang', name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg', color: 'border-cyan-500', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500' },
];

export default function HomePage({ calculateLanguageProgress, checkedItems }) {
    // Calculate overall statistics
    const stats = useMemo(() => {
        let totalDSAItems = 0;
        let completedDSAItems = 0;
        let topicsStarted = 0;
        let topicsCompleted = 0;

        const languageStats = languages.map(lang => {
            const progress = calculateLanguageProgress ? calculateLanguageProgress(lang.id) : { dsa: 0, dev: 0, overall: 0 };
            const overall = Math.round((progress.dsa + progress.dev) / 2);

            return {
                ...lang,
                progress
            };
        });

        // Calculate DSA topic statistics
        const topicStats = dsaTopicsData.map(topic => {
            let topicTotal = 0;
            let topicCompleted = 0;

            topic.items.forEach(item => {
                const itemName = typeof item === 'string' ? item : item.name;

                // Count the main topic item
                topicTotal += 1;

                // Check if the main item is completed
                if (checkedItems && checkedItems.dsa && checkedItems.dsa[itemName]) {
                    topicCompleted += 1;
                }

                // If item has resources, count them too
                if (typeof item === 'object' && item.resources) {
                    // Count videos
                    const videoCount = item.resources.videos?.length || 0;
                    topicTotal += videoCount;

                    // Count practice problems
                    const practiceCount = item.resources.practice?.length || 0;
                    topicTotal += practiceCount;

                    // Check completed videos
                    item.resources.videos?.forEach(video => {
                        const videoKey = `${itemName}__videos__${video.title}`;
                        if (checkedItems && checkedItems.dsa && checkedItems.dsa[videoKey]) {
                            topicCompleted += 1;
                        }
                    });

                    // Check completed practice problems
                    item.resources.practice?.forEach(practice => {
                        const practiceKey = `${itemName}__practice__${practice.title}`;
                        if (checkedItems && checkedItems.dsa && checkedItems.dsa[practiceKey]) {
                            topicCompleted += 1;
                        }
                    });
                }
            });

            totalDSAItems += topicTotal;
            completedDSAItems += topicCompleted;

            const topicProgress = topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0;

            // A topic is "started" if at least one item is completed (progress > 0)
            if (topicCompleted > 0) topicsStarted++;

            // A topic is "completed" only if ALL items are completed (100% progress)
            if (topicProgress === 100 && topicTotal > 0) topicsCompleted++;

            return {
                category: topic.category,
                progress: topicProgress,
                completed: topicCompleted,
                total: topicTotal
            };
        });

        const dsaOverallProgress = totalDSAItems > 0 ? Math.round((completedDSAItems / totalDSAItems) * 100) : 0;

        return {
            overallProgress: dsaOverallProgress,
            totalDSAItems,
            completedDSAItems,
            topicsStarted,
            topicsCompleted,
            totalTopics: dsaTopicsData.length,
            languageStats,
            topicStats
        };
    }, [calculateLanguageProgress, checkedItems]);

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex items-center gap-3 md:gap-4 mb-6">
                        <img src="/logo.svg" alt="LEARN.HUB" className="w-10 h-10 md:w-12 md:h-12" />
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-green-500 font-mono">
                                <TypingAnimation text="$ ./learn_hub" speed={80} />
                            </h1>
                            <p className="text-green-400 font-mono text-xs md:text-sm mt-1 md:mt-2">
                                Master Data Structures & Algorithms
                            </p>
                        </div>
                    </div>

                    {/* Overall Progress Ring */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-slate-700">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-slate-700"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.overallProgress / 100)}`}
                                        className="text-green-500 transition-all duration-500"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-green-500 font-mono">
                                        {stats.overallProgress}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-mono text-slate-500 mb-1">DSA OVERALL PROGRESS</div>
                                <div className="text-2xl font-bold text-green-400 font-mono">
                                    {stats.overallProgress}% Complete
                                </div>
                                <div className="text-xs font-mono text-slate-400 mt-1">
                                    {stats.completedDSAItems} of {stats.totalDSAItems} problems solved
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[TOPICS]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">{stats.totalTopics}</div>
                            <div className="text-xs font-mono text-slate-500 mt-1">Total Categories</div>
                        </div>

                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <span className="text-xs font-mono text-yellow-500">[STARTED]</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400 font-mono">{stats.topicsStarted}</div>
                            <div className="text-xs font-mono text-slate-500 mt-1">In Progress</div>
                        </div>

                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[COMPLETED]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">{stats.topicsCompleted}</div>
                            <div className="text-xs font-mono text-slate-500 mt-1">Topics Done</div>
                        </div>

                        <div className="bg-slate-800 border border-green-600 rounded p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-mono text-green-500">[PROBLEMS]</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400 font-mono">{stats.totalDSAItems}</div>
                            <div className="text-xs font-mono text-slate-500 mt-1">Practice Items</div>
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
                    {stats.languageStats.map((lang) => {
                        const overall = Math.round((lang.progress.dsa + lang.progress.dev) / 2);

                        return (
                            <Link
                                key={lang.id}
                                to={`/${lang.id}`}
                                className={`bg-slate-900 border-2 ${lang.color} rounded-lg p-6 hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-${lang.color}/20 group relative overflow-hidden`}
                            >
                                {/* Progress indicator badge */}
                                {overall > 0 && (
                                    <div className="absolute top-3 right-3">
                                        <div className={`${lang.bgColor} text-slate-900 text-xs font-bold font-mono px-2 py-1 rounded`}>
                                            {overall}%
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <img src={lang.icon} alt={lang.name} className="w-12 h-12" />
                                    <div>
                                        <h3 className={`text-xl font-bold ${lang.textColor} font-mono`}>
                                            {lang.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-mono">DSA + Dev Mastery</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-green-500">DSA & Language Mastery</span>
                                        <span className="text-green-400">{lang.progress.dsa}%</span>
                                    </div>
                                    <div className="w-full bg-slate-950/50 rounded-full h-2 border border-slate-700/50">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${lang.progress.dsa}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-green-500">Dev Mastery</span>
                                        <span className="text-green-400">{lang.progress.dev}%</span>
                                    </div>
                                    <div className="w-full bg-slate-950/50 rounded-full h-2 border border-slate-700/50">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${lang.progress.dev}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-xs font-mono text-green-600 group-hover:text-green-500">
                                        → {overall === 0 ? 'START LEARNING' : overall === 100 ? 'REVIEW' : 'CONTINUE'}
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