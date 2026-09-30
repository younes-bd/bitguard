import client from '@/core/api/client';

export const auditLogService = {
    getAuditLogs: (params) => client.get('core/system-events/', { params })
};
