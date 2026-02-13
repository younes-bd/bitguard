import HrmDashboard from './dashboards/HrmDashboard';
import { hrmRoutes } from './routes';

export default {
    slug: "hrm",
    name: "Human Capital",
    dashboard: HrmDashboard,
    routes: hrmRoutes,
    internal: true,
    standalone: true,
};
