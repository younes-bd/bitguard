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
        // Handle both standard json or multipart depending on caller
        const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        const response = await client.patch("tenants/" + id + "/", data, { headers });
        return response.data?.data ?? response.data;
    },
    switchTenant: async (tenantId) => {
        const response = await client.post('tenants/switch/', { tenant_id: tenantId });
        return response.data?.data ?? response.data;
    }
};

