import { useState, useEffect } from 'react';

/**
 * Custom hook for managing examination progress and checkbox state
 * Handles auto-check logic and localStorage persistence
 */
export const useExaminationProgress = (examId, examData) => {
    // Load initial state from localStorage
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem(examId);
        return saved ? JSON.parse(saved) : {};
    });

    const [confirmModal, setConfirmModal] = useState(null);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem(examId, JSON.stringify(checkedItems));
    }, [examId, checkedItems]);

    /**
     * Toggle a resource item (video, practice, reference)
     * Auto-checks parent topic if all resources are checked
     * Auto-unchecks parent topic if any resource is unchecked
     */
    const toggleResource = (topicName, resourceType, resourceTitle) => {
        const resourceKey = `${topicName}__${resourceType}__${resourceTitle}`;

        setCheckedItems(prev => {
            const newChecked = {
                ...prev,
                [resourceKey]: !prev[resourceKey]
            };

            // Find the topic to check all its resources
            const topic = examData.sections
                .flatMap(s => s.topics)
                .find(t => t.name === topicName);

            if (topic && topic.resources) {
                // Collect all resource keys for this topic
                const allResourceKeys = [];

                if (topic.resources.videos) {
                    topic.resources.videos.forEach(v => {
                        allResourceKeys.push(`${topicName}__videos__${v.title}`);
                    });
                }
                if (topic.resources.practice) {
                    topic.resources.practice.forEach(p => {
                        allResourceKeys.push(`${topicName}__practice__${p.title}`);
                    });
                }
                if (topic.resources.references) {
                    topic.resources.references.forEach(r => {
                        allResourceKeys.push(`${topicName}__references__${r.title}`);
                    });
                }

                // Check if ALL resources are checked
                const allChecked = allResourceKeys.length > 0 &&
                    allResourceKeys.every(key => newChecked[key]);

                // Auto-check/uncheck parent topic
                newChecked[topicName] = allChecked;
            }

            return newChecked;
        });
    };

    /**
     * Toggle a topic checkbox
     * Shows confirmation modal if topic has resources
     */
    const toggleTopic = (topicName, hasResources) => {
        // If topic has resources and is being checked, show confirmation
        if (hasResources && !checkedItems[topicName]) {
            setConfirmModal({ topicName });
            return;
        }

        // If unchecking, uncheck topic and all its resources
        if (hasResources && checkedItems[topicName]) {
            const topic = examData.sections
                .flatMap(s => s.topics)
                .find(t => t.name === topicName);

            if (topic && topic.resources) {
                setCheckedItems(prev => {
                    const newChecked = { ...prev };
                    newChecked[topicName] = false;

                    // Uncheck all resources
                    if (topic.resources.videos) {
                        topic.resources.videos.forEach(v => {
                            delete newChecked[`${topicName}__videos__${v.title}`];
                        });
                    }
                    if (topic.resources.practice) {
                        topic.resources.practice.forEach(p => {
                            delete newChecked[`${topicName}__practice__${p.title}`];
                        });
                    }
                    if (topic.resources.references) {
                        topic.resources.references.forEach(r => {
                            delete newChecked[`${topicName}__references__${r.title}`];
                        });
                    }

                    return newChecked;
                });
            }
            return;
        }

        // Simple toggle for topics without resources
        setCheckedItems(prev => ({
            ...prev,
            [topicName]: !prev[topicName]
        }));
    };

    /**
     * Confirm marking all resources as done
     */
    const confirmMarkAllResources = (markAll) => {
        if (!confirmModal) return;

        const { topicName } = confirmModal;
        const topic = examData.sections
            .flatMap(s => s.topics)
            .find(t => t.name === topicName);

        if (markAll && topic && topic.resources) {
            setCheckedItems(prev => {
                const newChecked = { ...prev, [topicName]: true };

                // Mark all resources as checked
                if (topic.resources.videos) {
                    topic.resources.videos.forEach(v => {
                        newChecked[`${topicName}__videos__${v.title}`] = true;
                    });
                }
                if (topic.resources.practice) {
                    topic.resources.practice.forEach(p => {
                        newChecked[`${topicName}__practice__${p.title}`] = true;
                    });
                }
                if (topic.resources.references) {
                    topic.resources.references.forEach(r => {
                        newChecked[`${topicName}__references__${r.title}`] = true;
                    });
                }

                return newChecked;
            });
        } else {
            // Mark only the topic
            setCheckedItems(prev => ({
                ...prev,
                [topicName]: true
            }));
        }

        setConfirmModal(null);
    };

    return {
        checkedItems,
        toggleResource,
        toggleTopic,
        confirmModal,
        setConfirmModal,
        confirmMarkAllResources
    };
};
