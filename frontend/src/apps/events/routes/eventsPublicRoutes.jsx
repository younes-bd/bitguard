import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EventsRegistrationPage from '../pages/EventsRegistrationPage';

export const eventsPublicRoutes = (
    <Routes>
        <Route index element={<EventsRegistrationPage />} />
        <Route path=":id" element={<EventsRegistrationPage />} />
    </Routes>
);
