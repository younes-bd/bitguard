import IdentityDashboard from './dashboards/IdentityDashboard';
import { identityRoutes } from '../hrm/routes';

export default {
    slug: "identity",
    name: "Identity & Access",
    dashboard: IdentityDashboard,
    routes: identityRoutes,
    internal: true,
    standalone: true,
};
