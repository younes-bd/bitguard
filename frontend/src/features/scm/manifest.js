import ScmDashboard from './dashboards/ScmDashboard';
import { scmRoutes } from './routes';

export default {
    slug: "scm",
    name: "Supply Chain",
    dashboard: ScmDashboard,
    routes: scmRoutes,
    internal: true,
    standalone: true,
};
