import client from './client';

/**
 * ITSM Service — connects to /api/itsm/
 * Backend registers: changes (ChangeRequest), tasks (ChangeTask)
 */
class ItsmService {
    async getChangeRequests(params = {}) {
        const response = await client.get('itsm/changes/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getChangeRequest(id) {
        const response = await client.get(`itsm/changes/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createChangeRequest(data) {
        const response = await client.post('itsm/changes/', data);
        return response.data?.data ?? response.data;
    }

    async updateChangeRequest(id, data) {
        const response = await client.patch(`itsm/changes/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async approve(id) {
        const response = await client.patch(`itsm/changes/${id}/`, { status: 'approved' });
        return response.data?.data ?? response.data;
    }

    async getTasks(changeRequestId) {
        const response = await client.get('itsm/tasks/', { params: { change_request: changeRequestId } });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async createTask(data) {
        const response = await client.post('itsm/tasks/', data);
        return response.data?.data ?? response.data;
    }

    async updateTask(id, data) {
        const response = await client.patch(`itsm/tasks/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async getStats() {
        try {
            const all = await this.getChangeRequests();
            const items = Array.isArray(all) ? all : all?.results ?? [];
            return {
                total: items.length,
                open: items.filter(c => ['draft', 'submitted', 'in_progress'].includes(c.status)).length,
                approved: items.filter(c => c.status === 'approved').length,
                completed: items.filter(c => c.status === 'completed').length,
                high_risk: items.filter(c => c.risk_level === 'high').length,
            };
        } catch {
            return { total: 0, open: 0, approved: 0, completed: 0, high_risk: 0 };
        }
    }
}

export const itsmService = new ItsmService();
export default itsmService;
