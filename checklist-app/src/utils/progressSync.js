import { builtinProgressAPI } from './api.js';

/**
 * Get the checklist type and ID from a storage key
 * Examples:
 *   "javascript_dsa" => { type: "language_dsa", id: "javascript" }
 *   "python_dev" => { type: "language_dev", id: "python" }
 *   "dsa" => { type: "dsa_topics", id: "dsa" }
 *   "gate-cse" => { type: "examination", id: "gate-cse" }
 */
export function parseStorageKey(key) {
    if (key === 'dsa') {
        return { type: 'dsa_topics', id: 'dsa' };
    }

    if (key.includes('_dsa')) {
        const lang = key.replace('_dsa', '');
        return { type: 'language_dsa', id: lang };
    }

    if (key.includes('_dev')) {
        const lang = key.replace('_dev', '');
        return { type: 'language_dev', id: lang };
    }

    // Examination (e.g., "gate-cse", "gate-ee")
    return { type: 'examination', id: key };
}

/**
 * Get localStorage key from type and id
 */
function getLocalStorageKey(type, id) {
    if (type === 'dsa_topics') return 'dsa';
    if (type === 'language_dsa') return `${id}_dsa`;
    if (type === 'language_dev') return `${id}_dev`;
    if (type === 'examination') return id;
    return null;
}

/**
 * Load progress from database or localStorage
 * For authenticated users: Try database first, fallback to localStorage
 * For guests: Use localStorage only
 */
export async function loadProgress(type, id, isAuthenticated) {
    const key = getLocalStorageKey(type, id);
    const localData = localStorage.getItem(`${key}_progress`);

    if (isAuthenticated) {
        try {
            const dbData = await builtinProgressAPI.get(type, id);
            // If database has data, use it and update localStorage
            if (dbData && Object.keys(dbData).length > 0) {
                localStorage.setItem(`${key}_progress`, JSON.stringify(dbData));
                return dbData;
            }
            // If database is empty but localStorage has data, return localStorage
            return localData ? JSON.parse(localData) : {};
        } catch (error) {
            console.error('Failed to load progress from database:', error);
            // Fallback to localStorage
            return localData ? JSON.parse(localData) : {};
        }
    } else {
        // Load from localStorage for guests
        return localData ? JSON.parse(localData) : {};
    }
}

/**
 * Load ALL progress in a single batch request (OPTIMIZED)
 * For authenticated users: Fetch from database in one request
 * For guests: Load from localStorage
 */
export async function loadAllProgress(isAuthenticated) {
    if (isAuthenticated) {
        try {
            const dbData = await builtinProgressAPI.loadAll();

            // Update localStorage with database data
            Object.keys(dbData).forEach(type => {
                Object.keys(dbData[type]).forEach(id => {
                    const key = getLocalStorageKey(type, id);
                    if (key) {
                        localStorage.setItem(`${key}_progress`, JSON.stringify(dbData[type][id]));
                    }
                });
            });

            return dbData;
        } catch (error) {
            console.error('Failed to load all progress from database:', error);
            // Fallback to localStorage
            return loadAllProgressFromLocalStorage();
        }
    } else {
        // Load from localStorage for guests
        return loadAllProgressFromLocalStorage();
    }
}

/**
 * Load all progress from localStorage (fallback/guest mode)
 */
function loadAllProgressFromLocalStorage() {
    const progress = {
        language_dsa: {},
        language_dev: {},
        dsa_topics: {},
        examination: {}
    };

    // Find all progress keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('_progress')) {
            const storageKey = key.replace('_progress', '');
            const { type, id } = parseStorageKey(storageKey);
            const data = localStorage.getItem(key);

            if (data) {
                try {
                    if (!progress[type]) progress[type] = {};
                    progress[type][id] = JSON.parse(data);
                } catch (e) {
                    console.error(`Failed to parse ${key}:`, e);
                }
            }
        }
    }

    return progress;
}

/**
 * Save progress to database or localStorage
 * For authenticated users: Save to BOTH database AND localStorage
 * For guests: Save to localStorage only
 */
export async function saveProgress(type, id, items, isAuthenticated) {
    // ALWAYS save to localStorage first for immediate UI feedback
    const key = getLocalStorageKey(type, id);
    localStorage.setItem(`${key}_progress`, JSON.stringify(items));

    // If authenticated, also save to database
    if (isAuthenticated) {
        try {
            await builtinProgressAPI.batchUpdate({ type, id, items });
        } catch (error) {
            console.error('Failed to save progress to database:', error);
            // localStorage already has the data, so user won't lose progress
        }
    }
}

/**
 * Save ALL progress in one batch request (OPTIMIZED)
 * Collects all checklists and sends in single request
 */
export async function saveAllProgress(allCheckedItems, isAuthenticated) {
    // ALWAYS save to localStorage first for immediate UI feedback
    Object.keys(allCheckedItems).forEach(key => {
        const storageKey = `${key}_progress`;
        localStorage.setItem(storageKey, JSON.stringify(allCheckedItems[key]));
    });

    // If authenticated, also save to database in ONE request
    if (isAuthenticated) {
        try {
            // Collect all checklists
            const checklists = [];

            Object.keys(allCheckedItems).forEach(key => {
                const items = allCheckedItems[key];
                if (!items || Object.keys(items).length === 0) return;

                const { type, id } = parseStorageKey(key);
                checklists.push({ type, id, items });
            });

            // Send all at once
            if (checklists.length > 0) {
                await builtinProgressAPI.batchUpdateAll(checklists);
            }
        } catch (error) {
            console.error('Failed to save all progress to database:', error);
            // localStorage already has the data, so user won't lose progress
        }
    }
}

/**
 * Reset progress (clear all checked items)
 */
export async function resetProgress(type, id, isAuthenticated) {
    if (isAuthenticated) {
        try {
            await builtinProgressAPI.reset(type, id);
        } catch (error) {
            console.error('Failed to reset progress in database:', error);
        }
    }

    // Always clear localStorage as well
    const key = getLocalStorageKey(type, id);
    localStorage.removeItem(`${key}_progress`);
}

/**
 * Sync database progress to localStorage (called on logout for offline access)
 */
export async function syncDbToLocalStorage(checklists) {
    try {
        for (const checklist of checklists) {
            const { type, id } = checklist;
            const data = await builtinProgressAPI.get(type, id);

            const key = getLocalStorageKey(type, id);
            localStorage.setItem(`${key}_progress`, JSON.stringify(data));
        }

        console.log('✓ Successfully synced database to localStorage');
    } catch (error) {
        console.error('Failed to sync database to localStorage:', error);
    }
}

/**
 * Get all checklist identifiers for migration/sync
 */
export function getAllChecklistIdentifiers(languagesData, examinationsData) {
    const checklists = [];

    // Languages
    Object.keys(languagesData).forEach(lang => {
        checklists.push({ type: 'language_dsa', id: lang });
        checklists.push({ type: 'language_dev', id: lang });
    });

    // DSA Topics
    checklists.push({ type: 'dsa_topics', id: 'dsa' });

    // Examinations
    Object.keys(examinationsData).forEach(examId => {
        checklists.push({ type: 'examination', id: examId });
    });

    return checklists;
}
