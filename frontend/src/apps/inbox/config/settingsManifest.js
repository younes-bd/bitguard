const settingsManifest = {
    topMenu: [
        { category: 'Technical', group: 'Email', label: 'Outgoing Mail Servers', path: '/admin/settings/outgoing-mail', devOnly: true },
        { category: 'Technical', group: 'Email', label: 'Incoming Mail Servers', path: '/admin/settings/incoming-mail', devOnly: true },
        { category: 'Technical', group: 'Email', label: 'Email Templates', path: '/admin/settings/email-templates', devOnly: true },
        { category: 'Technical', group: 'Email', label: 'Mail Aliases', path: '/admin/settings/mail-aliases', devOnly: true },
        { category: 'Technical', group: 'Email', label: 'Channels', path: '/admin/settings/channels', devOnly: true },
    ],
    generalSettingsCards: [
        {
            title: 'Discuss & Email',
            cards: [
                { label: 'Outgoing Mail Servers', description: 'Configure SMTP servers for sending system emails', iconName: 'Server', path: '/admin/settings/outgoing-mail' },
                { label: 'Email Templates', description: 'Create and manage automated email notification templates', iconName: 'FileText', path: '/admin/settings/email-templates' },
            ]
        }
    ]
};

export default settingsManifest;

