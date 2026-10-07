import React from 'react';
import { Route } from 'react-router-dom';
import PosDashboard from '../pages/dashboards/PosDashboardPage';
import PosTerminal from '../pages/features/PosTerminalPage';
import PaymentMethods from '../pages/features/PaymentMethodsPage';
import PosPayments from '../pages/features/PosPaymentsPage';

export const posAdminRoutes = (
    <>
        <Route path="pos" element={<PosDashboard />} />
        <Route path="pos/terminal" element={<PosTerminal />} />
        <Route path="pos/payment-methods" element={<PaymentMethods />} />
        <Route path="pos/payments" element={<PosPayments />} />
    </>
);
