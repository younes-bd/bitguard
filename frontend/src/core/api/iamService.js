import client from './client';

export const iamService = {
    // --- Identity (Users) ---
    getUsers: async (params = {}) => {
        const response = await client.get('accounts/users/', { params });
        return response.data;
    },
    getUser: async (id) => {
        const response = await client.get(`accounts/users/${id}/`);
        return response.data;
    },
    createUser: async (userData) => {
        const response = await client.post('accounts/register/', userData); // or accounts/users/ if admin create
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await client.patch(`accounts/users/${id}/`, userData);
        return response.data;
    },
    updateMe: async (userData) => {
        const response = await client.patch('accounts/profile/me/', userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await client.delete(`accounts/users/${id}/`);
        return response.data;
    },

    // --- Access (Roles) ---
    getRoles: async () => {
        const response = await client.get('access/roles/');
        return response.data;
    },
    createRole: async (roleData) => {
        const response = await client.post('access/roles/', roleData);
        return response.data;
    },
    updateRole: async (id, roleData) => {
        const response = await client.put(`access/roles/${id}/`, roleData);
        return response.data;
    },
    deleteRole: async (id) => {
        const response = await client.delete(`access/roles/${id}/`);
        return response.data;
    },

    // --- Access (Permissions) ---
    getPermissions: async () => {
        const response = await client.get('access/permissions/');
        return response.data;
    }
};
