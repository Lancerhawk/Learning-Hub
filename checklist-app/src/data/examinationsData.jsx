const examinationModules = import.meta.glob('./examinations/*.json', { eager: true });

const parseFilename = (filepath) => {
    const filename = filepath.split('/').pop().replace('.json', '');
    const parts = filename.split('_');

    if (parts.length === 3) {
        return {
            exam: parts[0],
            branch: parts[1],
            year: parts[2],
            id: `${parts[0]}-${parts[1]}`
        };
    } else if (parts.length === 2) {
        return {
            exam: parts[0],
            branch: null,
            year: parts[1],
            id: parts[0]
        };
    }
    return null;
};

export const examinationsData = {};

Object.entries(examinationModules).forEach(([filepath, module]) => {
    const parsed = parseFilename(filepath);
    if (parsed && module.default) {
        examinationsData[parsed.id] = module.default;
    }
});

export const getAllExams = () => {
    return Object.values(examinationsData);
};

export const getExamById = (id) => {
    return examinationsData[id];
};

export const getExamsByCategory = () => {
    const grouped = {};

    Object.values(examinationsData).forEach(exam => {
        const category = exam.name.split(' ')[0];

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push(exam);
    });

    return grouped;
};

export const isExamComingSoon = (exam) => {
    if (!exam) return true;
    if (!exam.sections || exam.sections.length === 0) return true;
    const hasContent = exam.sections.some(section =>
        section.topics && section.topics.length > 0
    );
    return !hasContent;
};