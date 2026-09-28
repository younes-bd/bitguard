import client from '@/core/api/client';

export const sequenceService = {
    getSequences: (params) => client.get('core/sequences/', { params }),
    getSequence: (id) => client.get(`core/sequences/${id}/`),
    createSequence: (payload) => client.post('core/sequences/', payload),
    updateSequence: (id, payload) => client.patch(`core/sequences/${id}/`, payload),
    deleteSequence: (id) => client.delete(`core/sequences/${id}/`)
};
