import client from '../../../core/api/client';

const itamService = {
    getAssets: (params = {}) => client.get('itam/assets/', { params }).then(r => r.data),
    getAsset: (id) => client.get(`itam/assets/${id}/`).then(r => r.data),
    createAsset: (data) => client.post('itam/assets/', data).then(r => r.data),
    updateAsset: (id, data) => client.patch(`itam/assets/${id}/`, data).then(r => r.data),
    deleteAsset: (id) => client.delete(`itam/assets/${id}/`),
    getStats: () => client.get('itam/assets/stats/').then(r => r.data),
    getAssignments: () => client.get('itam/assignments/').then(r => r.data),
    getMaintenance: (assetId) => client.get('itam/maintenance/', { params: { asset: assetId } }).then(r => r.data),
    createMaintenance: (data) => client.post('itam/maintenance/', data).then(r => r.data),
};

export default itamService;
