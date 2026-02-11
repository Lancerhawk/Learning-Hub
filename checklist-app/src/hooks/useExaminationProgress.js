import { useState, useEffect } from 'react';


export const useExaminationProgress = (examId, examData) => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem(examId);
        return saved ? JSON.parse(saved) : {};
    });

    const [confirmModal, setConfirmModal] = useState(null);

    useEffect(() => {
        localStorage.setItem(examId, JSON.stringify(checkedItems));
    }, [examId, checkedItems]);

    const toggleResource = (topicName, resourceType, resourceTitle) => {
        const resourceKey = `${topicName}__${resourceType}__${resourceTitle}`;

        setCheckedItems(prev => {
            const newChecked = {
                ...prev,
                [resourceKey]: !prev[resourceKey]
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
                    allResourceKeys.every(key => newChecked[key]);

                newChecked[topicName] = allChecked;
            }

            return newChecked;
        });
    };


    const toggleTopic = (topicName, hasResources) => {
        if (hasResources && !checkedItems[topicName]) {
            setConfirmModal({ topicName });
            return;
        }

        if (hasResources && checkedItems[topicName]) {
            const topic = examData.sections
                .flatMap(s => s.topics)
                .find(t => t.name === topicName);

            if (topic && topic.resources) {
                setCheckedItems(prev => {
                    const newChecked = { ...prev };
                    newChecked[topicName] = false;

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

        setCheckedItems(prev => ({
            ...prev,
            [topicName]: !prev[topicName]
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
                const newChecked = { ...prev, [topicName]: true };

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