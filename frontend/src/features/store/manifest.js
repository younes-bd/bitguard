import ProductCatalog from './pages/ProductCatalog';
import { storeRoutes } from './routes';

export default {
    slug: "store",
    name: "Store",
    dashboard: ProductCatalog, // Default entry point
    routes: storeRoutes,
    internal: true,
    standalone: true,
};
