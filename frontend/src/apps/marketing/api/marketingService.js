import apiClient from '@/core/api/client';

export const marketingService = {
    /**
     * Get a list of marketing campaigns.
     */
    getCampaigns: async (params = {}) => {
        const response = await apiClient.get('marketing/campaigns/', { params });
        return response.data.data;
    },

    /**
     * Get a single marketing campaign by ID.
     */
    getCampaign: async (id) => {
        const response = await apiClient.get(`marketing/campaigns/${id}/`);
        return response.data.data;
    },

    /**
     * Create a new marketing campaign.
     */
    createCampaign: async (data) => {
        const response = await apiClient.post('marketing/campaigns/', data);
        return response.data.data;
    },

    /**
     * Track a specific interaction (click, open, etc) against a campaign.
     */
    trackInteraction: async (id, interaction_type, details = {}) => {
        const response = await apiClient.post(`marketing/campaigns/${id}/track_interaction/`, {
            interaction_type,
            details
        });
        return response.data.data;
    }
,
updateCampaign: async (id, data) => {
        const response = await client.patch(`marketing/campaigns/${id}/`, data);
        return response.data;
    },
deleteCampaign: async (id) => {
        const response = await client.delete(`marketing/campaigns/${id}/`);
        return response.data;
    },
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
getCampaignStats: async (id) => {
        const response = await client.get(`marketing/campaigns/${id}/stats/`);
        return response.data;
    },
getGlobalStats: async () => {
        const response = await client.get('marketing/dashboard/');
        return response.data?.data ?? response.data;
    },
getIntegrations: async () => {
        const response = await client.get('marketing/integrations/');
        return response.data?.results || response.data || [];
    },

    getMassMailings: async (params = {}) => client.get('marketing/mailings/', { params }).then(r => r.data?.results ?? r.data),
    getSocialPosts: async (params = {}) => client.get('marketing/social-posts/', { params }).then(r => r.data?.results ?? r.data),
    getSMSCampaigns: async (params = {}) => client.get('marketing/sms-campaigns/', { params }).then(r => r.data?.results ?? r.data),
    getEvents: async (params = {}) => client.get('marketing/events/', { params }).then(r => r.data?.results ?? r.data),
    getSurveys: async (params = {}) => client.get('marketing/surveys/', { params }).then(r => r.data?.results ?? r.data),

    // ─── SERVICES / PROJECTS EXTRAS ───────────────────────────────────────────
};
