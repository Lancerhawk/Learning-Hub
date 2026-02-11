
export const calculateExamProgress = (examId, examData) => {
    if (!examData || !examData.sections) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    let totalTopics = 0;
    examData.sections.forEach(section => {
        totalTopics += section.topics.length;
    });

    const savedData = localStorage.getItem(examId);
    if (!savedData) {
        return { completed: 0, total: totalTopics, percentage: 0 };
    }

    try {
        const checkedItems = JSON.parse(savedData);
        let completedTopics = 0;

        examData.sections.forEach(section => {
            section.topics.forEach(topic => {
                if (checkedItems[topic.name] === true) {
                    completedTopics++;
                }
            });
        });

        const percentage = totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;

        return {
            completed: completedTopics,
            total: totalTopics,
            percentage
        };
    } catch (error) {
        console.error('Error calculating exam progress:', error);
        return { completed: 0, total: totalTopics, percentage: 0 };
    }
};

export const calculateSectionProgress = (topics, examId) => {
    if (!topics || topics.length === 0) return 0;

    const savedData = localStorage.getItem(examId);
    if (!savedData) return 0;

    try {
        const checkedItems = JSON.parse(savedData);
        const completed = topics.filter(topic => checkedItems[topic.name] === true).length;
        return Math.round((completed / topics.length) * 100);
    } catch (error) {
        console.error('Error calculating section progress:', error);
        return 0;
    }
};

export const getTopicResourceProgress = (topicName, topic, examId) => {
    if (!topic || !topic.resources) return 0;

    const savedData = localStorage.getItem(examId);
    if (!savedData) return 0;

    try {
        const checkedItems = JSON.parse(savedData);
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

        if (allResourceKeys.length === 0) return 0;

        const completed = allResourceKeys.filter(key => checkedItems[key] === true).length;
        return Math.round((completed / allResourceKeys.length) * 100);
    } catch (error) {
        console.error('Error calculating resource progress:', error);
        return 0;
    }
};
