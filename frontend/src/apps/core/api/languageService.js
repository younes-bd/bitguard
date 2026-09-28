import client from '@/core/api/client';

export const languageService = {
    getLanguages: (params) => client.get('core/languages/', { params }),
    createLanguage: (payload) => client.post('core/languages/', payload),
    updateLanguage: (id, payload) => client.patch(`core/languages/${id}/`, payload),
    deleteLanguage: (id) => client.delete(`core/languages/${id}/`),
    setDefaultLanguage: (id) => client.post(`core/languages/${id}/set_default/`)
};
