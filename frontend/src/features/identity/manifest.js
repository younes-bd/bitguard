import IdentityDashboard from './dashboards/IdentityDashboard';
import { identityRoutes } from './routes';

export default {
    slug: "identity",
    name: "Identity & Access",
    dashboard: IdentityDashboard,
    routes: identityRoutes,
    internal: true,
    standalone: true,
};
