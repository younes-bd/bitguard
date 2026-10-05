import React from 'react';
import { Route } from 'react-router-dom';
import InboxSettingsPage from '../pages/settings/InboxSettingsPage';
import MailAliasesPage from '../pages/settings/MailAliasesPage';

export default (
    <React.Fragment>
        <Route path="inbox" element={<InboxSettingsPage />} />
        <Route path="mail-aliases" element={<MailAliasesPage />} />
    </React.Fragment>
);
