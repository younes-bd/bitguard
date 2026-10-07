import apiClient from '../../../core/api/client';

export const securityPolicyService = {
    getPolicy: async () => {
        const response = await apiClient.get('tenants/security-policy/');
        const list = response.data?.data ?? response.data?.results ?? response.data ?? [];
        return list.length > 0 ? list[0] : null;
    },
    updatePolicy: (id, data) => apiClient.patch(`tenants/security-policy/${id}/`, data),
    createPolicy: (data) => apiClient.post('tenants/security-policy/', data)
};
