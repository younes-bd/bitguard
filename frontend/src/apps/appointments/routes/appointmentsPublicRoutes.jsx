import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppointmentsPage from '../pages/AppointmentsPage';

export const appointmentsPublicRoutes = (
    <Routes>
        <Route index element={<AppointmentsPage />} />
        <Route path="success" element={<AppointmentsPage />} />
    </Routes>
);
