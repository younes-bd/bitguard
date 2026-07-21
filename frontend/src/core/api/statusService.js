import client from './client';

const statusService = {
    getSystemStatus: async () => {
        try {
            // Using a mock promise that mimics an API call to a backend status endpoint
            return await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        overallStatus: 'Operational',
                        systems: [
                            { id: 1, name: 'Cloud Infrastructure', status: 'Operational', uptime: '99.99%' },
                            { id: 2, name: 'API Services', status: 'Operational', uptime: '99.95%' },
                            { id: 3, name: 'Client Portal', status: 'Operational', uptime: '100%' },
                            { id: 4, name: 'Support Ticketing', status: 'Operational', uptime: '99.90%' }
                        ],
                        incidents: [
                            { id: 1, date: 'October 24, 2026', title: 'Degraded Performance in US-East', status: 'Resolved', description: 'A network routing issue caused increased latency for approximately 45 minutes. Services have been fully restored.' }
                        ],
                        lastUpdated: new Date().toISOString()
                    });
                }, 800); // simulate network delay
            });
        } catch (error) {
            console.error('Failed to fetch system status:', error);
            throw error;
        }
    }
};

export default statusService;
