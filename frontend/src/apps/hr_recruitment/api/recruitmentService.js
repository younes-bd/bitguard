import apiClient from '@/core/api/client';

export const recruitmentService = {
    getJobPositions: async () => {
        const response = await apiClient.get('/api/v1/hr/job-positions/');
        return response.data;
    },
    
    getJobApplications: async () => {
        const response = await apiClient.get('/api/v1/hr/job-applications/');
        return response.data;
    },

    hireApplication: async (id) => {
        const response = await apiClient.post(`/api/v1/hr/job-applications/${id}/hire/`);
        return response.data;
    }
};
