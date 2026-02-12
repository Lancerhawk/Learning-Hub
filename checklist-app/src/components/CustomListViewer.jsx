import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Play, Code, ExternalLink, RefreshCw, BookOpen, ArrowLeft, Edit, History, Star } from 'lucide-react';
import { customListsAPI, progressAPI, publicListsAPI } from '../utils/api';
import TypingAnimation from './TypingAnimation';
import LineageModal from './LineageModal';
import { useAuth } from '../contexts/AuthContext';

export default function CustomListViewer({ isPublicView = false }) {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [confirmModal, setConfirmModal] = useState(null);
    const [lineageModal, setLineageModal] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);

    const loadList = useCallback(async () => {
        try {
            setLoading(true);
            // Use public-lists API if viewing from explore, otherwise use custom-lists API
            const data = isPublicView
                ? await publicListsAPI.getById(id)
                : await customListsAPI.getById(id);
            setList(data);

            // Set user rating if available
            if (isPublicView && data.userRating) {
                setUserRating(data.userRating);
            }

            // Initialize all sections as expanded
            const expanded = {};
            data.sections?.forEach((_, idx) => {
                expanded[`section-${idx}`] = true;
            });
            setExpandedSections(expanded);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, isPublicView]);

    const loadProgress = useCallback(async () => {
        try {
            const data = await progressAPI.getListProgress(id);
            setProgress(data);
        } catch (err) {
            console.error('Failed to load progress:', err);
        }
    }, [id]);

    useEffect(() => {
        loadList();
        loadProgress();
    }, [loadList, loadProgress]);

    const isItemCompleted = (topicId, resourceId = null) => {
        return progress.some(
            (p) =>
                p.completed &&
                p.topic_id === topicId &&
                (resourceId ? p.resource_id === resourceId : !p.resource_id)
        );
    };

    const toggleSection = (sectionKey) => {
        setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    const toggleTopic = (topicKey) => {
        setExpandedTopics((prev) => ({ ...prev, [topicKey]: !prev[topicKey] }));
    };

    const toggleTopicCompletion = async (topic, hasResources) => {
        if (isPublicView) return; // Disable progress tracking for public view

        if (hasResources && !isItemCompleted(topic.id)) {
            setConfirmModal({ topic, hasResources });
            return;
        }

        try {
            await progressAPI.toggle({
                list_id: id,
                topic_id: topic.id,
            });
            await loadProgress();
        } catch (err) {
            console.error('Failed to toggle topic:', err);
        }
    };

    const confirmTopicCompletion = async (markAllDone) => {
        if (!confirmModal) return;

        try {
            if (markAllDone) {
                await progressAPI.completeTopic({
                    list_id: id,
                    topic_id: confirmModal.topic.id,
                    include_resources: true,
                });
            } else {
                await progressAPI.toggle({
                    list_id: id,
                    topic_id: confirmModal.topic.id,
                });
            }
            await loadProgress();
            setConfirmModal(null);
        } catch (err) {
            console.error('Failed to complete topic:', err);
        }
    };

    const toggleResourceCompletion = async (topicId, resourceId) => {
        if (isPublicView) return; // Disable progress tracking for public view

        try {
            await progressAPI.toggle({
                list_id: id,
                topic_id: topicId,
                resource_id: resourceId,
            });
            await loadProgress();
        } catch (err) {
            console.error('Failed to toggle resource:', err);
        }
    };

    const resetProgress = async () => {
        if (!confirm('Are you sure you want to reset all progress for this list?')) return;

        try {
            await progressAPI.reset(id);
            await loadProgress();
        } catch (err) {
            console.error('Failed to reset progress:', err);
        }
    };

    const calculateSectionProgress = (section) => {
        if (!section.topics || section.topics.length === 0) return 0;

        const completed = section.topics.filter((topic) =>
            isItemCompleted(topic.id)
        ).length;

        return Math.round((completed / section.topics.length) * 100);
    };

    const getTopicResourceProgress = (topic) => {
        if (!topic.resources || topic.resources.length === 0) return 0;

        const completed = topic.resources.filter((resource) =>
            isItemCompleted(topic.id, resource.id)
        ).length;

        return Math.round((completed / topic.resources.length) * 100);
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'video':
                return <Play className="w-4 h-4 text-green-500" />;
            case 'practice':
                return <Code className="w-4 h-4 text-green-500" />;
            default:
                return <ExternalLink className="w-4 h-4 text-green-500" />;
        }
    };

    const getResourceLabel = (type) => {
        switch (type) {
            case 'video':
                return '[VIDEO LECTURES]';
            case 'practice':
                return '[PRACTICE PROBLEMS]';
            case 'note':
                return '[NOTES]';
            default:
                return '[RESOURCES]';
        }
    };

    const handleViewLineage = async () => {
        try {
            const data = await publicListsAPI.getLineage(id);
            setLineageModal(data.lineage);
        } catch (error) {
            console.error('Failed to load lineage:', error);
        }
    };

    const handleRating = async (rating) => {
        try {
            await publicListsAPI.rate(id, rating);
            setUserRating(rating);
            // Reload list to get updated average rating
            await loadList();
        } catch (error) {
            console.error('Failed to rate list:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-green-500 font-mono">Loading...</div>
            </div>
        );
    }

    if (error || !list) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-red-500 font-mono">Error: {error || 'List not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-3 sm:p-4 md:p-6">
            {/* Hero */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-4 sm:p-6 md:p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate(isPublicView ? '/explore' : '/custom-lists')}
                                className="flex-shrink-0 p-2 bg-slate-800 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-slate-900 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <span className="text-2xl sm:text-3xl flex-shrink-0">{list.icon}</span>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-green-500 font-mono break-words">
                                    <TypingAnimation text={list.title} speed={90} />
                                </h1>
                                {list.description && (
                                    <p className="text-green-400 font-mono text-xs sm:text-sm mt-1 break-words">
                                        $ {list.description}
                                    </p>
                                )}
                                {isPublicView && (
                                    <div className="text-slate-500 font-mono text-xs mt-2 flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                                        {list.original_creator_username ? (
                                            <>
                                                <span className="break-words">
                                                    Published by <span className="text-green-500">{list.owner_username}</span>
                                                    {' • '}
                                                    Originally created by <span className="text-blue-400">{list.original_creator_username}</span>
                                                </span>
                                                <button
                                                    onClick={handleViewLineage}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-blue-500 text-blue-400 rounded font-mono text-xs hover:bg-slate-700 transition-all self-start"
                                                >
                                                    <History className="w-3 h-3" />
                                                    View History
                                                </button>
                                            </>
                                        ) : (
                                            <span className="break-words">Created by <span className="text-green-500">{list.owner_username}</span></span>
                                        )}
                                    </div>
                                )}

                                {/* Rating Section - Only for public view and not own list */}
                                {isPublicView && user && list.user_id !== user.id && (
                                    <div className="mt-4 p-4 bg-slate-800/50 border border-green-700 rounded-lg">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div>
                                                <p className="text-green-400 font-mono text-sm font-bold mb-1">
                                                    Rate this list
                                                </p>
                                                <p className="text-slate-500 font-mono text-xs">
                                                    {list.rating_count || 0} rating{(list.rating_count || 0) !== 1 ? 's' : ''} •
                                                    Average: {list.rating_count > 0 ? (list.rating_sum / list.rating_count).toFixed(1) : '0.0'} ⭐
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 font-mono text-xs">Your rating:</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => handleRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="transition-transform hover:scale-110"
                                                        >
                                                            <Star
                                                                className={`w-6 h-6 ${star <= (hoverRating || userRating || 0)
                                                                    ? 'fill-yellow-500 text-yellow-500'
                                                                    : 'text-slate-600'
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isPublicView && (
                            <div className="flex flex-col md:flex-row gap-2">
                                <button
                                    onClick={() => navigate(`/custom-lists/${id}/edit`)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-green-500 text-green-500 rounded font-mono text-sm hover:bg-green-500 hover:text-slate-900 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                    EDIT LIST
                                </button>
                                <button
                                    onClick={resetProgress}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-red-500 text-red-500 rounded font-mono text-sm hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    RESET PROGRESS
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-5xl mx-auto space-y-4">
                {list.sections?.map((section, sectionIndex) => {
                    const sectionKey = `section-${sectionIndex}`;
                    const isSectionExpanded = expandedSections[sectionKey];
                    const sectionProgress = calculateSectionProgress(section);

                    return (
                        <div
                            key={section.id}
                            className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 hover:border-green-600 transition-all"
                        >
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
                                    <span className="text-xl">{section.icon}</span>
                                    <h3 className="text-lg font-bold text-green-400 font-mono group-hover:text-green-300">
                                        {section.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-green-600">{sectionProgress}%</span>
                                    {sectionProgress === 100 && (
                                        <span className="bg-green-500 text-slate-900 px-2 py-1 rounded text-xs font-mono font-bold">
                                            [DONE]
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Section Topics */}
                            <div
                                className={`mt-4 dropdown-content ${!isSectionExpanded ? 'dropdown-content-hidden' : ''
                                    }`}
                            >
                                <div className="dropdown-inner space-y-2">
                                    {section.topics?.map((topic, topicIndex) => {
                                        const topicKey = `${sectionKey}-${topicIndex}`;
                                        const isTopicExpanded = expandedTopics[topicKey];
                                        const isTopicChecked = isItemCompleted(topic.id);
                                        const hasResources =
                                            topic.resources && topic.resources.length > 0;
                                        const resourceProgress = getTopicResourceProgress(topic);

                                        return (
                                            <div key={topic.id}>
                                                <div
                                                    className={`flex items-center gap-3 p-3 rounded border-2 transition-all ${isTopicChecked
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
                                                        onClick={() => toggleTopicCompletion(topic, hasResources)}
                                                        className={`relative flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isPublicView ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                                            } ${isTopicChecked
                                                                ? 'bg-green-500 border-green-500'
                                                                : `border-slate-600 bg-slate-900 ${!isPublicView && 'hover:border-green-500'}`
                                                            }`}
                                                    >
                                                        {isTopicChecked && (
                                                            <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />
                                                        )}
                                                    </div>
                                                    <div
                                                        onClick={() => hasResources && toggleTopic(topicKey)}
                                                        className={`flex-1 flex items-center gap-2 ${hasResources ? 'cursor-pointer' : ''
                                                            }`}
                                                    >
                                                        <span
                                                            className={`text-sm font-mono transition-all duration-200 ${isTopicChecked
                                                                ? 'text-slate-500 line-through'
                                                                : 'text-green-400'
                                                                }`}
                                                        >
                                                            {topic.title}
                                                        </span>
                                                        {hasResources && (
                                                            <span className="text-xs font-mono text-green-600 font-bold">
                                                                [{resourceProgress}%]
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Topic Resources */}
                                                {hasResources && (
                                                    <div
                                                        className={`ml-8 mt-2 dropdown-content ${!isTopicExpanded ? 'dropdown-content-hidden' : ''
                                                            }`}
                                                    >
                                                        <div className="dropdown-inner">
                                                            <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                                                                {/* Group resources by type */}
                                                                {['video', 'practice', 'note', 'link'].map((type) => {
                                                                    const resourcesOfType = topic.resources.filter(
                                                                        (r) => r.type === type
                                                                    );
                                                                    if (resourcesOfType.length === 0) return null;

                                                                    return (
                                                                        <div key={type}>
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                {getResourceIcon(type)}
                                                                                <span className="text-xs font-mono text-green-500 font-bold">
                                                                                    {getResourceLabel(type)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                {resourcesOfType.map((resource) => {
                                                                                    const isResourceChecked = isItemCompleted(
                                                                                        topic.id,
                                                                                        resource.id
                                                                                    );
                                                                                    return (
                                                                                        <div
                                                                                            key={resource.id}
                                                                                            className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700 hover:border-green-700"
                                                                                        >
                                                                                            <div
                                                                                                onClick={() =>
                                                                                                    toggleResourceCompletion(
                                                                                                        topic.id,
                                                                                                        resource.id
                                                                                                    )
                                                                                                }
                                                                                                className={`relative flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isResourceChecked
                                                                                                    ? 'bg-green-500 border-green-500'
                                                                                                    : 'border-slate-600'
                                                                                                    }`}
                                                                                            >
                                                                                                {isResourceChecked && (
                                                                                                    <Check
                                                                                                        className="w-3 h-3 text-slate-900"
                                                                                                        strokeWidth={3}
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                            <a
                                                                                                href={resource.url}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="flex-1 text-xs font-mono text-green-400 hover:text-green-300 flex items-center gap-2"
                                                                                            >
                                                                                                {resource.platform !== 'Custom' && (
                                                                                                    <span className="text-slate-500">
                                                                                                        [{resource.platform}]
                                                                                                    </span>
                                                                                                )}
                                                                                                {resource.title}
                                                                                                <ExternalLink className="w-3 h-3" />
                                                                                            </a>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Subtopics */}
                                                {topic.subtopics && topic.subtopics.length > 0 && (
                                                    <div className="ml-8 mt-2 space-y-2">
                                                        {topic.subtopics.map((subtopic) => {
                                                            const isSubtopicChecked = isItemCompleted(subtopic.id);
                                                            const hasSubResources =
                                                                subtopic.resources && subtopic.resources.length > 0;

                                                            return (
                                                                <div key={subtopic.id}>
                                                                    <div
                                                                        className={`flex items-center gap-3 p-2 rounded border transition-all ${isSubtopicChecked
                                                                            ? 'bg-green-500/10 border-green-500'
                                                                            : 'bg-slate-900 border-slate-700 hover:border-green-600'
                                                                            }`}
                                                                    >
                                                                        <div
                                                                            onClick={() =>
                                                                                toggleTopicCompletion(subtopic, hasSubResources)
                                                                            }
                                                                            className={`relative flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${isSubtopicChecked
                                                                                ? 'bg-green-500 border-green-500'
                                                                                : 'border-slate-600'
                                                                                }`}
                                                                        >
                                                                            {isSubtopicChecked && (
                                                                                <Check
                                                                                    className="w-3 h-3 text-slate-900"
                                                                                    strokeWidth={3}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <span
                                                                            className={`text-xs font-mono ${isSubtopicChecked
                                                                                ? 'text-slate-500 line-through'
                                                                                : 'text-green-400'
                                                                                }`}
                                                                        >
                                                                            {subtopic.title}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
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
            {confirmModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-green-500/30">
                        <h3 className="text-xl font-bold text-green-500 font-mono mb-4">
                            [CONFIRM COMPLETION]
                        </h3>
                        <p className="text-green-400 font-mono text-sm mb-6">
                            Mark "<span className="text-green-300">{confirmModal.topic.title}</span>" as
                            complete?
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

            {/* Lineage Modal */}
            {lineageModal && (
                <LineageModal
                    lineage={lineageModal}
                    onClose={() => setLineageModal(null)}
                />
            )}
        </div>
    );
}
