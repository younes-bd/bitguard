import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaxGroups from './TaxGroups';

// Mock the accountingService
vi.mock('../../api/accountingService', () => {
    return {
        accountingService: {
            getTaxes: vi.fn(),
        }
    };
});

// Mock Lucide React icons
vi.mock('lucide-react', () => {
    return {
        Percent: () => <div data-testid="icon-percent" />,
        Plus: () => <div data-testid="icon-plus" />,
        Loader: () => <div data-testid="icon-loader" />,
    };
});

describe('TaxGroups Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        accountingService.getTaxes.mockImplementation(() => new Promise(() => {})); // Never resolves
        
        render(<TaxGroups />);
        
        expect(screen.getByText(/Tax Authorities & Groups/i)).toBeInTheDocument();
        expect(screen.getByText(/Loading Tax Groups.../i)).toBeInTheDocument();
    });

    it('renders mock data if api returns empty', async () => {
        accountingService.getTaxes.mockResolvedValueOnce([]);
        
        render(<TaxGroups />);
        
        await waitFor(() => {
            expect(screen.getByText(/Canadian Harmonized Sales Tax/i)).toBeInTheDocument();
            expect(screen.getByText(/13.00%/i)).toBeInTheDocument();
        });
    });

    it('renders taxes from API correctly', async () => {
        const mockTaxes = [
            { id: 1, name: 'VAT', description: 'Standard VAT', rate: 20, is_active: true },
            { id: 2, name: 'Sales Tax', description: 'Local Sales Tax', rate: 7.5, is_active: false }
        ];
        accountingService.getTaxes.mockResolvedValueOnce(mockTaxes);
        
        render(<TaxGroups />);
        
        await waitFor(() => {
            expect(screen.getByText('VAT')).toBeInTheDocument();
            expect(screen.getByText('Standard VAT')).toBeInTheDocument();
            expect(screen.getByText('20.00%')).toBeInTheDocument();
            
            expect(screen.getByText('Sales Tax')).toBeInTheDocument();
            expect(screen.getByText('Local Sales Tax')).toBeInTheDocument();
            expect(screen.getByText('7.50%')).toBeInTheDocument();
            expect(screen.getByText('Inactive')).toBeInTheDocument();
        });
    });
});
