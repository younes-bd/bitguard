import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SubmitTicketPage from '../pages/SubmitTicketPage';

export const helpdeskPublicRoutes = (
    <Routes>
        <Route index element={<SubmitTicketPage />} />
        <Route path="success" element={<SubmitTicketPage />} />
    </Routes>
);
