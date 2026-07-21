import React from 'react';
import { Route } from 'react-router-dom';
import AttendanceLog from '../pages/lists/AttendanceLog';
import TimeTracking from '../pages/lists/TimeTracking';

export const HrAttendanceRoutes = (
    <>
        <Route index element={<AttendanceLog />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="kiosk" element={<div className="p-8">Kiosk Mode placeholder</div>} />
        <Route path="reports" element={<div className="p-8">Reports placeholder</div>} />
        <Route path="*" element={<AttendanceLog />} />
    </>
);
