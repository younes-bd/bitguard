import client from './client';

export const iamService = {
    // --- Identity (Users) ---
    getUsers: async (params = {}) => {
        const response = await client.get('accounts/users/', { params });
        return response.data.data;
    },
    getUser: async (id) => {
        const response = await client.get(`accounts/users/${id}/`);
        return response.data.data;
    },
    createUser: async (userData) => {
        const response = await client.post('accounts/register/', userData); // or accounts/users/ if admin create
        return response.data.data;
    },
    updateUser: async (id, userData) => {
        const response = await client.patch(`accounts/users/${id}/`, userData);
        return response.data.data;
    },
    updateMe: async (userData) => {
        const response = await client.patch('accounts/profile/me/', userData);
        return response.data.data;
    },
    deleteUser: async (id) => {
        const response = await client.delete(`accounts/users/${id}/`);
        return response.data.data;
    },

    // --- Access (Roles) ---
    getRoles: async () => {
        const response = await client.get('access/roles/');
        return response.data.data;
    },
    createRole: async (roleData) => {
        const response = await client.post('access/roles/', roleData);
        return response.data.data;
    },
    updateRole: async (id, roleData) => {
        const response = await client.put(`access/roles/${id}/`, roleData);
        return response.data.data;
    },
    deleteRole: async (id) => {
        const response = await client.delete(`access/roles/${id}/`);
        return response.data.data;
    },

    // --- Access (Permissions) ---
    getPermissions: async () => {
        const response = await client.get('access/permissions/');
        return response.data.data;
    }
};
