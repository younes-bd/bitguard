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

    async submit(id) {
        const response = await client.post(`itsm/changes/${id}/submit/`);
        return response.data?.data ?? response.data;
    }

    async approve(id) {
        const response = await client.post(`itsm/changes/${id}/approve/`);
        return response.data?.data ?? response.data;
    }

    async reject(id) {
        const response = await client.post(`itsm/changes/${id}/reject/`);
        return response.data?.data ?? response.data;
    }

    async startWork(id) {
        const response = await client.post(`itsm/changes/${id}/start_work/`);
        return response.data?.data ?? response.data;
    }

    async complete(id) {
        const response = await client.post(`itsm/changes/${id}/complete/`);
        return response.data?.data ?? response.data;
    }

    async fail(id) {
        const response = await client.post(`itsm/changes/${id}/fail/`);
        return response.data?.data ?? response.data;
    }

    async rollback(id) {
        const response = await client.post(`itsm/changes/${id}/rollback/`);
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

    async getProblems(params = {}) {
        const response = await client.get('itsm/problems/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getProblem(id) {
        const response = await client.get(`itsm/problems/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createProblem(data) {
        const response = await client.post('itsm/problems/', data);
        return response.data?.data ?? response.data;
    }

    async updateProblem(id, data) {
        const response = await client.patch(`itsm/problems/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async resolveProblem(id, permanentFix) {
        const response = await client.post(`itsm/problems/${id}/resolve/`, { permanent_fix: permanentFix });
        return response.data?.data ?? response.data;
    }

    async getStats() {
        try {
            const [changes, problems] = await Promise.all([
                this.getChangeRequests(),
                this.getProblems()
            ]);
            const cItems = Array.isArray(changes) ? changes : changes?.results ?? [];
            const pItems = Array.isArray(problems) ? problems : problems?.results ?? [];
            return {
                total_changes: cItems.length,
                open_changes: cItems.filter(c => ['draft', 'submitted', 'in_progress'].includes(c.status)).length,
                completed_changes: cItems.filter(c => c.status === 'completed').length,
                total_problems: pItems.length,
                open_problems: pItems.filter(p => p.status !== 'closed' && p.status !== 'resolved').length,
            };
        } catch {
            return { total_changes: 0, open_changes: 0, completed_changes: 0, total_problems: 0, open_problems: 0 };
        }
    }
}

export const itsmService = new ItsmService();
export default itsmService;
