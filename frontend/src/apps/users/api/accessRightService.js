import client from '@/core/api/client';

export const accessRightService = {
    getAccessRights: (params) => client.get('users/role-permissions/', { params }),
    createAccessRight: (data) => client.post('users/role-permissions/', data),
    updateAccessRight: (id, data) => client.patch(`users/role-permissions/${id}/`, data),
    deleteAccessRight: (id) => client.delete(`users/role-permissions/${id}/`)
};
