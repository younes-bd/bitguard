import React from 'react';
import { Route } from 'react-router-dom';
import LeaveManagement from '../pages/lists/LeaveManagement';

export const timeoffRoutes = (
    <>
        <Route index element={<LeaveManagement />} />
        <Route path="requests" element={<LeaveManagement />} />
        <Route path="approvals" element={<div className="p-8">Approvals placeholder</div>} />
        <Route path="allocations" element={<div className="p-8">Allocations placeholder</div>} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
        <Route path="types" element={<div className="p-8">Types placeholder</div>} />
        <Route path="*" element={<LeaveManagement />} />
    </>
);
