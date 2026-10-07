import client from '@/core/api/client';

export const recordRuleService = {
    getRecordRules: (params) => client.get('users/record-rules/', { params }),
    createRecordRule: (data) => client.post('users/record-rules/', data),
    updateRecordRule: (id, data) => client.patch(`users/record-rules/${id}/`, data),
    deleteRecordRule: (id) => client.delete(`users/record-rules/${id}/`)
};
