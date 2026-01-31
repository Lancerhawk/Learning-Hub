// API Configuration
// Centralized API URL management using environment variables

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    // Base URL
    BASE: `${API_URL}/api`,

    // Auth endpoints
    AUTH: {
        SIGNUP: `${API_URL}/api/auth/signup`,
        LOGIN: `${API_URL}/api/auth/login`,
        ME: `${API_URL}/api/auth/me`,
    },

    // Password reset endpoints
    PASSWORD: {
        FORGOT: `${API_URL}/api/password/forgot-password`,
        RESET: `${API_URL}/api/password/reset-password`,
        VERIFY_TOKEN: (token) => `${API_URL}/api/password/verify-reset-token/${token}`,
    },

    // Custom lists endpoints
    LISTS: {
        BASE: `${API_URL}/api/custom-lists`,
        BY_ID: (id) => `${API_URL}/api/custom-lists/${id}`,
        PUBLISH: (id) => `${API_URL}/api/custom-lists/${id}/publish`,
    },

    // Public lists endpoints
    PUBLIC_LISTS: {
        BASE: `${API_URL}/api/public-lists`,
        BY_ID: (id) => `${API_URL}/api/public-lists/${id}`,
        LINEAGE: (id) => `${API_URL}/api/public-lists/${id}/lineage`,
        RATE: (id) => `${API_URL}/api/public-lists/${id}/rate`,
        COPY: (id) => `${API_URL}/api/public-lists/${id}/copy`,
    },

    // Sections endpoints
    SECTIONS: {
        BASE: `${API_URL}/api/sections`,
        BY_ID: (id) => `${API_URL}/api/sections/${id}`,
    },

    // Topics endpoints
    TOPICS: {
        BASE: `${API_URL}/api/topics`,
        BY_ID: (id) => `${API_URL}/api/topics/${id}`,
    },

    // Resources endpoints
    RESOURCES: {
        BASE: `${API_URL}/api/resources`,
        BY_ID: (id) => `${API_URL}/api/resources/${id}`,
    },

    // Progress endpoints
    PROGRESS: {
        LIST: (listId) => `${API_URL}/api/progress/list/${listId}`,
        TOGGLE: `${API_URL}/api/progress/toggle`,
    },
};

export default API_URL;
