import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    X,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    BookOpen,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import {
    customListsAPI,
    sectionsAPI,
    topicsAPI,
    resourcesAPI,
} from '../utils/api';

const EMOJI_LIST = [
    '📚', '🎯', '💻', '🚀', '🔥', '⚡', '🌟', '💡',
    '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎯', '🎪',
    '🌈', '🌊', '🌍', '🌙', '⭐', '☀️', '🌤️', '⛅',
    '🔬', '🔭', '🔮', '🎓', '📖', '📝', '📊', '📈',
];

const RESOURCE_TYPES = [
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'practice', label: 'Practice Problem', icon: '💪' },
    { value: 'note', label: 'Notes/Article', icon: '📝' },
    { value: 'link', label: 'Link/Resource', icon: '🔗' },
];

export default function ListBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id && id !== 'new';

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // List data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('📚');
    const [isPublic, setIsPublic] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Sections
    const [sections, setSections] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});

    // Validation errors
    const [errors, setErrors] = useState({});

    // Modals
    const [successModal, setSuccessModal] = useState(null);
    const [errorModal, setErrorModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    // Refs for scrolling
    const titleRef = useRef(null);
    const sectionRefs = useRef({});
    const topicRefs = useRef({});
    const resourceRefs = useRef({});

    useEffect(() => {
        if (isEditMode) {
            loadList();
        }
    }, [id]);

    const loadList = async () => {
        try {
            setLoading(true);
            const data = await customListsAPI.getById(id);
            setTitle(data.title || '');
            setDescription(data.description || '');
            setIcon(data.icon || '📚');
            setIsPublic(data.is_public || false);
            setSections(data.sections || []);

            // Expand all sections
            const expanded = {};
            data.sections?.forEach((_, idx) => {
                expanded[idx] = true;
            });
            setExpandedSections(expanded);
        } catch (err) {
            setErrorModal({
                title: 'Failed to Load List',
                message: err.message,
                onClose: () => {
                    setErrorModal(null);
                    navigate('/custom-lists');
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate title
        if (!title.trim()) {
            newErrors.title = 'List title is required';
        }

        // Validate sections
        sections.forEach((section, sIdx) => {
            if (!section.title.trim()) {
                newErrors[`section_${sIdx}`] = 'Section title is required';
            }

            // Validate topics
            section.topics?.forEach((topic, tIdx) => {
                if (!topic.title.trim()) {
                    newErrors[`topic_${sIdx}_${tIdx}`] = 'Topic title is required';
                }

                // Validate resources
                topic.resources?.forEach((resource, rIdx) => {
                    if (!resource.title.trim()) {
                        newErrors[`resource_title_${sIdx}_${tIdx}_${rIdx}`] = 'Resource title is required';
                    }
                    if (!resource.url.trim()) {
                        newErrors[`resource_url_${sIdx}_${tIdx}_${rIdx}`] = 'Resource URL is required';
                    } else if (!isValidUrl(resource.url)) {
                        newErrors[`resource_url_${sIdx}_${tIdx}_${rIdx}`] = 'Invalid URL format';
                    }
                });
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const scrollToFirstError = () => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length === 0) return;

        const firstError = errorKeys[0];

        if (firstError === 'title') {
            titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            titleRef.current?.focus();
        } else if (firstError.startsWith('section_')) {
            const sIdx = parseInt(firstError.split('_')[1]);
            sectionRefs.current[sIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sectionRefs.current[sIdx]?.focus();
        } else if (firstError.startsWith('topic_')) {
            const [, sIdx, tIdx] = firstError.split('_').map(Number);
            topicRefs.current[`${sIdx}_${tIdx}`]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            topicRefs.current[`${sIdx}_${tIdx}`]?.focus();
        } else if (firstError.startsWith('resource_')) {
            const parts = firstError.split('_');
            const sIdx = parseInt(parts[2]);
            const tIdx = parseInt(parts[3]);
            const rIdx = parseInt(parts[4]);
            resourceRefs.current[`${sIdx}_${tIdx}_${rIdx}`]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            resourceRefs.current[`${sIdx}_${tIdx}_${rIdx}`]?.focus();
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            scrollToFirstError();
        }
    }, [errors]);

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            if (isEditMode) {
                // Update existing list
                await customListsAPI.update(id, { title, description, icon, is_public: isPublic });

                // Update sections, topics, and resources
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];

                    if (section.id) {
                        await sectionsAPI.update(section.id, {
                            title: section.title,
                            icon: section.icon,
                            order_index: i,
                        });
                    } else {
                        const newSection = await sectionsAPI.create({
                            list_id: id,
                            title: section.title,
                            icon: section.icon,
                            order_index: i,
                        });
                        section.id = newSection.id;
                    }

                    if (section.topics) {
                        for (let j = 0; j < section.topics.length; j++) {
                            const topic = section.topics[j];

                            if (topic.id) {
                                await topicsAPI.update(topic.id, {
                                    title: topic.title,
                                    order_index: j,
                                });
                            } else {
                                const newTopic = await topicsAPI.create({
                                    section_id: section.id,
                                    title: topic.title,
                                    order_index: j,
                                });
                                topic.id = newTopic.id;
                            }

                            if (topic.resources) {
                                for (let k = 0; k < topic.resources.length; k++) {
                                    const resource = topic.resources[k];

                                    if (resource.id) {
                                        await resourcesAPI.update(resource.id, {
                                            type: resource.type,
                                            title: resource.title,
                                            url: resource.url,
                                            order_index: k,
                                        });
                                    } else {
                                        await resourcesAPI.create({
                                            topic_id: topic.id,
                                            type: resource.type,
                                            title: resource.title,
                                            url: resource.url,
                                            order_index: k,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                setSuccessModal({
                    title: 'List Updated!',
                    message: 'Your learning list has been updated successfully.',
                    onClose: () => {
                        setSuccessModal(null);
                        navigate(`/custom-lists/${id}`);
                    }
                });
            } else {
                // Create new list
                const newList = await customListsAPI.create({ title, description, icon, is_public: isPublic });

                // Create sections, topics, and resources
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const newSection = await sectionsAPI.create({
                        list_id: newList.id,
                        title: section.title,
                        icon: section.icon,
                        order_index: i,
                    });

                    if (section.topics) {
                        for (let j = 0; j < section.topics.length; j++) {
                            const topic = section.topics[j];
                            const newTopic = await topicsAPI.create({
                                section_id: newSection.id,
                                title: topic.title,
                                order_index: j,
                            });

                            if (topic.resources) {
                                for (let k = 0; k < topic.resources.length; k++) {
                                    const resource = topic.resources[k];
                                    await resourcesAPI.create({
                                        topic_id: newTopic.id,
                                        type: resource.type,
                                        title: resource.title,
                                        url: resource.url,
                                        order_index: k,
                                    });
                                }
                            }
                        }
                    }
                }

                setSuccessModal({
                    title: 'List Created!',
                    message: 'Your learning list has been created successfully.',
                    onClose: () => {
                        setSuccessModal(null);
                        navigate(`/custom-lists/${newList.id}`);
                    }
                });
            }
        } catch (err) {
            setErrorModal({
                title: 'Failed to Save',
                message: err.message || 'An error occurred while saving your list.',
                onClose: () => setErrorModal(null)
            });
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        setSections([
            ...sections,
            {
                title: '',
                icon: '📁',
                topics: [],
            },
        ]);
        setExpandedSections({ ...expandedSections, [sections.length]: true });
    };

    const removeSection = async (index) => {
        const section = sections[index];
        if (section.id) {
            setDeleteModal({
                title: 'Delete Section?',
                message: 'This will also delete all topics and resources in this section. This action cannot be undone.',
                onConfirm: async () => {
                    try {
                        await sectionsAPI.delete(section.id);
                        setSections(sections.filter((_, i) => i !== index));
                        setDeleteModal(null);
                    } catch (err) {
                        setErrorModal({
                            title: 'Failed to Delete',
                            message: err.message,
                            onClose: () => setErrorModal(null)
                        });
                        setDeleteModal(null);
                    }
                },
                onCancel: () => setDeleteModal(null)
            });
        } else {
            setSections(sections.filter((_, i) => i !== index));
        }
    };

    const updateSection = (index, field, value) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);

        // Clear error for this field
        const newErrors = { ...errors };
        delete newErrors[`section_${index}`];
        setErrors(newErrors);
    };

    const addTopic = (sectionIndex) => {
        const newSections = [...sections];
        if (!newSections[sectionIndex].topics) {
            newSections[sectionIndex].topics = [];
        }
        newSections[sectionIndex].topics.push({
            title: '',
            resources: [],
        });
        setSections(newSections);
    };

    const removeTopic = async (sectionIndex, topicIndex) => {
        const topic = sections[sectionIndex].topics[topicIndex];
        if (topic.id) {
            setDeleteModal({
                title: 'Delete Topic?',
                message: 'This will also delete all resources in this topic. This action cannot be undone.',
                onConfirm: async () => {
                    try {
                        await topicsAPI.delete(topic.id);
                        const newSections = [...sections];
                        newSections[sectionIndex].topics = newSections[sectionIndex].topics.filter(
                            (_, i) => i !== topicIndex
                        );
                        setSections(newSections);
                        setDeleteModal(null);
                    } catch (err) {
                        setErrorModal({
                            title: 'Failed to Delete',
                            message: err.message,
                            onClose: () => setErrorModal(null)
                        });
                        setDeleteModal(null);
                    }
                },
                onCancel: () => setDeleteModal(null)
            });
        } else {
            const newSections = [...sections];
            newSections[sectionIndex].topics = newSections[sectionIndex].topics.filter(
                (_, i) => i !== topicIndex
            );
            setSections(newSections);
        }
    };

    const updateTopic = (sectionIndex, topicIndex, field, value) => {
        const newSections = [...sections];
        newSections[sectionIndex].topics[topicIndex][field] = value;
        setSections(newSections);

        // Clear error for this field
        const newErrors = { ...errors };
        delete newErrors[`topic_${sectionIndex}_${topicIndex}`];
        setErrors(newErrors);
    };

    const addResource = (sectionIndex, topicIndex) => {
        const newSections = [...sections];
        if (!newSections[sectionIndex].topics[topicIndex].resources) {
            newSections[sectionIndex].topics[topicIndex].resources = [];
        }
        newSections[sectionIndex].topics[topicIndex].resources.push({
            type: 'video',
            title: '',
            url: '',
        });
        setSections(newSections);
    };

    const removeResource = async (sectionIndex, topicIndex, resourceIndex) => {
        const resource = sections[sectionIndex].topics[topicIndex].resources[resourceIndex];
        if (resource.id) {
            try {
                await resourcesAPI.delete(resource.id);
            } catch (err) {
                setErrorModal({
                    title: 'Failed to Delete',
                    message: err.message,
                    onClose: () => setErrorModal(null)
                });
                return;
            }
        }
        const newSections = [...sections];
        newSections[sectionIndex].topics[topicIndex].resources = newSections[
            sectionIndex
        ].topics[topicIndex].resources.filter((_, i) => i !== resourceIndex);
        setSections(newSections);
    };

    const updateResource = (sectionIndex, topicIndex, resourceIndex, field, value) => {
        const newSections = [...sections];
        newSections[sectionIndex].topics[topicIndex].resources[resourceIndex][field] = value;
        setSections(newSections);

        // Clear error for this field
        const newErrors = { ...errors };
        delete newErrors[`resource_${field}_${sectionIndex}_${topicIndex}_${resourceIndex}`];
        setErrors(newErrors);
    };

    const toggleSection = (index) => {
        setExpandedSections({
            ...expandedSections,
            [index]: !expandedSections[index],
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-green-500 font-mono">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-4 sm:p-6 mb-6 shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/custom-lists')}
                                className="p-2 bg-slate-800 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-slate-900 transition-all flex-shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
                            <h1 className="text-lg sm:text-2xl font-bold text-green-500 font-mono">
                                {isEditMode ? '[EDIT LIST]' : '[CREATE NEW LIST]'}
                            </h1>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/custom-lists')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-red-500 text-red-500 rounded font-mono text-xs sm:text-sm hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                                CANCEL
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-slate-900 rounded font-mono text-xs sm:text-sm font-bold hover:bg-green-400 transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'SAVING...' : 'SAVE'}
                            </button>
                        </div>
                    </div>

                    {/* List Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Icon Picker */}
                            <div className="relative">
                                <label className="block text-xs font-mono text-green-500 mb-2">
                                    ICON
                                </label>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-3xl sm:text-4xl p-2 bg-slate-800 border-2 border-slate-700 rounded hover:border-green-500 transition-all"
                                >
                                    {icon}
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute top-full mt-2 bg-slate-800 border-2 border-green-500 rounded-lg p-3 grid grid-cols-6 sm:grid-cols-8 gap-2 z-10 shadow-xl max-w-xs sm:max-w-none">
                                        {EMOJI_LIST.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    setIcon(emoji);
                                                    setShowEmojiPicker(false);
                                                }}
                                                className="text-xl sm:text-2xl hover:bg-slate-700 p-1 rounded transition-all"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div className="flex-1">
                                <label className="block text-xs font-mono text-green-500 mb-2">
                                    TITLE *
                                </label>
                                <input
                                    ref={titleRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        const newErrors = { ...errors };
                                        delete newErrors.title;
                                        setErrors(newErrors);
                                    }}
                                    placeholder="e.g., Web Development Roadmap"
                                    className={`w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 rounded text-green-400 font-mono text-sm sm:text-base focus:outline-none ${errors.title ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                                        }`}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-mono text-green-500 mb-2">
                                DESCRIPTION
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of this learning list..."
                                rows={2}
                                className="w-full px-3 sm:px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded text-green-400 font-mono text-sm sm:text-base focus:border-green-500 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Public/Private Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-800 border-2 border-slate-700 rounded">
                            <div className="flex-1">
                                <label className="block text-xs font-mono text-green-500 mb-1">
                                    VISIBILITY
                                </label>
                                <p className="text-xs text-slate-400 font-mono">
                                    {isPublic ? 'Public - Visible in community marketplace' : 'Private - Only visible to you'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPublic(!isPublic)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-green-500' : 'bg-slate-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-4 mb-6">
                    {sections.map((section, sectionIndex) => (
                        <div
                            key={sectionIndex}
                            className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <button
                                    onClick={() => toggleSection(sectionIndex)}
                                    className="p-1 text-green-500 hover:bg-slate-800 rounded"
                                >
                                    {expandedSections[sectionIndex] ? (
                                        <ChevronDown className="w-5 h-5" />
                                    ) : (
                                        <ChevronUp className="w-5 h-5" />
                                    )}
                                </button>
                                <input
                                    type="text"
                                    value={section.icon}
                                    onChange={(e) => updateSection(sectionIndex, 'icon', e.target.value)}
                                    className="w-12 text-center text-xl bg-slate-800 border border-slate-700 rounded focus:border-green-500 focus:outline-none"
                                    maxLength={2}
                                />
                                <input
                                    ref={(el) => (sectionRefs.current[sectionIndex] = el)}
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                                    placeholder="Section title..."
                                    className={`flex-1 px-3 py-2 bg-slate-800 border rounded text-green-400 font-mono focus:outline-none ${errors[`section_${sectionIndex}`] ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                                        }`}
                                />
                                <button
                                    onClick={() => removeSection(sectionIndex)}
                                    className="p-2 bg-slate-800 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {errors[`section_${sectionIndex}`] && (
                                <p className="text-red-500 text-xs font-mono ml-12 mb-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors[`section_${sectionIndex}`]}
                                </p>
                            )}

                            {/* Section Content */}
                            {expandedSections[sectionIndex] && (
                                <div className="ml-8 space-y-3">
                                    {/* Topics */}
                                    {section.topics?.map((topic, topicIndex) => (
                                        <div
                                            key={topicIndex}
                                            className="bg-slate-800 border border-slate-700 rounded p-3"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <input
                                                    ref={(el) => (topicRefs.current[`${sectionIndex}_${topicIndex}`] = el)}
                                                    type="text"
                                                    value={topic.title}
                                                    onChange={(e) =>
                                                        updateTopic(sectionIndex, topicIndex, 'title', e.target.value)
                                                    }
                                                    placeholder="Topic title..."
                                                    className={`flex-1 px-3 py-1.5 bg-slate-900 border rounded text-green-400 font-mono text-sm focus:outline-none ${errors[`topic_${sectionIndex}_${topicIndex}`] ? 'border-red-500' : 'border-slate-600 focus:border-green-500'
                                                        }`}
                                                />
                                                <button
                                                    onClick={() => addResource(sectionIndex, topicIndex)}
                                                    className="p-1.5 bg-slate-900 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-slate-900 transition-all"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => removeTopic(sectionIndex, topicIndex)}
                                                    className="p-1.5 bg-slate-900 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            {errors[`topic_${sectionIndex}_${topicIndex}`] && (
                                                <p className="text-red-500 text-xs font-mono mb-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors[`topic_${sectionIndex}_${topicIndex}`]}
                                                </p>
                                            )}

                                            {/* Resources */}
                                            {topic.resources?.map((resource, resourceIndex) => (
                                                <div
                                                    key={resourceIndex}
                                                    className="ml-4 mb-2 p-2 bg-slate-900 border border-slate-600 rounded"
                                                >
                                                    <div className="flex gap-2 mb-2">
                                                        <select
                                                            value={resource.type}
                                                            onChange={(e) =>
                                                                updateResource(
                                                                    sectionIndex,
                                                                    topicIndex,
                                                                    resourceIndex,
                                                                    'type',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-green-400 font-mono text-xs focus:border-green-500 focus:outline-none"
                                                        >
                                                            {RESOURCE_TYPES.map((type) => (
                                                                <option key={type.value} value={type.value}>
                                                                    {type.icon} {type.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() =>
                                                                removeResource(sectionIndex, topicIndex, resourceIndex)
                                                            }
                                                            className="p-1 bg-slate-800 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <input
                                                        ref={(el) => (resourceRefs.current[`${sectionIndex}_${topicIndex}_${resourceIndex}`] = el)}
                                                        type="text"
                                                        value={resource.title}
                                                        onChange={(e) =>
                                                            updateResource(
                                                                sectionIndex,
                                                                topicIndex,
                                                                resourceIndex,
                                                                'title',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Resource title..."
                                                        className={`w-full px-2 py-1 mb-1 bg-slate-800 border rounded text-green-400 font-mono text-xs focus:outline-none ${errors[`resource_title_${sectionIndex}_${topicIndex}_${resourceIndex}`] ? 'border-red-500' : 'border-slate-600 focus:border-green-500'
                                                            }`}
                                                    />
                                                    {errors[`resource_title_${sectionIndex}_${topicIndex}_${resourceIndex}`] && (
                                                        <p className="text-red-500 text-xs font-mono mb-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors[`resource_title_${sectionIndex}_${topicIndex}_${resourceIndex}`]}
                                                        </p>
                                                    )}
                                                    <input
                                                        type="url"
                                                        value={resource.url}
                                                        onChange={(e) =>
                                                            updateResource(
                                                                sectionIndex,
                                                                topicIndex,
                                                                resourceIndex,
                                                                'url',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="https://..."
                                                        className={`w-full px-2 py-1 bg-slate-800 border rounded text-green-400 font-mono text-xs focus:outline-none ${errors[`resource_url_${sectionIndex}_${topicIndex}_${resourceIndex}`] ? 'border-red-500' : 'border-slate-600 focus:border-green-500'
                                                            }`}
                                                    />
                                                    {errors[`resource_url_${sectionIndex}_${topicIndex}_${resourceIndex}`] && (
                                                        <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors[`resource_url_${sectionIndex}_${topicIndex}_${resourceIndex}`]}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Add Topic Button */}
                                    <button
                                        onClick={() => addTopic(sectionIndex)}
                                        className="w-full py-2 bg-slate-800 border border-dashed border-green-500 text-green-500 rounded font-mono text-sm hover:bg-slate-700 transition-all"
                                    >
                                        + Add Topic
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Section Button */}
                <button
                    onClick={addSection}
                    className="w-full py-3 bg-slate-900 border-2 border-dashed border-green-500 text-green-500 rounded-lg font-mono font-bold hover:bg-slate-800 transition-all"
                >
                    <Plus className="w-5 h-5 inline mr-2" />
                    ADD SECTION
                </button>
            </div>

            {/* Success Modal */}
            {successModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-green-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <h2 className="text-xl font-bold text-green-500 font-mono">{successModal.title}</h2>
                        </div>
                        <p className="text-green-400 font-mono mb-6">{successModal.message}</p>
                        <button
                            onClick={successModal.onClose}
                            className="w-full py-2 bg-green-500 text-slate-900 rounded font-mono font-bold hover:bg-green-400 transition-all"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {errorModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-red-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <h2 className="text-xl font-bold text-red-500 font-mono">{errorModal.title}</h2>
                        </div>
                        <p className="text-red-400 font-mono mb-6">{errorModal.message}</p>
                        <button
                            onClick={errorModal.onClose}
                            className="w-full py-2 bg-red-500 text-white rounded font-mono font-bold hover:bg-red-400 transition-all"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-yellow-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-yellow-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-8 h-8 text-yellow-500" />
                            <h2 className="text-xl font-bold text-yellow-500 font-mono">{deleteModal.title}</h2>
                        </div>
                        <p className="text-yellow-400 font-mono mb-6">{deleteModal.message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={deleteModal.onCancel}
                                className="flex-1 py-2 bg-slate-800 border border-slate-600 text-green-400 rounded font-mono hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteModal.onConfirm}
                                className="flex-1 py-2 bg-red-500 text-white rounded font-mono font-bold hover:bg-red-400 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
