import apiClient from '@/core/api/client';

export const automationService = {
    getActions: (params) => apiClient.get('automation/actions/', { params }),
    createAction: (payload) => apiClient.post('automation/actions/', payload),
    updateAction: (id, payload) => apiClient.patch(`automation/actions/${id}/`, payload),
    deleteAction: (id) => apiClient.delete(`automation/actions/${id}/`),
    runAction: (id) => apiClient.post(`automation/actions/${id}/run/`),
};
