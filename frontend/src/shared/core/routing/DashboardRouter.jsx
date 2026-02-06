import { Navigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import CommandCenter from '../../../features/admin/CommandCenter';

const DashboardRouter = () => {
    const { tenant, hasProduct } = useTenant();

    if (!tenant) return null; // Or a loader

    // INTERNAL/UNIFIED MODE:
    // We now direct everyone to the Command Center (Main Dashboard),
    // which then provides navigation to enabled products.
    return <CommandCenter />;
};

export default DashboardRouter;
