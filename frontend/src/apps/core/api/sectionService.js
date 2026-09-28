import client from '@/core/api/client';

export const sectionService = {
    getSections: () => client.get('core/sections/'),
    updateSection: (id, payload) => client.patch(`core/sections/${id}/`, payload)
};
