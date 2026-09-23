import React from 'react';
import { Route } from 'react-router-dom';
import LeaveManagement from '../pages/lists/LeaveManagementPage';
import LeaveApprovals from '../pages/lists/LeaveApprovalsPage';
import LeaveAllocations from '../pages/lists/LeaveAllocationsPage';
import LeaveSettings from '../pages/settings/LeaveSettingsPage';
import LeaveTypes from '../pages/lists/LeaveTypesPage';

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
