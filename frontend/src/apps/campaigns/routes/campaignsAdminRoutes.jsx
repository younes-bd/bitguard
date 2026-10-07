import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import CampaignsPage from '../pages/CampaignsPage';
import CampaignForm from '../pages/CampaignFormPage';
import MailingListsPage from '../pages/MailingListsPage';
import MailingListForm from '../pages/MailingListFormPage';
import MailingContactsPage from '../pages/MailingContactsPage';
import MailingContactForm from '../pages/MailingContactFormPage';
import CampaignsSettings from '../pages/settings/CampaignsSettingsPage';

export const campaignsAdminRoutes = (
    <React.Fragment>
        <Route index element={<CampaignsPage />} />
        
        <Route path="lists" element={<MailingListsPage />} />
        <Route path="lists/:id" element={<MailingListForm />} />
        
        <Route path="contacts" element={<MailingContactsPage />} />
        <Route path="contacts/:id" element={<MailingContactForm />} />
        
        <Route path="settings" element={<CampaignsSettings />} />
        
        {/* Make sure dynamic ID route is at the bottom so it doesn't hijack 'lists' or 'contacts' */}
        <Route path=":id" element={<CampaignForm />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
