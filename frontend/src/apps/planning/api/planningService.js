import client from '@/core/api/client';

class PlanningService {
    async getShifts(params = {}) {
        const response = await client.get('planning/shifts/', { params });
        return response.data?.data ?? response.data;
    }

    async getShift(id) {
        const response = await client.get(`planning/shifts/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createShift(data) {
        const response = await client.post('planning/shifts/', data);
        return response.data?.data ?? response.data;
    }

    async updateShift(id, data) {
        const response = await client.put(`planning/shifts/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteShift(id) {
        const response = await client.delete(`planning/shifts/${id}/`);
        return response.data?.data ?? response.data;
    }
}

export const planningService = new PlanningService();
export default planningService;
