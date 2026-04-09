import client from './client';

/**
 * Documents Service — connects to /api/documents/
 * Backend registers: vault (documents), versions
 */
class DocumentsService {
    async getDocuments(params = {}) {
        const response = await client.get('documents/vault/', { params });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getDocument(id) {
        const response = await client.get(`documents/vault/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createDocument(data) {
        const response = await client.post('documents/vault/', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data?.data ?? response.data;
    }

    async updateDocument(id, data) {
        const response = await client.patch(`documents/vault/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteDocument(id) {
        await client.delete(`documents/vault/${id}/`);
    }

    async getVersions(documentId) {
        const response = await client.get('documents/versions/', { params: { document: documentId } });
        return response.data?.data ?? response.data?.results ?? response.data ?? [];
    }

    async getStats() {
        try {
            const docs = await this.getDocuments();
            const all = Array.isArray(docs) ? docs : docs?.results ?? [];
            return {
                total: all.length,
                policies: all.filter(d => d.category === 'policy').length,
                contracts: all.filter(d => d.category === 'contract').length,
                archived: all.filter(d => d.is_archived).length,
            };
        } catch {
            return { total: 0, policies: 0, contracts: 0, archived: 0 };
        }
    }
}

export const documentsService = new DocumentsService();
export default documentsService;
