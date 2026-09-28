import client from '@/core/api/client';

export const tenantService = {
    getMyCompany: () => client.get('tenants/my-company/'),
    updateMyCompany: (data) => client.patch('tenants/my-company/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};
