import apiClient from '@/core/api/client';

export const coreService = {
    getLanguages: (params) => apiClient.get('core/languages/', { params }),
    createLanguage: (payload) => apiClient.post('core/languages/', payload),
    updateLanguage: (id, payload) => apiClient.patch(`core/languages/${id}/`, payload),
    deleteLanguage: (id) => apiClient.delete(`core/languages/${id}/`),
    setDefaultLanguage: (id) => apiClient.post(`core/languages/${id}/set_default/`),

    getScheduledActions: (params) => apiClient.get('core/scheduled-actions/', { params }),
    getContentTypes: () => apiClient.get('core/content-types/'),
    getScheduledRegistry: () => apiClient.get('core/scheduled-registry/'),
    createScheduledAction: (payload) => apiClient.post('core/scheduled-actions/', payload),
    updateScheduledAction: (id, payload) => apiClient.patch(`core/scheduled-actions/${id}/`, payload),
    deleteScheduledAction: (id) => apiClient.delete(`core/scheduled-actions/${id}/`),
    toggleScheduledAction: (id, is_active) => apiClient.patch(`core/scheduled-actions/${id}/`, { is_active }),
    runScheduledAction: (id) => apiClient.post(`core/scheduled-actions/${id}/run/`),
    
    // Phase 6 additions
    getConfigOptions: () => apiClient.get('core/config-options/'),
    getModules: (params) => apiClient.get('core/modules/', { params }),
    updateModule: (id, payload) => apiClient.patch(`core/modules/${id}/`, payload),
    getSequences: (params) => apiClient.get('core/sequences/', { params }),
    createSequence: (payload) => apiClient.post('core/sequences/', payload),
    updateSequence: (id, payload) => apiClient.patch(`core/sequences/${id}/`, payload),
    deleteSequence: (id) => apiClient.delete(`core/sequences/${id}/`),
    getSections: () => apiClient.get('core/sections/'),
    updateSection: (id, payload) => apiClient.patch(`core/sections/${id}/`, payload)
};

// Company API
export const getCompanies = async () => {
    const response = await apiClient.get('core/companies/');
    return response.data;
};

export const updateCompany = async (id, data) => {
    const response = await apiClient.patch(`core/companies/${id}/`, data);
    return response.data;
};

// Currency API
export const getCurrencies = async () => {
    const response = await apiClient.get('core/currencies/');
    return response.data;
};

export const updateCurrency = async (id, data) => {
    const response = await apiClient.patch(`core/currencies/${id}/`, data);
    return response.data;
};
