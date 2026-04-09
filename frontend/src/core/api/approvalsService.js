import client from './client';

/**
 * Approvals Service — connects to /api/approvals/
 * Backend registers: requests (ApprovalRequest), steps (ApprovalStep)
 */
class ApprovalsService {
    async getApprovals(params = {}) {
        const response = await client.get('approvals/requests/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getApproval(id) {
        const response = await client.get(`approvals/requests/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createApproval(data) {
        const response = await client.post('approvals/requests/', data);
        return response.data?.data ?? response.data;
    }

    async approve(id, comments = '') {
        const response = await client.patch(`approvals/requests/${id}/`, {
            status: 'approved',
            comments,
        });
        return response.data?.data ?? response.data;
    }

    async reject(id, comments = '') {
        const response = await client.patch(`approvals/requests/${id}/`, {
            status: 'rejected',
            comments,
        });
        return response.data?.data ?? response.data;
    }

    async getSteps(requestId) {
        const response = await client.get('approvals/steps/', { params: { approval_request: requestId } });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getStats() {
        try {
            const all = await this.getApprovals();
            const items = Array.isArray(all) ? all : all?.results ?? [];
            return {
                total: items.length,
                pending: items.filter(a => a.status === 'pending').length,
                approved: items.filter(a => a.status === 'approved').length,
                rejected: items.filter(a => a.status === 'rejected').length,
            };
        } catch {
            return { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
    }
}

export const approvalsService = new ApprovalsService();
export default approvalsService;
