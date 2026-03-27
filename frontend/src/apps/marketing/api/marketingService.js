import apiClient from '../../../core/api/client';

export const marketingService = {
    /**
     * Get a list of marketing campaigns.
     */
    getCampaigns: async (params = {}) => {
        const response = await apiClient.get('/marketing/campaigns/', { params });
        return response.data;
    },

    /**
     * Get a single marketing campaign by ID.
     */
    getCampaign: async (id) => {
        const response = await apiClient.get(`/marketing/campaigns/${id}/`);
        return response.data;
    },

    /**
     * Create a new marketing campaign.
     */
    createCampaign: async (data) => {
        const response = await apiClient.post('/marketing/campaigns/', data);
        return response.data;
    },

    /**
     * Track a specific interaction (click, open, etc) against a campaign.
     */
    trackInteraction: async (id, interaction_type, details = {}) => {
        const response = await apiClient.post(`/marketing/campaigns/${id}/track_interaction/`, {
            interaction_type,
            details
        });
        return response.data;
    }
};
