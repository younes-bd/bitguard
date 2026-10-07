import React from 'react';
import { Route } from 'react-router-dom';
import AttendanceLog from '../pages/lists/AttendanceLogPage';
import TimeTracking from '../pages/lists/TimeTrackingPage';
import AttendanceKiosk from '../pages/lists/AttendanceKioskPage';
import AttendanceReports from '../pages/reports/AttendanceReportsPage';

export const hrAttendanceAdminRoutes = (
    <>
        <Route index element={<AttendanceLog />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="kiosk" element={<AttendanceKiosk />} />
        <Route path="reports" element={<AttendanceReports />} />
        <Route path="*" element={<AttendanceLog />} />
    </>
);
