
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

if (!import.meta.env.VITE_API_URL) {
    throw new Error("VITE_API_URL is not defined");
}

const fetchAPI = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('auth_token');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        if (!response.ok) {
            const error = await response.json();

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.reload();
            }

            throw new Error(error.error?.message || error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const customListsAPI = {
    getAll: () => fetchAPI('/custom-lists'),

    getById: (id) => fetchAPI(`/custom-lists/${id}`),

    create: (data) => fetchAPI('/custom-lists', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchAPI(`/custom-lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchAPI(`/custom-lists/${id}`, {
        method: 'DELETE',
    }),
};

export const sectionsAPI = {
    create: (data) => fetchAPI('/sections', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchAPI(`/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchAPI(`/sections/${id}`, {
        method: 'DELETE',
    }),

    reorder: (id, new_order_index) => fetchAPI(`/sections/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

export const topicsAPI = {
    create: (data) => fetchAPI('/topics', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchAPI(`/topics/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchAPI(`/topics/${id}`, {
        method: 'DELETE',
    }),

    reorder: (id, new_order_index) => fetchAPI(`/topics/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

export const resourcesAPI = {
    create: (data) => fetchAPI('/resources', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchAPI(`/resources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchAPI(`/resources/${id}`, {
        method: 'DELETE',
    }),

    reorder: (id, new_order_index) => fetchAPI(`/resources/${id}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ new_order_index }),
    }),
};

export const progressAPI = {
    getListProgress: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}?user_id=${userId}`),

    toggle: (data) => fetchAPI('/progress/toggle', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    completeTopic: (data) => fetchAPI('/progress/complete-topic', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    reset: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}?user_id=${userId}`, {
            method: 'DELETE',
        }),

    getStats: (listId, userId = 'default_user') =>
        fetchAPI(`/progress/list/${listId}/stats?user_id=${userId}`),
};

export const publicListsAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetchAPI(`/public-lists${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => fetchAPI(`/public-lists/${id}`),

    rate: (id, rating) => fetchAPI(`/public-lists/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
    }),

    copy: (id) => fetchAPI(`/public-lists/${id}/copy`, {
        method: 'POST',
    }),

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