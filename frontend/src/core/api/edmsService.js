import client from './client';

class EDMSService {
    // ---- Workspaces ----
    async getWorkspaces(params) {
        const response = await client.get('edms/workspaces/', { params });
        return response.data;
    }

    async createWorkspace(data) {
        const response = await client.post('edms/workspaces/', data);
        return response.data;
    }

    async updateWorkspace(id, data) {
        const response = await client.patch(`edms/workspaces/${id}/`, data);
        return response.data;
    }

    async deleteWorkspace(id) {
        await client.delete(`edms/workspaces/${id}/`);
    }

    // ---- Tags ----
    async getTags(params) {
        const response = await client.get('edms/tags/', { params });
        return response.data;
    }

    async createTag(data) {
        const response = await client.post('edms/tags/', data);
        return response.data;
    }

    // ---- Documents ----
    async getDocuments(params) {
        const response = await client.get('edms/vault/', { params });
        return response.data;
    }

    async getDocument(id) {
        const response = await client.get(`edms/vault/${id}/`);
        return response.data;
    }

    async uploadDocument(data, onUploadProgress) {
        const response = await client.post('edms/vault/', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
        return response.data;
    }

    async updateDocument(id, data) {
        const response = await client.patch(`edms/vault/${id}/`, data);
        return response.data;
    }

    async deleteDocument(id) {
        await client.delete(`edms/vault/${id}/`);
    }

    async archiveDocument(id) {
        const response = await client.post(`edms/vault/${id}/archive/`);
        return response.data;
    }

    async lockDocument(id) {
        const response = await client.post(`edms/vault/${id}/lock/`);
        return response.data;
    }

    async shareDocument(id) {
        const response = await client.post(`edms/vault/${id}/share/`);
        return response.data;
    }

    // ---- Versions ----
    async getVersions(documentId) {
        const response = await client.get('edms/versions/', { params: { document: documentId } });
        return response.data;
    }

    async bumpVersion(documentId, data, onUploadProgress) {
        const response = await client.post(`edms/vault/${documentId}/bump_version/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
        return response.data;
    }
}

export const edmsService = new EDMSService();
export default edmsService;
