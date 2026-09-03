import client from '@/core/api/client';

class DocumentsService {
    // ---- Workspaces ----
    async getWorkspaces(params) {
        const response = await client.get('documents/workspaces/', { params });
        return response.data;
    }

    async createWorkspace(data) {
        const response = await client.post('documents/workspaces/', data);
        return response.data;
    }

    async updateWorkspace(id, data) {
        const response = await client.patch(`documents/workspaces/${id}/`, data);
        return response.data;
    }

    async deleteWorkspace(id) {
        await client.delete(`documents/workspaces/${id}/`);
    }

    // ---- Tags ----
    async getTags(params) {
        const response = await client.get('documents/tags/', { params });
        return response.data;
    }

    async createTag(data) {
        const response = await client.post('documents/tags/', data);
        return response.data;
    }

    // ---- Documents ----
    async getDocuments(params = {}) {
        const response = await client.get('documents/vault/', { params: { page_size: 100, ...params } });
        return response.data;
    }

    async getDocument(id) {
        const response = await client.get(`documents/vault/${id}/`);
        return response.data;
    }

    async uploadDocument(data, onUploadProgress) {
        const response = await client.post('documents/vault/', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
        return response.data;
    }

    async updateDocument(id, data) {
        const response = await client.patch(`documents/vault/${id}/`, data);
        return response.data;
    }

    async deleteDocument(id) {
        await client.delete(`documents/vault/${id}/`);
    }

    async archiveDocument(id) {
        const response = await client.post(`documents/vault/${id}/archive/`);
        return response.data;
    }

    async lockDocument(id) {
        const response = await client.post(`documents/vault/${id}/lock/`);
        return response.data;
    }

    async shareDocument(id) {
        const response = await client.post(`documents/vault/${id}/share/`);
        return response.data;
    }

    // ---- Versions ----
    async getVersions(documentId) {
        const response = await client.get('documents/versions/', { params: { document: documentId } });
        return response.data;
    }

    async bumpVersion(documentId, data, onUploadProgress) {
        const response = await client.post(`documents/vault/${documentId}/bump_version/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
        return response.data;
    }
}

export const documentsService = new DocumentsService();
export default documentsService;
