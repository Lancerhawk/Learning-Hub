
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

if (!import.meta.env.VITE_API_URL) {
    throw new Error("VITE_API_URL is not defined");
}

// Helper function for fetch with error handling
const fetchAPI = async (endpoint, options = {}) => {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('auth_token');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        if (!response.ok) {
            const error = await response.json();

            // Handle 401 Unauthorized - token expired or invalid
            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.reload(); // Reload to clear auth state
            }

            throw new Error(error.error?.message || error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Custom Lists API
export const customListsAPI = {
    // Get all lists
    getAll: () => fetchAPI('/custom-lists'),

    // Get single list with all nested data
    getById: (id) => fetchAPI(`/custom-lists/${id}`),

    // Create new list
    create: (data) => fetchAPI('/custom-lists', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Update list
    update: (id, data) => fetchAPI(`/custom-lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Delete list
    delete: (id) => fetchAPI(`/custom-lists/${id}`, {
        method: 'DELETE',
    }),
};

// Sections API
export const sectionsAPI = {
    // Create section
    create: (data) => fetchAPI('/sections', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Update section
    update: (id, data) => fetchAPI(`/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Delete section
    delete: (id) => fetchAPI(`/sections/${id}`, {
        method: 'DELETE',
    }),

    // Reorder section
    reorder: (id, new_order_index) => fetchAPI(`/sections/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

// Topics API
export const topicsAPI = {
    // Create topic
    create: (data) => fetchAPI('/topics', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Update topic
    update: (id, data) => fetchAPI(`/topics/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Delete topic
    delete: (id) => fetchAPI(`/topics/${id}`, {
        method: 'DELETE',
    }),

    // Reorder topic
    reorder: (id, new_order_index) => fetchAPI(`/topics/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

// Resources API
export const resourcesAPI = {
    // Create resource
    create: (data) => fetchAPI('/resources', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Update resource
    update: (id, data) => fetchAPI(`/resources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Delete resource
    delete: (id) => fetchAPI(`/resources/${id}`, {
        method: 'DELETE',
    }),

    // Reorder resource
    reorder: (id, new_order_index) => fetchAPI(`/resources/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

// Progress API
export const progressAPI = {
    // Get progress for a list
    getListProgress: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}?user_id=${userId}`),

    // Toggle progress item
    toggle: (data) => fetchAPI('/progress/toggle', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Complete topic with all resources
    completeTopic: (data) => fetchAPI('/progress/complete-topic', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Reset progress for a list
    reset: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}?user_id=${userId}`, {
            method: 'DELETE',
        }),

    // Get progress statistics
    getStats: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}/stats?user_id=${userId}`),
};

// Public Lists API
export const publicListsAPI = {
    // Get all public lists with search and filtering
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetchAPI(`/public-lists${queryString ? `?${queryString}` : ''}`);
    },

    // Get single public list
    getById: (id) => fetchAPI(`/public-lists/${id}`),

    // Rate a public list
    rate: (id, rating) => fetchAPI(`/public-lists/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
    }),

    // Copy a public list to user's account
    copy: (id) => fetchAPI(`/public-lists/${id}/copy`, {
        method: 'POST',
    }),

    // Get lineage/version history of a list
    getLineage: (id) => fetchAPI(`/public-lists/${id}/lineage`),
};

export default {
    customLists: customListsAPI,
    sections: sectionsAPI,
    topics: topicsAPI,
    resources: resourcesAPI,
    progress: progressAPI,
    publicLists: publicListsAPI,
};
