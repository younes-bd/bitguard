import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommandCenter from './CommandCenter';
import { boardService } from '../../api/boardService';
import React from 'react';

// Mock the dashboard service
vi.mock('../../api/boardService', () => ({
    boardService: {
        getMetrics: vi.fn(),
        getSystemHealth: vi.fn(),
        getRecentActivity: vi.fn()
    }
}));

// Mock ResizeObserver globally for Recharts and other components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock Recharts because it uses ResizeObserver which isn't natively supported in JSDOM
vi.mock('recharts', async () => {
    const ActualRecharts = await vi.importActual('recharts');
    return {
        ...ActualRecharts,
        ResponsiveContainer: ({ children }) => (
            <div style={{ width: '100%', height: '300px' }}>{children}</div>
        )
    };
});

describe('CommandCenter Dashboard', () => {
    const mockMetrics = {
        mrr: 125000,
        mrr_growth: 12.5,
        active_clients: 45,
        client_growth: 5.2,
        open_tickets: 12,
        ticket_growth: -15,
        sla_breaches: 0,
        pending_approvals: 3,
        system_uptime: 99.99,
        security: { open_alerts: 2 },
        contracts: { sla_breaches: 1 },
        erp: { overdue_invoices: 4 },
        approvals: { pending: 5 },
        inventory: { low_stock_items: 12 }, purchase: { pending_orders: 5 },
        services: { high_risk: 1 },
        hrm: { expiring_certifications: 3 },
        documents: { expiring_soon: 2 },
        assets: { expiring_licenses: 5 }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the loading state initially', () => {
        boardService.getMetrics.mockReturnValue(new Promise(() => {})); // pending promise
        boardService.getSystemHealth.mockReturnValue(new Promise(() => {}));
        boardService.getRecentActivity.mockReturnValue(new Promise(() => {}));
        render(
            <BrowserRouter>
                <CommandCenter />
            </BrowserRouter>
        );
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('renders the dashboard with KPI cards and Needs Attention widgets', async () => {
        boardService.getMetrics.mockResolvedValue(mockMetrics);
        boardService.getSystemHealth.mockResolvedValue({ status: 'healthy', active_nodes: 5, load_avg: '0.45' });
        boardService.getRecentActivity.mockResolvedValue([]);
        
        render(
            <BrowserRouter>
                <CommandCenter />
            </BrowserRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });

        // Check if the KPI values are rendered
        expect(screen.getByText('$125.0k')).toBeInTheDocument(); // MRR
        expect(screen.getByText('45')).toBeInTheDocument(); // Active Clients

        // Check if "Needs Attention" renders
        expect(screen.getByText('Needs Attention')).toBeInTheDocument();
        expect(screen.getByText('2 Unresolved Security Alerts')).toBeInTheDocument();
        expect(screen.getByText('1 SLA Breaches')).toBeInTheDocument();
        expect(screen.getByText('4 Overdue Invoices')).toBeInTheDocument();
        expect(screen.getByText('5 Pending Approvals')).toBeInTheDocument();

        // Check if Recharts elements render (Titles)
        expect(screen.getByText('Monthly Recurring Revenue (MRR) Growth')).toBeInTheDocument();
        expect(screen.getByText('7-Day Support Ticket Burndown')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        boardService.getMetrics.mockRejectedValue(new Error('Failed to fetch metrics'));
        boardService.getSystemHealth.mockResolvedValue({});
        boardService.getRecentActivity.mockResolvedValue([]);
        
        render(
            <BrowserRouter>
                <CommandCenter />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
        });
    });
});
