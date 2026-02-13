import client from '../../../shared/core/services/client';

const hrmService = {
    // Employees
    getEmployees: async () => {
        return new Promise(resolve => setTimeout(() => resolve({
            data: [
                { id: 1, name: 'Alice Smith', position: 'Manager', department: 'Sales' },
                { id: 2, name: 'Bob Jones', position: 'Developer', department: 'IT' },
            ]
        }), 500));
    },

    // Stats
    getHrmStats: async () => {
        return new Promise(resolve => setTimeout(() => resolve({
            data: {
                total_employees: 48,
                new_hires: 12,
                payroll_status: 'Pending',
                on_leave: 3
            }
        }), 600));
    }
};

export default hrmService;
