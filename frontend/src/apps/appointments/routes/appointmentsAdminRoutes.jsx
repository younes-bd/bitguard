import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AppointmentsDashboard from '../pages/dashboards/AppointmentsDashboardPage';
import OnlineAppointments from '../pages/features/OnlineAppointmentsPage';
import AppointmentsAnalysis from '../pages/features/AppointmentsAnalysisPage';
import AppointmentsSettings from '../pages/features/AppointmentsSettingsPage';
import AppointmentTypes from '../pages/features/AppointmentTypesPage';

export const appointmentsAdminRoutes = (
    <>
        <Route index element={<AppointmentsDashboard />} />
        <Route path="online" element={<OnlineAppointments />} />
        <Route path="reports" element={<AppointmentsAnalysis />} />
        <Route path="settings" element={<AppointmentsSettings />} />
        <Route path="types" element={<AppointmentTypes />} />
    </>
);

