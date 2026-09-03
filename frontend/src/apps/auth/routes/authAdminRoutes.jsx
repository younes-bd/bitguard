import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import SetPassword from '../pages/SetPassword';
import AuthLayout from '../../../core/layouts/AuthLayout';

export const authAdminRoutes = (
    <React.Fragment>
    <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/set-password/:uid/:token" element={<SetPassword />} />
    </Route>
    </React.Fragment>
);
