import client from '@/core/api/client';

export const tenantService = {
    
    getTenants: async (params = {}) => {
        const response = await client.get('tenants/', { params });
        return response.data?.data?.tenants ?? response.data?.results ?? response.data ?? [];
    },
    createTenant: async (data) => {
        const response = await client.post('tenants/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data?.data ?? response.data;
    },
    updateTenant: async (id, data) => {
        const response = await client.patch(`tenants/${id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data?.data ?? response.data;
    },
    deleteTenant: async (id) => {
        const response = await client.delete(`tenants/${id}/`);
        return response.data?.data ?? response.data;
    },

    getMyCompany: () => client.get('tenants/my-company/'),
    updateMyCompany: (data) => client.patch('tenants/my-company/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};
