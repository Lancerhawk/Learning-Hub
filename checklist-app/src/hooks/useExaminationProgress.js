import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useExaminationProgress = (examId, examData, checkedItems, setCheckedItems) => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [confirmModal, setConfirmModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // NOTE: Progress loading and saving is now handled by App.jsx centrally
    // This hook only manages UI interactions (toggle, confirm modals, etc.)

    const toggleResource = (topicName, resourceType, resourceTitle) => {
        const resourceKey = `${topicName}__${resourceType}__${resourceTitle}`;

        setCheckedItems(prev => {
            // Get current exam progress
            const examProgress = prev[examId] || {};

            const newExamProgress = {
                ...examProgress,
                [resourceKey]: !examProgress[resourceKey]
            };

            const topic = examData.sections
                .flatMap(s => s.topics)
                .find(t => t.name === topicName);

            if (topic && topic.resources) {
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

                const allChecked = allResourceKeys.length > 0 &&
                    allResourceKeys.every(key => newExamProgress[key]);

                newExamProgress[topicName] = allChecked;
            }

            return {
                ...prev,
                [examId]: newExamProgress
            };
        });
    };


    const toggleTopic = (topicName, hasResources) => {
        const examProgress = checkedItems[examId] || {};

        if (hasResources && !examProgress[topicName]) {
            setConfirmModal({ topicName });
            return;
        }

        if (hasResources && examProgress[topicName]) {
            const topic = examData.sections
                .flatMap(s => s.topics)
                .find(t => t.name === topicName);

            if (topic && topic.resources) {
                setCheckedItems(prev => {
                    const currentExamProgress = prev[examId] || {};
                    const newExamProgress = { ...currentExamProgress };
                    newExamProgress[topicName] = false;

                    if (topic.resources.videos) {
                        topic.resources.videos.forEach(v => {
                            delete newExamProgress[`${topicName}__videos__${v.title}`];
                        });
                    }
                    if (topic.resources.practice) {
                        topic.resources.practice.forEach(p => {
                            delete newExamProgress[`${topicName}__practice__${p.title}`];
                        });
                    }
                    if (topic.resources.references) {
                        topic.resources.references.forEach(r => {
                            delete newExamProgress[`${topicName}__references__${r.title}`];
                        });
                    }

                    return {
                        ...prev,
                        [examId]: newExamProgress
                    };
                });
            }
            return;
        }

        setCheckedItems(prev => ({
            ...prev,
            [examId]: {
                ...(prev[examId] || {}),
                [topicName]: !(prev[examId] || {})[topicName]
            }
        }));
    };

    const confirmMarkAllResources = (markAll) => {
        if (!confirmModal) return;

        const { topicName } = confirmModal;
        const topic = examData.sections
            .flatMap(s => s.topics)
            .find(t => t.name === topicName);

        if (markAll && topic && topic.resources) {
            setCheckedItems(prev => {
                const currentExamProgress = prev[examId] || {};
                const newExamProgress = { ...currentExamProgress, [topicName]: true };

                if (topic.resources.videos) {
                    topic.resources.videos.forEach(v => {
                        newExamProgress[`${topicName}__videos__${v.title}`] = true;
                    });
                }
                if (topic.resources.practice) {
                    topic.resources.practice.forEach(p => {
                        newExamProgress[`${topicName}__practice__${p.title}`] = true;
                    });
                }
                if (topic.resources.references) {
                    topic.resources.references.forEach(r => {
                        newExamProgress[`${topicName}__references__${r.title}`] = true;
                    });
                }

                return {
                    ...prev,
                    [examId]: newExamProgress
                };
            });
        } else {
            setCheckedItems(prev => ({
                ...prev,
                [examId]: {
                    ...(prev[examId] || {}),
                    [topicName]: true
                }
            }));
        }

        setConfirmModal(null);
    };

    return {
        checkedItems: checkedItems[examId] || {},
        toggleResource,
        toggleTopic,
        confirmModal,
        setConfirmModal,
        confirmMarkAllResources,
        isLoading
    };
};