import client from '@/core/api/client';

export const parameterService = {
    getSettings: () => client.get('core/parameters/'),
    createSetting: (data) => client.post('core/parameters/', data),
    updateSetting: (id, data) => client.patch(`core/parameters/${id}/`, data),
    deleteSetting: (id) => client.delete(`core/parameters/${id}/`),
    batchUpdateSettings: (data) => client.post('core/parameters/batch_update/', data),
    clearCache: () => client.post('core/parameters/clear_cache/'),
    getSystemMetrics: () => client.get('core/parameters/metrics/'),
    getServerLogs: () => client.get('core/parameters/server_logs/'),
    pruneAuditLogs: (days) => client.post('core/parameters/prune/', { days })
};
