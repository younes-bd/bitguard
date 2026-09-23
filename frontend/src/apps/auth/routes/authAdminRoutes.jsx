import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/public/LoginPage';
import Register from '../pages/public/RegisterPage';
import ForgotPassword from '../pages/public/ForgotPasswordPage';
import SetPassword from '../pages/SetPasswordPage';
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
