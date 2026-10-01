import apiClient from '../../../core/api/client';

export const systemEventService = {
    getSystemEvents: async (params = {}) => {
        const response = await apiClient.get('core/system-events/', { params });
        return response.data?.data?.results ?? response.data?.results ?? response.data ?? [];
    },
    getSystemEvent: async (id) => {
        const response = await apiClient.get(`core/system-events/${id}/`);
        return response.data?.data ?? response.data;
    }
};
