import React from 'react';
import { Route } from 'react-router-dom';
import AttendanceLog from '../pages/lists/AttendanceLog';
import TimeTracking from '../pages/lists/TimeTracking';
import AttendanceKiosk from '../pages/lists/AttendanceKiosk';
import AttendanceReports from '../pages/reports/AttendanceReports';

export const hrAttendanceAdminRoutes = (
    <>
        <Route index element={<AttendanceLog />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="kiosk" element={<AttendanceKiosk />} />
        <Route path="reports" element={<AttendanceReports />} />
        <Route path="*" element={<AttendanceLog />} />
    </>
);
