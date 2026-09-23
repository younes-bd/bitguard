import React from 'react';
import { Route } from 'react-router-dom';
import OutgoingMailServers from '../pages/lists/OutgoingMailServersPage';
import IncomingMailServers from '../pages/lists/IncomingMailServersPage';
import EmailTemplates from '../pages/lists/EmailTemplatesPage';
import MailAliasesList from '../pages/lists/MailAliasesListPage';
import InboxSettings from '../pages/settings/InboxSettingsPage';

export default [
    <Route key="inbox-settings" path="mail" element={<InboxSettings />} />,
    <Route key="outgoing-mail" path="outgoing-mail-servers" element={<OutgoingMailServers />} />,
    <Route key="incoming-mail" path="incoming-mail-servers" element={<IncomingMailServers />} />,
    <Route key="email-templates" path="email-templates" element={<EmailTemplates />} />,
    <Route key="mail-aliases" path="mail-aliases" element={<MailAliasesList />} />
];
