import SocDashboard from './dashboards/SocDashboard';
import { socRoutes } from './routes';

export default {
    slug: "soc",
    name: "SOC",
    dashboard: SocDashboard,
    routes: socRoutes,
    internal: true,
    standalone: true,
};
