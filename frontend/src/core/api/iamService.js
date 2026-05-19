import client from './client';

export const iamService = {
    // --- Identity (Users) ---
    getUsers: async (params = {}) => {
        const response = await client.get('iam/', { params });
        return response.data?.data?.users ?? response.data?.results ?? response.data ?? [];
    },
    getUser: async (id) => {
        const response = await client.get(`iam/${id}/`);
        return response.data?.data ?? response.data;
    },
    createUser: async (userData) => {
        const response = await client.post('iam/', userData);
        return response.data?.data ?? response.data;
    },
    updateUser: async (id, userData) => {
        const response = await client.patch(`iam/${id}/`, userData);
        return response.data?.data ?? response.data;
    },
    getMe: async () => {
        const response = await client.get('iam/me/');
        return response.data?.data ?? response.data;
    },
    updateMe: async (userData) => {
        // Using the standard 'me' endpoint for current user profile updates
        const response = await client.patch('iam/me/', userData);
        return response.data?.data ?? response.data;
    },
    deleteUser: async (id) => {
        const response = await client.delete(`iam/${id}/`);
        return response.data?.data ?? response.data;
    },

    // --- Access (Roles) ---
    getRoles: async () => {
        const response = await client.get('iam/roles/');
        return response.data?.data?.roles ?? response.data;
    },
    createRole: async (roleData) => {
        const response = await client.post('iam/roles/', roleData);
        return response.data?.data ?? response.data;
    },
    updateRole: async (id, roleData) => {
        const response = await client.put(`iam/roles/${id}/`, roleData);
        return response.data?.data ?? response.data;
    },
    deleteRole: async (id) => {
        const response = await client.delete(`iam/roles/${id}/`);
        return response.data?.data ?? response.data;
    },

    // --- Access (Permissions) ---
    getPermissions: async () => {
        const response = await client.get('iam/roles/permissions/');
        return response.data?.data ?? response.data;
    },

    getDashboardStats: async () => {
        const response = await client.get('iam/stats/');
        return response.data?.data ?? response.data;
    },

    getAuditLogs: async (params = {}) => {
        const response = await client.get('audit/logs/', { params });
        return response.data?.data?.results ?? response.data?.results ?? response.data ?? [];
    },

    // --- Security Actions ---
    lockUser: async (id) => {
        const response = await client.post(`iam/${id}/lock/`);
        return response.data;
    },
    unlockUser: async (id) => {
        const response = await client.post(`iam/${id}/unlock/`);
        return response.data;
    },

    // --- MFA ---
    setupMfa: async () => {
        const response = await client.post('iam/mfa_setup/');
        return response.data?.data ?? response.data;
    },
    verifyMfa: async (token) => {
        const response = await client.post('iam/mfa_verify/', { token });
        return response.data;
    },

    // --- API Keys ---
    getApiKeys: async () => {
        const response = await client.get('iam/api_keys/');
        return response.data?.data ?? response.data;
    },
    createApiKey: async (name) => {
        const response = await client.post('iam/api_keys/', { name });
        return response.data?.data ?? response.data;
    },
    revokeApiKey: async (keyId) => {
        const response = await client.delete(`iam/api_keys/${keyId}/`);
        return response.data;
    },

    // --- Security Policies ---
    getSecurityPolicy: async () => {
        const response = await client.get('iam/policy/');
        return response.data?.data ?? response.data;
    },
    updateSecurityPolicy: async (policyData) => {
        const response = await client.post('iam/update_policy/', policyData);
        return response.data?.data ?? response.data;
    },
    getSessions: async () => {
        const response = await client.get('iam/sessions/');
        return response.data?.data ?? response.data;
    }
};
