import client from '@/core/api/client';

export const usersService = {
    // --- Identity (Users) ---
    getUsers: async (params = {}) => {
        const response = await client.get('users/', { params });
        return response.data?.data?.users ?? response.data?.results ?? response.data ?? [];
    },
    getUser: async (id) => {
        const response = await client.get(`users/${id}/`);
        return response.data?.data ?? response.data;
    },
    createUser: async (userData) => {
        const response = await client.post('users/', userData);
        return response.data?.data ?? response.data;
    },
    updateUser: async (id, userData) => {
        const response = await client.patch(`users/${id}/`, userData);
        return response.data?.data ?? response.data;
    },
    getMe: async () => {
        const response = await client.get('users/me/');
        return response.data?.data ?? response.data;
    },
    updateMe: async (userData) => {
        // Using the standard 'me' endpoint for current user profile updates
        const response = await client.patch('users/me/', userData);
        return response.data?.data ?? response.data;
    },
    deleteUser: async (id) => {
        const response = await client.delete(`users/${id}/`);
        return response.data?.data ?? response.data;
    },

    // --- Tenancy ---
    getTenants: async (params = {}) => {
        const response = await client.get('tenants/', { params });
        return response.data?.data?.tenants ?? response.data?.results ?? response.data ?? [];
    },

    // --- Access (Roles) ---
    getRoles: async () => {
        const response = await client.get('users/roles/');
        return response.data?.data?.roles ?? response.data;
    },
    createRole: async (roleData) => {
        const response = await client.post('users/roles/', roleData);
        return response.data?.data ?? response.data;
    },
    updateRole: async (id, roleData) => {
        const response = await client.put(`users/roles/${id}/`, roleData);
        return response.data?.data ?? response.data;
    },
    deleteRole: async (id) => {
        const response = await client.delete(`users/roles/${id}/`);
        return response.data?.data ?? response.data;
    },

    // --- Access (Permissions) ---
    getPermissions: async () => {
        const response = await client.get('users/roles/permissions/');
        return response.data?.data ?? response.data;
    },

    getDashboardStats: async () => {
        const response = await client.get('users/stats/');
        return response.data?.data ?? response.data;
    },

    getAuditLogs: async (params = {}) => {
        const response = await client.get('system/audit-logs/', { params });
        return response.data?.data?.results ?? response.data?.results ?? response.data ?? [];
    },

    // --- Security Actions ---
    lockUser: async (id) => {
        const response = await client.post(`users/${id}/lock/`);
        return response.data;
    },
    unlockUser: async (id) => {
        const response = await client.post(`users/${id}/unlock/`);
        return response.data;
    },

    // --- MFA ---
    setupMfa: async () => {
        const response = await client.post('users/mfa_setup/');
        return response.data?.data ?? response.data;
    },
    verifyMfa: async (token) => {
        const response = await client.post('users/mfa_verify/', { token });
        return response.data;
    },

    // --- API Keys ---
    getApiKeys: async () => {
        const response = await client.get('users/api_keys/');
        return response.data?.data ?? response.data;
    },
    createApiKey: async (name) => {
        const response = await client.post('users/api_keys/', { name });
        return response.data?.data ?? response.data;
    },
    revokeApiKey: async (keyId) => {
        const response = await client.delete(`users/api_keys/${keyId}/`);
        return response.data;
    },

    // --- Security Policies ---
    getSecurityPolicy: async () => {
        const response = await client.get('users/security-policy/');
        // Assume single policy for now
        return response.data?.data?.[0] ?? response.data?.results?.[0] ?? response.data?.[0] ?? response.data;
    },
    updateSecurityPolicy: async (id, policyData) => {
        const response = await client.put(`users/security-policy/${id}/`, policyData);
        return response.data?.data ?? response.data;
    },
    getSessions: async () => {
        const response = await client.get('users/sessions/');
        return response.data?.data ?? response.data;
    },
    revokeSession: async (id) => {
        const response = await client.delete(`users/${id}/session_revoke/`);
        return response.data?.data ?? response.data;
    },

    // --- Record Rules ---
    getRecordRules: async (params = {}) => {
        const response = await client.get('users/record-rules/', { params });
        return response.data?.data?.results ?? response.data?.results ?? response.data ?? [];
    },
    getRecordRule: async (id) => {
        const response = await client.get(`users/record-rules/${id}/`);
        return response.data?.data ?? response.data;
    },
    createRecordRule: async (data) => {
        const response = await client.post('users/record-rules/', data);
        return response.data?.data ?? response.data;
    },
    updateRecordRule: async (id, data) => {
        const response = await client.put(`users/record-rules/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteRecordRule: async (id) => {
        const response = await client.delete(`users/record-rules/${id}/`);
        return response.data?.data ?? response.data;
    }
};
