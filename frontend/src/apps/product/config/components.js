
import { lazy } from 'react';

export const getComponents = () => ({
    'product.CreateProductModal': lazy(() => import('../components/CreateProductModal'))
});
