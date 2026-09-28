import client from '@/core/api/client';

export const moduleService = {
    getModules: (params) => client.get('core/modules/', { params }),
    getModule: (id) => client.get(`core/modules/${id}/`),
    updateModule: (id, payload) => client.patch(`core/modules/${id}/`, payload),
    updateModuleList: () => client.post('core/modules/update_list/'),
    installModule: (id) => client.post(`core/modules/${id}/install/`),
    uninstallModule: (id) => client.post(`core/modules/${id}/uninstall/`),
    upgradeModule: (id) => client.post(`core/modules/${id}/upgrade/`)
};
