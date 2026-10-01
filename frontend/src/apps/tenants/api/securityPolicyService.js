import apiClient from '../../../core/api/client';

export const securityPolicyService = {
    getPolicy: () => apiClient.get('tenants/security-policy/'),
    updatePolicy: (data) => apiClient.patch('tenants/security-policy/', data)
};
