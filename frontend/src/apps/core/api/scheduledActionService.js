import client from '@/core/api/client';

export const scheduledActionService = {
    getScheduledActions: (params) => client.get('core/scheduled-actions/', { params }),
    createScheduledAction: (payload) => client.post('core/scheduled-actions/', payload),
    updateScheduledAction: (id, payload) => client.patch(`core/scheduled-actions/${id}/`, payload),
    deleteScheduledAction: (id) => client.delete(`core/scheduled-actions/${id}/`),
    toggleScheduledAction: (id, is_active) => client.patch(`core/scheduled-actions/${id}/`, { is_active }),
    runScheduledAction: (id) => client.post(`core/scheduled-actions/${id}/run/`)
};
