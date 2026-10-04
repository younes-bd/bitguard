const settingsManifest = {
    topMenu: [
        { category: 'Technical', group: 'Security', label: 'User Groups', path: '/admin/settings/groups', devOnly: true },
        { category: 'Technical', group: 'Security', label: 'Active Sessions', path: '/admin/settings/active-sessions', devOnly: true },
        { category: 'Technical', group: 'Security', label: 'Personal Access Tokens', path: '/admin/settings/personal-access-tokens', devOnly: true }
    ]
};

export default settingsManifest;
