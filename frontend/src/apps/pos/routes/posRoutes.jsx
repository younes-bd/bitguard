import React from 'react';
import { Route } from 'react-router-dom';
import PosDashboard from '../pages/dashboards/PosDashboard';
import PosTerminal from '../pages/features/PosTerminal';

export const posRoutes = (
    <>
        <Route path="pos" element={<PosDashboard />} />
        <Route path="pos/terminal" element={<PosTerminal />} />
    </>
);
