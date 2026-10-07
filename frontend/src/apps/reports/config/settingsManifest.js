import DocumentSettingsCard from '../components/settings/DocumentSettingsCard';

const settingsManifest = {
    generalSettingsCards: [
        { section: 'System Configuration', component: DocumentSettingsCard, weight: 80 }
    ],
    topMenu: [
        { category: 'Technical', group: 'Reporting', label: 'Reports', path: '/admin/settings/reports', devOnly: true },
        { category: 'Technical', group: 'Reporting', label: 'Report Tags', path: '/admin/settings/report-tags', devOnly: true },
        { category: 'Technical', group: 'Reporting', label: 'Print Formats', path: '/admin/settings/print-formats', devOnly: true }
    ]
};

export default settingsManifest;
