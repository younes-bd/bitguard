import client from './client';

export const userService = {
    // --- Profile ---
    getProfile: async () => {
        const response = await client.get('accounts/profile/me/');
        return response.data?.data ?? response.data;
    },
    updateProfile: async (data) => {
        const response = await client.patch('accounts/profile/me/', data);
        return response.data?.data ?? response.data;
    },

    // --- Security ---
    getSecurityLogs: async () => {
        const response = await client.get('accounts/security/logs/');
        return response.data?.data ?? response.data;
    },
    getSecurityDevices: async () => {
        const response = await client.get('accounts/security/devices/');
        return response.data?.data ?? response.data;
    },
    generate2FA: async () => {
        const response = await client.post('accounts/security/2fa/generate/');
        return response.data?.data ?? response.data;
    },
    verify2FA: async (data) => {
        const response = await client.post('accounts/security/2fa/verify/', data);
        return response.data?.data ?? response.data;
    },
    changePassword: async (data) => {
        const response = await client.post('accounts/security/change-password/', data);
        return response.data?.data ?? response.data;
    },

    // --- Notifications ---
    getNotificationPreferences: async () => {
        const response = await client.get('accounts/notifications/preferences/');
        return response.data?.data ?? response.data;
    },
    updateNotificationPreferences: async (data) => {
        const response = await client.patch('accounts/notifications/preferences/', data);
        return response.data?.data ?? response.data;
    },

    // --- People & Organization ---
    getTeammates: async () => {
        const response = await client.get('accounts/teammates/');
        return response.data?.data ?? response.data;
    },

    getConnections: async () => {
        const response = await client.get('accounts/connections/');
        return response.data?.data ?? response.data;
    },
    sendInvite: async (email) => {
        const response = await client.post('accounts/connections/', { email });
        return response.data?.data ?? response.data;
    },
    acceptConnection: async (id) => {
        const response = await client.post(`accounts/connections/${id}/accept/`);
        return response.data?.data ?? response.data;
    },
    getSharedResources: async () => {
        const response = await client.get('accounts/shared-resources/');
        return response.data?.data ?? response.data;
    },
    
    // --- Activity ---
    getActivityLog: async (params = {}) => {
        const response = await client.get('accounts/activity-log/', { params });
        return response.data?.data ?? response.data;
    }
};
