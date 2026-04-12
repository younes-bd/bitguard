import client from './client';

/**
 * Marketing Service — connects to /api/marketing/
 * Backend registers: campaigns (CampaignViewSet)
 */
class MarketingService {
    async getCampaigns(params = {}) {
        const response = await client.get('marketing/campaigns/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getCampaign(id) {
        const response = await client.get(`marketing/campaigns/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createCampaign(data) {
        const response = await client.post('marketing/campaigns/', data);
        return response.data?.data ?? response.data;
    }

    async updateCampaign(id, data) {
        const response = await client.patch(`marketing/campaigns/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteCampaign(id) {
        await client.delete(`marketing/campaigns/${id}/`);
    }

    async getStats() {
        try {
            const all = await this.getCampaigns();
            const items = Array.isArray(all) ? all : all?.results ?? [];
            return {
                total: items.length,
                active: items.filter(c => c.status === 'active').length,
                completed: items.filter(c => c.status === 'completed').length,
            };
        } catch {
            return { total: 0, active: 0, completed: 0 };
        }
    }

    async getIntegrations() {
        const response = await client.get('marketing/integrations/');
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async toggleIntegration(name) {
        const response = await client.post(`marketing/integrations/toggle/`, { name });
        return response.data?.data ?? response.data;
    }
}

export const marketingService = new MarketingService();
export default marketingService;
