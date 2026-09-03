import React from 'react';
import { Route } from 'react-router-dom';
import TodoDashboard from '../pages/dashboards/TodoDashboard';

export const todoAdminRoutes = (
    <>
        <Route index element={<TodoDashboard />} />
    </>
);
