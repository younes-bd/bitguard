import client from './client';

export const marketingService = {
    // Campaigns
    getCampaigns: async (params = {}) => {
        const response = await client.get('marketing/campaigns/', { params });
        return response.data?.results || response.data;
    },
    getCampaign: async (id) => {
        const response = await client.get(`marketing/campaigns/${id}/`);
        return response.data;
    },
    createCampaign: async (data) => {
        const response = await client.post('marketing/campaigns/', data);
        return response.data;
    },
    updateCampaign: async (id, data) => {
        const response = await client.patch(`marketing/campaigns/${id}/`, data);
        return response.data;
    },
    deleteCampaign: async (id) => {
        const response = await client.delete(`marketing/campaigns/${id}/`);
        return response.data;
    },

    // Assets
    getAssets: async (params = {}) => {
        const response = await client.get('marketing/maintenance/', { params });
        return response.data?.results || response.data || [];
    },
    createAsset: async (data) => {
        const response = await client.post('marketing/maintenance/', data);
        return response.data;
    },
    deleteAsset: async (id) => {
        const response = await client.delete(`marketing/maintenance/${id}/`);
        return response.data;
    },

    // Analytics
    getCampaignStats: async (id) => {
        const response = await client.get(`marketing/campaigns/${id}/stats/`);
        return response.data;
    },
    getGlobalStats: async () => {
        const response = await client.get('marketing/dashboard/');
        return response.data?.data ?? response.data;
    },

    // Integrations
    getIntegrations: async () => {
        const response = await client.get('marketing/integrations/');
        return response.data?.results || response.data || [];
    },
    toggleIntegration: async (name) => {
        const response = await client.post('marketing/integrations/toggle/', { name });
        return response.data;
    }
};
