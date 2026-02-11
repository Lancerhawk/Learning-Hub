// Auto-discover all examination JSON files using Vite's import.meta.glob
// This automatically imports all .json files from the examinations/ folder
// No need to manually import each file anymore!
const examinationModules = import.meta.glob('./examinations/*.json', { eager: true });

// Parse filename to extract exam information
// Format: examname_branch_year.json or examname_year.json (if no branch)
// Examples: 
//   - gate_cs_2027.json -> { exam: "gate", branch: "cs", year: "2027" }
//   - jee_2027.json -> { exam: "jee", branch: null, year: "2027" }
const parseFilename = (filepath) => {
    const filename = filepath.split('/').pop().replace('.json', '');
    const parts = filename.split('_');

    if (parts.length === 3) {
        // Format: examname_branch_year
        return {
            exam: parts[0],
            branch: parts[1],
            year: parts[2],
            id: `${parts[0]}-${parts[1]}`
        };
    } else if (parts.length === 2) {
        // Format: examname_year (no branch)
        return {
            exam: parts[0],
            branch: null,
            year: parts[1],
            id: parts[0]
        };
    }
    return null;
};

// Build examinationsData object from discovered files
export const examinationsData = {};

Object.entries(examinationModules).forEach(([filepath, module]) => {
    const parsed = parseFilename(filepath);
    if (parsed && module.default) {
        examinationsData[parsed.id] = module.default;
    }
});

// Helper function to get all available exams
export const getAllExams = () => {
    return Object.values(examinationsData);
};

// Helper function to get exam by ID
export const getExamById = (id) => {
    return examinationsData[id];
};

// Helper function to get exams grouped by category (e.g., GATE, JEE, etc.)
export const getExamsByCategory = () => {
    const grouped = {};

    Object.values(examinationsData).forEach(exam => {
        // Extract category from exam name (e.g., "GATE" from "GATE Computer Science")
        const category = exam.name.split(' ')[0];

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push(exam);
    });

    return grouped;
};

// Helper function to check if an exam is "Coming Soon" (empty or no sections)
export const isExamComingSoon = (exam) => {
    if (!exam) return true;
    if (!exam.sections || exam.sections.length === 0) return true;
    // Check if all sections are empty
    const hasContent = exam.sections.some(section =>
        section.topics && section.topics.length > 0
    );
    return !hasContent;
};
