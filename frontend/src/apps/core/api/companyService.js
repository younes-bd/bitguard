import client from '@/core/api/client';

export const companyService = {
    getMyCompany: () => client.get('core/companies/my_company/'),
    updateMyCompany: (data) => client.patch('core/companies/my_company/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};
