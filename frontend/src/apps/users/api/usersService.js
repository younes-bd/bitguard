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

    // --- Phase 6 additional Identity ---
    inviteUser: async (data) => {
        const response = await client.post('users/invite/', data);
        return response.data?.data ?? response.data;
    },
    resendInvitation: async (id) => {
        const response = await client.post(`users/invitations/${id}/resend/`);
        return response.data?.data ?? response.data;
    },
    resetPassword: async (id) => {
        const response = await client.post(`users/${id}/reset_password/`);
        return response.data?.data ?? response.data;
    },

    // --- Access (Roles) ---
    getRoles: async () => {
        const response = await client.get('users/roles/');
        return response.data?.data?.roles ?? response.data?.data ?? response.data?.results ?? response.data ?? [];
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
    getRoleUsers: async (id) => {
        const response = await client.get(`users/roles/${id}/users/`);
        return response.data?.data ?? response.data;
    },
    assignUsersToRole: async (id, data) => {
        const response = await client.post(`users/roles/${id}/assign_users/`, data);
        return response.data?.data ?? response.data;
    },

    // --- Access (Permissions) ---
    getPermissions: async () => {
        const response = await client.get('users/roles/permissions/');
        return response.data?.data ?? response.data;
    },
    getContentTypes: async () => {
        const response = await client.get('base/content-types/');
        return response.data?.data ?? response.data;
    },
    getRolePermissionsMatrix: async () => {
        const response = await client.get('users/role-permissions/matrix/');
        return response.data?.data ?? response.data;
    },
    getRolePermissions: async (params = {}) => {
        const response = await client.get('users/role-permissions/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    },
    createRolePermission: async (data) => {
        const response = await client.post('users/role-permissions/', data);
        return response.data?.data ?? response.data;
    },
    updateRolePermission: async (id, data) => {
        const response = await client.patch(`users/role-permissions/${id}/`, data);
        return response.data?.data ?? response.data;
    },

    getDashboardStats: async () => {
        const response = await client.get('users/stats/');
        return response.data?.data ?? response.data;
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
    getPersonalAccessTokens: async () => {
        const response = await client.get('users/personal_access_tokens/');
        return response.data?.data ?? response.data;
    },
    createPersonalAccessToken: async (name) => {
        const response = await client.post('users/personal_access_tokens/', { name });
        return response.data?.data ?? response.data;
    },
    revokePersonalAccessToken: async (keyId) => {
        const response = await client.delete(`users/personal_access_tokens/${keyId}/`);
        return response.data;
    },

    // --- Security Policies ---
};
