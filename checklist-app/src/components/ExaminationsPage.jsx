import React from 'react';
import { Check, ChevronDown, ChevronRight, Play, Code, ExternalLink, RefreshCw, GraduationCap, BookOpen } from 'lucide-react';
import TypingAnimation from './TypingAnimation';

export default function ExaminationsPage({
    examData,
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
    if (!examData) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-green-500 font-mono">Loading examination data...</div>
            </div>
        );
    }

    // Check if exam is coming soon (empty or no sections)
    const isComingSoon = !examData.sections || examData.sections.length === 0 ||
        !examData.sections.some(section => section.topics && section.topics.length > 0);

    if (isComingSoon) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="bg-slate-900 border-2 border-yellow-500 rounded-lg p-8 shadow-2xl shadow-yellow-500/20">
                        <div className="text-center">
                            <GraduationCap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-yellow-500 font-mono mb-2">
                                {examData.name}
                            </h1>
                            <p className="text-yellow-400 font-mono text-sm mb-6">
                                {examData.stream} • {examData.year}
                            </p>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-4">
                                <p className="text-2xl font-bold text-yellow-400 font-mono mb-2">
                                    🚧 COMING SOON 🚧
                                </p>
                                <p className="text-green-400 font-mono text-sm">
                                    This examination content is currently being prepared.
                                    <br />
                                    Check back soon for comprehensive study materials!
                                </p>
                            </div>
                            <p className="text-green-600 font-mono text-xs">
                                $ Stay tuned for updates...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Hero */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-green-500 font-mono">
                                    <TypingAnimation text={examData.name} speed={90} />
                                </h1>
                                <p className="text-green-400 font-mono text-xs md:text-sm mt-1">
                                    $ {examData.stream} • {examData.year}
                                </p>
                                {examData.description && (
                                    <p className="text-green-600 font-mono text-xs mt-1">
                                        {examData.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => resetProgress(examData.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-red-500 text-red-500 rounded font-mono text-sm hover:bg-red-500 hover:text-white transition-all w-full md:w-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            RESET
                        </button>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-5xl mx-auto space-y-4">
                {examData.sections.map((section, sectionIndex) => {
                    const sectionKey = `${examData.id}-${sectionIndex}`;
                    const isSectionExpanded = expandedSections[sectionKey];
                    const progress = calculateSectionProgress(section.topics, examData.id);

                    return (
                        <div key={sectionIndex} className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 hover:border-green-600 transition-all">
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
                                    <BookOpen className="w-5 h-5 text-green-500" />
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

                            {/* Section Topics */}
                            <div className={`mt-4 dropdown-content ${!isSectionExpanded ? 'dropdown-content-hidden' : ''}`}>
                                <div className="dropdown-inner space-y-2">
                                    {section.topics.map((topic, topicIndex) => {
                                        const topicName = topic.name;
                                        const topicKey = `${sectionKey}-${topicIndex}`;
                                        const isTopicExpanded = expandedTopics[topicKey];
                                        const isChecked = !!checkedItems[topicName];
                                        const hasResources = topic.resources && (
                                            (topic.resources.videos && topic.resources.videos.length > 0) ||
                                            (topic.resources.practice && topic.resources.practice.length > 0) ||
                                            (topic.resources.references && topic.resources.references.length > 0)
                                        );

                                        return (
                                            <div key={topicIndex}>
                                                <div
                                                    className={`flex items-center gap-3 p-3 rounded border-2 transition-all ${isChecked
                                                        ? 'bg-green-500/10 border-green-500'
                                                        : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-green-600'
                                                        }`}
                                                >
                                                    {hasResources && (
                                                        <div
                                                            onClick={() => toggleTopic(topicKey)}
                                                            className="flex-shrink-0 cursor-pointer"
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
                                                            toggleItem(topicName, examData.id, null, hasResources);
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
                                                        onClick={() => hasResources && toggleTopic(topicKey)}
                                                        className={`flex-1 ${hasResources ? 'cursor-pointer' : ''}`}
                                                    >
                                                        <span
                                                            className={`text-sm font-mono transition-all duration-200 ${isChecked ? 'text-slate-500 line-through' : 'text-green-400'
                                                                }`}
                                                        >
                                                            {topicName}
                                                        </span>
                                                        {hasResources && (
                                                            <span className="text-xs font-mono text-green-600 font-bold ml-2">
                                                                [{getTopicResourceProgress(topicName, examData.id)}%]
                                                            </span>
                                                        )}
                                                        {/* Subtopics */}
                                                        {topic.subtopics && topic.subtopics.length > 0 && (
                                                            <div className="mt-2 ml-4 space-y-1">
                                                                {topic.subtopics.map((subtopic, subIdx) => (
                                                                    <div key={subIdx} className="flex items-start gap-2">
                                                                        <span className="text-green-600 text-xs mt-0.5">•</span>
                                                                        <span className="text-xs font-mono text-green-600">
                                                                            {subtopic}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Nested Resources */}
                                                {hasResources && (
                                                    <div className={`ml-8 mt-2 dropdown-content ${!isTopicExpanded ? 'dropdown-content-hidden' : ''}`}>
                                                        <div className="dropdown-inner">
                                                            <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                                                                {/* Videos */}
                                                                {topic.resources.videos && topic.resources.videos.length > 0 && (
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Play className="w-4 h-4 text-green-500" />
                                                                            <span className="text-xs font-mono text-green-500 font-bold">[VIDEO LECTURES]</span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {topic.resources.videos.map((video, vIdx) => {
                                                                                const videoKey = `${topicName}__videos__${video.title}`;
                                                                                const isVideoChecked = !!checkedItems[videoKey];
                                                                                return (
                                                                                    <div key={vIdx} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700">
                                                                                        <div
                                                                                            onClick={() => toggleResourceItem(topicName, 'videos', video.title, examData.id)}
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
                                                                                            {video.channel && <span className="text-slate-500">[{video.channel}]</span>}
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
                                                                {topic.resources.practice && topic.resources.practice.length > 0 && (
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Code className="w-4 h-4 text-green-500" />
                                                                            <span className="text-xs font-mono text-green-500 font-bold">[PRACTICE QUESTIONS]</span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {topic.resources.practice.map((problem, pIdx) => {
                                                                                const problemKey = `${topicName}__practice__${problem.title}`;
                                                                                const isProblemChecked = !!checkedItems[problemKey];
                                                                                return (
                                                                                    <div key={pIdx} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700">
                                                                                        <div
                                                                                            onClick={() => toggleResourceItem(topicName, 'practice', problem.title, examData.id)}
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
                                                                                            {problem.platform && <span className="text-slate-500">[{problem.platform}]</span>}
                                                                                            {problem.title}
                                                                                            <ExternalLink className="w-3 h-3" />
                                                                                        </a>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* References */}
                                                                {topic.resources.references && topic.resources.references.length > 0 && (
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <BookOpen className="w-4 h-4 text-green-500" />
                                                                            <span className="text-xs font-mono text-green-500 font-bold">[REFERENCES]</span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {topic.resources.references.map((ref, rIdx) => {
                                                                                const refKey = `${topicName}__references__${ref.title}`;
                                                                                const isRefChecked = !!checkedItems[refKey];
                                                                                return (
                                                                                    <div key={rIdx} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700">
                                                                                        <div
                                                                                            onClick={() => toggleResourceItem(topicName, 'references', ref.title, examData.id)}
                                                                                            className={`relative flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isRefChecked ? 'bg-green-500 border-green-500' : 'border-slate-600'
                                                                                                }`}
                                                                                        >
                                                                                            {isRefChecked && <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />}
                                                                                        </div>
                                                                                        <a
                                                                                            href={ref.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="flex-1 text-xs font-mono text-green-400 hover:text-green-300 flex items-center gap-2"
                                                                                        >
                                                                                            {ref.title}
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
                })}
            </div>

            {/* Confirmation Modal */}
            {
                confirmModal && (
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
                )
            }
        </div>
    );
}
