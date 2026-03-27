import client from '../client';

/**
 * Enterprise Control Plane Service (Section 13)
 * Provides system-wide observability and policy control.
 */
const controlService = {
    /**
     * Retrieves operational health and workflow states.
     * Section 19 (Observability).
     */
    getSystemHealth: async () => {
        const response = await client.get('/api/admin/system/health/');
        return response.data;
    },

    /**
     * Placeholder for future control plane policy updates.
     */
    updatePolicy: async (policyData) => {
        const response = await client.patch('/api/admin/system/policy/', policyData);
        return response.data;
    }
};

export default controlService;
