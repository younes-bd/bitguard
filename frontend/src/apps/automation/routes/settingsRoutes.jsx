import React from 'react';
import { Route } from 'react-router-dom';
import AutomatedActions from '../pages/lists/AutomatedActionsPage';
import WebhooksList from '../pages/lists/WebhooksListPage';

export default [
    <Route key="automated-actions" path="automated-actions" element={<AutomatedActions />} />,
    <Route key="webhooks" path="webhooks" element={<WebhooksList />} />
];
