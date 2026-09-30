import client from '@/core/api/client';

export const systemEventService = {
  getAuditLogs: (params) => client.get('core/system-events/', { params }),
  exportAuditLogs: (params) => client.get('core/system-events/?export=csv', { params }),
  pruneAuditLogs: (days) => client.post('core/system-events/prune/', { days }),
};
