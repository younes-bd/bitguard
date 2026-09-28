import client from '@/core/api/client';

export const coreService = {
    getContentTypes: () => client.get('core/content-types/'),
    getScheduledActions: () => client.get('core/scheduled-actions/'),
    getConfigOptions: () => client.get('core/config-options/'),
    getCountries: () => client.get('core/countries/'),
    getStates: (countryId) => client.get(`core/states/?country=${countryId}`),
    getUoMs: () => client.get('core/uom/'),
    getUoMCategories: () => client.get('core/uom-categories/')
};
