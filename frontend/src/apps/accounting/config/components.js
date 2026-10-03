
import { lazy } from 'react';

export const getComponents = () => ({
    'accounting.InvoiceLineItems': lazy(() => import('../components/InvoiceLineItems'))
});
