import CrmDashboard from './dashboards/CrmDashboard';
import { crmRoutes } from './routes';

export default {
    slug: "crm",
    name: "CRM",
    dashboard: CrmDashboard,
    routes: crmRoutes,
    internal: true,
    standalone: true,
};
