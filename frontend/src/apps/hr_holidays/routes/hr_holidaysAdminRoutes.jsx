import React from 'react';
import { Route } from 'react-router-dom';
import LeaveManagement from '../pages/lists/LeaveManagement';
import LeaveApprovals from '../pages/lists/LeaveApprovals';
import LeaveAllocations from '../pages/lists/LeaveAllocations';
import LeaveSettings from '../pages/settings/LeaveSettings';
import LeaveTypes from '../pages/lists/LeaveTypes';

export const hrHolidaysAdminRoutes = (
    <>
        <Route index element={<LeaveManagement />} />
        <Route path="requests" element={<LeaveManagement />} />
        <Route path="approvals" element={<LeaveApprovals />} />
        <Route path="allocations" element={<LeaveAllocations />} />
        <Route path="settings" element={<LeaveSettings />} />
        <Route path="types" element={<LeaveTypes />} />
        <Route path="*" element={<LeaveManagement />} />
    </>
);
