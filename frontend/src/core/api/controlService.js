import client from './client';

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
        const response = await client.get('dashboard/health/');
        return response.data?.data ?? response.data ?? {};
    },

    /**
     * Retrieves platform policy configuration.
     */
    updatePolicy: async (policyData) => {
        const response = await client.patch('sysadmin/policy/', policyData);
        return response.data?.data ?? response.data ?? {};
    }
};

export default controlService;
