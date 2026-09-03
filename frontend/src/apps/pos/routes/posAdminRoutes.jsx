import React from 'react';
import { Route } from 'react-router-dom';
import PosDashboard from '../pages/dashboards/PosDashboard';
import PosTerminal from '../pages/features/PosTerminal';
import PaymentMethods from '../pages/features/PaymentMethods';
import PosPayments from '../pages/features/PosPayments';

export const posAdminRoutes = (
    <>
        <Route path="pos" element={<PosDashboard />} />
        <Route path="pos/terminal" element={<PosTerminal />} />
        <Route path="pos/payment-methods" element={<PaymentMethods />} />
        <Route path="pos/payments" element={<PosPayments />} />
    </>
);
