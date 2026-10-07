import client from '@/core/api/client';

export const automatedActionService = {
    getAutomatedActions: (params) => client.get('automation/actions/', { params }),
    getAutomatedAction: (id) => client.get(`automation/actions/${id}/`),
    createAutomatedAction: (data) => client.post('automation/actions/', data),
    updateAutomatedAction: (id, data) => client.put(`automation/actions/${id}/`, data),
    deleteAutomatedAction: (id) => client.delete(`automation/actions/${id}/`),
    toggleAutomatedAction: (id, isActive) => client.patch(`automation/actions/${id}/`, { is_active: isActive }),
    runAutomatedAction: (id) => client.post(`automation/actions/${id}/run/`)
};
