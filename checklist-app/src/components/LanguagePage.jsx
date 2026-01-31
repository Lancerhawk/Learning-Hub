import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Play, Code, ExternalLink, RefreshCw } from 'lucide-react';
import TypingAnimation from './TypingAnimation';

export default function LanguagePage({
    language,
    data,
    checkedItems,
    expandedSections,
    expandedTopics,
    toggleSection,
    toggleTopic,
    toggleItem,
    toggleResourceItem,
    calculateSectionProgress,
    getTopicResourceProgress,
    confirmModal,
    setConfirmModal,
    confirmTopicCompletion,
    resetProgress
}) {
    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-green-500 font-mono">Loading...</div>
            </div>
        );
    }

    const { name, icon, dsaMastery, devMastery } = data;

    // State for progress view toggle
    const [progressView, setProgressView] = useState('overall'); // 'dsa', 'dev', or 'overall'

    // Calculate progress for each section
    const calculateOverallSectionProgress = (sections, sectionType) => {
        const allItems = sections.flatMap(s => s.items);
        if (allItems.length === 0) return 0;
        const completed = allItems.filter(item => {
            const itemName = typeof item === 'string' ? item : item.name;
            return checkedItems[itemName];
        }).length;
        return Math.round((completed / allItems.length) * 100);
    };

    const dsaProgress = calculateOverallSectionProgress(dsaMastery, 'dsa');
    const devProgress = calculateOverallSectionProgress(devMastery, 'dev');
    const overallProgress = Math.round((dsaProgress + devProgress) / 2);

    const getCurrentProgress = () => {
        if (progressView === 'dsa') return dsaProgress;
        if (progressView === 'dev') return devProgress;
        return overallProgress;
    };

    const renderSection = (sectionData, sectionType) => {
        return sectionData.map((section, sectionIndex) => {
            const sectionKey = `${language}-${sectionType}-${sectionIndex}`;
            const isSectionExpanded = expandedSections[sectionKey];
            const progress = calculateSectionProgress(section.items, language, sectionType);

            return (
                <div key={sectionIndex} className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 hover:border-green-600 transition-all print-break-inside">
                    {/* Section Header */}
                    <div
                        onClick={() => toggleSection(sectionKey)}
                        className="flex items-center justify-between cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <ChevronDown
                                className={`w-5 h-5 text-green-500 transition-transform ${isSectionExpanded ? '' : '-rotate-90'
                                    }`}
                            />
                            <div className="text-green-500">{section.icon}</div>
                            <h3 className="text-lg font-bold text-green-400 font-mono group-hover:text-green-300">
                                {section.category}
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-green-600">{progress}%</span>
                            {progress === 100 && (
                                <span className="bg-green-500 text-slate-900 px-2 py-1 rounded text-xs font-mono font-bold">
                                    [DONE]
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Section Items */}
                    <div className={`mt-4 dropdown-content ${!isSectionExpanded ? 'dropdown-content-hidden' : ''}`}>
                        <div className="dropdown-inner space-y-2">
                            {section.items.map((item, itemIndex) => {
                                const isSimpleItem = typeof item === 'string';
                                const itemName = isSimpleItem ? item : item.name;
                                const topicKey = `${sectionKey}-${itemIndex}`;
                                const isTopicExpanded = expandedTopics[topicKey];
                                const isChecked = !!checkedItems[itemName];

                                return (
                                    <div key={itemIndex}>
                                        <div
                                            className={`flex items-center gap-3 p-3 rounded border-2 transition-all ${isChecked
                                                ? 'bg-green-500/10 border-green-500'
                                                : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-green-600'
                                                }`}
                                        >
                                            {!isSimpleItem && (
                                                <div
                                                    onClick={() => toggleTopic(topicKey)}
                                                    className="flex-shrink-0"
                                                >
                                                    <ChevronRight
                                                        className={`w-4 h-4 text-green-500 transition-transform ${isTopicExpanded ? 'rotate-90' : ''
                                                            }`}
                                                    />
                                                </div>
                                            )}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleItem(itemName, language, sectionType, !isSimpleItem);
                                                }}
                                                className={`relative flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${isChecked
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-slate-600 bg-slate-900 hover:border-green-500'
                                                    }`}
                                            >
                                                {isChecked && (
                                                    <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />
                                                )}
                                            </div>
                                            <div
                                                onClick={() => !isSimpleItem && toggleTopic(topicKey)}
                                                className={`flex-1 flex items-center gap-2 ${!isSimpleItem ? 'cursor-pointer' : ''}`}
                                            >
                                                <span
                                                    className={`text-sm font-mono transition-all duration-200 ${isChecked ? 'text-slate-500 line-through' : 'text-green-400'
                                                        }`}
                                                >
                                                    {itemName}
                                                </span>
                                                {!isSimpleItem && (
                                                    <span className="text-xs font-mono text-green-600 font-bold">
                                                        [{getTopicResourceProgress(itemName, language, sectionType)}%]
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Nested Resources */}
                                        {!isSimpleItem && item.resources && (
                                            <div className={`ml-8 mt-2 dropdown-content ${!isTopicExpanded ? 'dropdown-content-hidden' : ''}`}>
                                                <div className="dropdown-inner">
                                                    <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                                                        {/* Videos */}
                                                        {item.resources.videos && item.resources.videos.length > 0 && (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Play className="w-4 h-4 text-green-500" />
                                                                    <span className="text-xs font-mono text-green-500 font-bold">[VIDEO LECTURES]</span>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {item.resources.videos.map((video, vIdx) => {
                                                                        const videoKey = `${itemName}__videos__${video.title}`;
                                                                        const isVideoChecked = !!checkedItems[videoKey];
                                                                        return (
                                                                            <div key={vIdx} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700">
                                                                                <div
                                                                                    onClick={() => toggleResourceItem(itemName, 'videos', video.title, language, sectionType)}
                                                                                    className={`relative flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isVideoChecked ? 'bg-green-500 border-green-500' : 'border-slate-600'
                                                                                        }`}
                                                                                >
                                                                                    {isVideoChecked && <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />}
                                                                                </div>
                                                                                <a
                                                                                    href={video.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex-1 text-xs font-mono text-green-400 hover:text-green-300 flex items-center gap-2"
                                                                                >
                                                                                    {video.title}
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Practice */}
                                                        {item.resources.practice && item.resources.practice.length > 0 && (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Code className="w-4 h-4 text-green-500" />
                                                                    <span className="text-xs font-mono text-green-500 font-bold">[PRACTICE PROBLEMS]</span>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {item.resources.practice.map((problem, pIdx) => {
                                                                        const problemKey = `${itemName}__practice__${problem.title}`;
                                                                        const isProblemChecked = !!checkedItems[problemKey];
                                                                        return (
                                                                            <div key={pIdx} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700">
                                                                                <div
                                                                                    onClick={() => toggleResourceItem(itemName, 'practice', problem.title, language, sectionType)}
                                                                                    className={`relative flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isProblemChecked ? 'bg-green-500 border-green-500' : 'border-slate-600'
                                                                                        }`}
                                                                                >
                                                                                    {isProblemChecked && <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />}
                                                                                </div>
                                                                                <a
                                                                                    href={problem.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex-1 text-xs font-mono text-green-400 hover:text-green-300 flex items-center gap-2"
                                                                                >
                                                                                    <span className="text-slate-500">[{problem.platform}]</span>
                                                                                    {problem.title}
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Hero */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img src={icon} alt={name} className="w-12 h-12 md:w-16 md:h-16" />
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-green-500 font-mono">
                                    <TypingAnimation text={name} speed={100} />
                                </h1>
                                <p className="text-green-400 font-mono text-xs md:text-sm mt-1">
                                    $ master {name.toLowerCase()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => resetProgress(language)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-red-500 text-red-500 rounded font-mono text-sm hover:bg-red-500 hover:text-white transition-all w-full md:w-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            RESET
                        </button>
                    </div>

                    {/* Progress Meter */}
                    <div className="border-t-2 border-slate-700 pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setProgressView('overall')}
                                    className={`px-3 md:px-4 py-2 rounded font-mono text-xs transition-all ${progressView === 'overall'
                                        ? 'bg-green-500 text-slate-900 font-bold'
                                        : 'bg-slate-800 text-green-500 border border-green-700 hover:bg-slate-700'
                                        }`}
                                >
                                    OVERALL
                                </button>
                                <button
                                    onClick={() => setProgressView('dsa')}
                                    className={`px-3 md:px-4 py-2 rounded font-mono text-xs transition-all whitespace-nowrap ${progressView === 'dsa'
                                        ? 'bg-green-500 text-slate-900 font-bold'
                                        : 'bg-slate-800 text-green-500 border border-green-700 hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="hidden sm:inline">DSA & Language MASTERY</span>
                                    <span className="sm:hidden">DSA MASTERY</span>
                                </button>
                                <button
                                    onClick={() => setProgressView('dev')}
                                    className={`px-3 md:px-4 py-2 rounded font-mono text-xs transition-all whitespace-nowrap ${progressView === 'dev'
                                        ? 'bg-green-500 text-slate-900 font-bold'
                                        : 'bg-slate-800 text-green-500 border border-green-700 hover:bg-slate-700'
                                        }`}
                                >
                                    DEV MASTERY
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs font-mono text-slate-500">
                                        {progressView === 'overall' ? 'Overall Progress' :
                                            progressView === 'dsa' ? 'DSA & Language Mastery' : 'Development Mastery'}
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-green-500 font-mono">
                                        {getCurrentProgress()}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-green-600 to-green-400 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                style={{ width: `${getCurrentProgress()}%` }}
                            >
                                {getCurrentProgress() > 5 && (
                                    <span className="text-xs font-mono font-bold text-slate-900">
                                        {getCurrentProgress()}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Individual Progress Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-800 rounded p-3 border border-slate-700">
                                <div className="text-xs font-mono text-slate-500 mb-1">DSA & Language Mastery</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dsaProgress}%` }} />
                                    </div>
                                    <span className="text-sm font-mono text-green-400 font-bold">{dsaProgress}%</span>
                                </div>
                            </div>
                            <div className="bg-slate-800 rounded p-3 border border-slate-700">
                                <div className="text-xs font-mono text-slate-500 mb-1">Dev Mastery</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${devProgress}%` }} />
                                    </div>
                                    <span className="text-sm font-mono text-green-400 font-bold">{devProgress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-5xl mx-auto space-y-8">
                {/* DSA Mastery */}
                <div>
                    <div
                        onClick={() => toggleSection(`${language}-main-dsa`)}
                        className="flex items-center gap-2 cursor-pointer group mb-4"
                    >
                        <ChevronDown
                            className={`w-6 h-6 text-green-500 transition-transform ${expandedSections[`${language}-main-dsa`] !== false ? '' : '-rotate-90'
                                }`}
                        />
                        <Code className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-500 font-mono group-hover:text-green-400 transition-colors">
                            [DSA & Language MASTERY]
                        </h2>
                    </div>
                    <div className={`dropdown-content ${expandedSections[`${language}-main-dsa`] === false ? 'dropdown-content-hidden' : ''}`}>
                        <div className="dropdown-inner space-y-4">
                            {renderSection(dsaMastery, 'dsa')}
                        </div>
                    </div>
                </div>

                {/* Development Mastery */}
                <div>
                    <div
                        onClick={() => toggleSection(`${language}-main-dev`)}
                        className="flex items-center gap-2 cursor-pointer group mb-4"
                    >
                        <ChevronDown
                            className={`w-6 h-6 text-green-500 transition-transform ${expandedSections[`${language}-main-dev`] !== false ? '' : '-rotate-90'
                                }`}
                        />
                        <Code className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-500 font-mono group-hover:text-green-400 transition-colors">
                            [DEVELOPMENT MASTERY]
                        </h2>
                    </div>
                    <div className={`dropdown-content ${expandedSections[`${language}-main-dev`] === false ? 'dropdown-content-hidden' : ''}`}>
                        <div className="dropdown-inner space-y-4">
                            {renderSection(devMastery, 'dev')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-green-500/30">
                        <h3 className="text-xl font-bold text-green-500 font-mono mb-4">
                            [CONFIRM COMPLETION]
                        </h3>
                        <p className="text-green-400 font-mono text-sm mb-6">
                            Mark "<span className="text-green-300">{confirmModal.item}</span>" as complete?
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => confirmTopicCompletion(true)}
                                className="w-full bg-green-500 text-slate-900 px-4 py-3 rounded font-mono font-bold hover:bg-green-400 transition-all"
                            >
                                ✓ Mark topic + all resources as done
                            </button>
                            <button
                                onClick={() => confirmTopicCompletion(false)}
                                className="w-full bg-slate-800 border border-green-500 text-green-500 px-4 py-3 rounded font-mono font-bold hover:bg-slate-700 transition-all"
                            >
                                ✓ Mark only topic as done
                            </button>
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="w-full bg-slate-800 border border-red-500 text-red-500 px-4 py-3 rounded font-mono font-bold hover:bg-red-500 hover:text-white transition-all"
                            >
                                ✗ CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
