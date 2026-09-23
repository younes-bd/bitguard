import React from 'react';
import { Route } from 'react-router-dom';
import AutomatedActions from '../pages/lists/AutomatedActionsPage';
import WebhooksList from '../pages/lists/WebhooksListPage';

export const automationAdminRoutes = (
  <Route path="automation">
    <Route path="actions" element={<AutomatedActions />} />
    <Route path="webhooks" element={<WebhooksList />} />
  </Route>
);
