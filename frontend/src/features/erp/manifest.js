import ErpDashboard from './dashboards/ErpDashboard';
import { erpRoutes } from './routes';

export default {
    slug: "erp",
    name: "ERP",
    dashboard: ErpDashboard,
    routes: erpRoutes,
    internal: true,
    standalone: true,
};
