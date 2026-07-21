import { describe, it, expect, vi, beforeEach } from 'vitest';
import { erpService } from './erpService';
import client from './client';

// Mock the axios client
vi.mock('./client', () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }
    };
});

describe('erpService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getInvoices should fetch invoices successfully', async () => {
        const mockData = { data: { results: [{ id: 1, reference: 'INV-001' }] } };
        client.get.mockResolvedValueOnce(mockData);

        const result = await erpService.getInvoices();

        expect(client.get).toHaveBeenCalledWith('erp/invoices/', { params: {} });
        expect(result).toEqual(mockData.data);
    });

    it('createInvoice should post payload and return response', async () => {
        const payload = { client: 1, total: 1000 };
        const mockData = { data: { id: 1, ...payload } };
        client.post.mockResolvedValueOnce(mockData);

        const result = await erpService.createInvoice(payload);

        expect(client.post).toHaveBeenCalledWith('erp/invoices/', payload);
        expect(result).toEqual(mockData.data);
    });

    it('getTaxes should fetch taxes', async () => {
        const mockData = { data: [{ id: 1, rate: 5 }] };
        client.get.mockResolvedValueOnce(mockData);

        const result = await erpService.getTaxes();

        expect(client.get).toHaveBeenCalledWith('erp/taxes/');
        expect(result).toEqual(mockData.data);
    });

    it('convertQuotationToInvoice should call the correct endpoint', async () => {
        const mockData = { data: { id: 10, type: 'invoice' } };
        client.post.mockResolvedValueOnce(mockData);

        const result = await erpService.convertQuotationToInvoice(5);

        expect(client.post).toHaveBeenCalledWith('erp/quotations/5/convert-to-invoice/');
        expect(result).toEqual(mockData.data);
    });
});
