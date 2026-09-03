import client from '@/core/api/client';

export const userService = {
    // --- Profile ---
    getProfile: async () => {
        const response = await client.get('users/me/');
        return response.data?.data ?? response.data;
    },
    updateProfile: async (data) => {
        const response = await client.patch('users/me/', data);
        return response.data?.data ?? response.data;
    },

    // --- Security ---
    getSecurityLogs: async () => {
        const response = await client.get('system/audit-logs/');
        return response.data?.data ?? response.data;
    },
    getSecurityDevices: async () => {
        const response = await client.get('users/sessions/');
        return response.data?.data ?? response.data;
    },
    generate2FA: async () => {
        const response = await client.post('users/mfa_setup/');
        return response.data?.data ?? response.data;
    },
    verify2FA: async (data) => {
        const response = await client.post('users/mfa_verify/', data);
        return response.data?.data ?? response.data;
    },
    changePassword: async (data) => {
        const response = await client.post('users/change-password/', data);
        return response.data?.data ?? response.data;
    },

    // --- Notifications ---
    getNotificationPreferences: async () => {
        const response = await client.get('notifications/preferences/');
        return response.data?.data ?? response.data;
    },
    updateNotificationPreferences: async (data) => {
        const response = await client.patch('notifications/preferences/', data);
        return response.data?.data ?? response.data;
    },

    // --- People & Organization ---
    getTeammates: async () => {
        const response = await client.get('users/');
        return response.data?.data ?? response.data;
    },

    getConnections: async () => {
        const response = await client.get('users/connections/');
        return response.data?.data ?? response.data;
    },
    sendInvite: async (email) => {
        const response = await client.post('users/connections/', { email });
        return response.data?.data ?? response.data;
    },
    acceptConnection: async (id) => {
        const response = await client.post(`users/connections/${id}/accept/`);
        return response.data?.data ?? response.data;
    },
    getSharedResources: async () => {
        const response = await client.get('users/shared-resources/');
        return response.data?.data ?? response.data;
    },
    
    // --- Activity ---
    getActivityLog: async (params = {}) => {
        const response = await client.get('users/activity/', { params });
        return response.data?.data ?? response.data;
    }
};
