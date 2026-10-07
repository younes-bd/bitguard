import { getIcon } from '../../shell/components/ui/iconRegistry';

// Base system settings sections (Layer 1 Kernel)
const baseSettings = [
    {
        section: 'General Settings',
        items: [
            { label: 'General Settings', iconName: 'Settings', path: '/admin/settings/general' },
        ]
    },
    {
        section: 'App Settings',
        items: [] // Populated dynamically by Layer 3 Business Apps
    }
];

export const getSettingsMenu = (manifestData = []) => {
    // Deep clone the base settings
    const unifiedMenu = baseSettings.map(section => ({
        ...section,
        items: [...section.items]
    }));

    // Layer 3 Business Apps dynamic API aggregator (Manifest Driven)
    // Note: Layer 2 apps (inbox, automation) and Layer 4 apps (ai_engine) 
    // now inject directly into the SettingsTopBar or GeneralSettingsPage, 
    // keeping the sidebar exclusively for Layer 3 Business Apps per Odoo 17.
    if (manifestData && manifestData.length > 0) {
        manifestData
            .filter(mod => mod.is_installed !== false && mod.has_settings === true && mod.application === true)
            .forEach(mod => {
                const sectionName = 'App Settings';
                let section = unifiedMenu.find(s => s.title === sectionName || s.section === sectionName);
                if (!section) {
                    section = { title: sectionName, section: sectionName, items: [] };
                    unifiedMenu.push(section);
                }

                if (!section.items.some(i => i.path === mod.settings_url)) {
                    section.items.push({
                        label: mod.display_name || mod.name,
                        iconName: mod.icon, // Store string name, resolved below
                        path: mod.settings_url
                    });
                }
            });
    }

    // Final Mapping: Resolve actual Lucide icon components from `iconRegistry.js`.
    return unifiedMenu.map(section => ({
        title: section.section || section.title,
        items: section.items.map(item => ({
            ...item,
            icon: item.icon || getIcon(item.iconName || 'Settings') // Resolve string names to Components
        }))
    }));
};
