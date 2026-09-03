import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AppointmentsDashboard from '../pages/dashboards/AppointmentsDashboard';
import OnlineAppointments from '../pages/features/OnlineAppointments';
import AppointmentsAnalysis from '../pages/features/AppointmentsAnalysis';
import AppointmentsSettings from '../pages/features/AppointmentsSettings';
import AppointmentTypes from '../pages/features/AppointmentTypes';

export const appointmentsAdminRoutes = (
    <>
        <Route index element={<AppointmentsDashboard />} />
        <Route path="online" element={<OnlineAppointments />} />
        <Route path="reports" element={<AppointmentsAnalysis />} />
        <Route path="settings" element={<AppointmentsSettings />} />
        <Route path="types" element={<AppointmentTypes />} />
    </>
);

