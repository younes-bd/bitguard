import client from '@/core/api/client';

export const roleService = {
    getUserGroups: () => client.get('users/roles/'),
    createUserGroup: (data) => client.post('users/roles/', data),
    updateUserGroup: (id, data) => client.patch(`users/roles/${id}/`, data),
    deleteUserGroup: (id) => client.delete(`users/roles/${id}/`)
};
