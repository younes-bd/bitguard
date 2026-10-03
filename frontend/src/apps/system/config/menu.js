import * as LucideIcons from 'lucide-react';
import { Settings, Building2, Globe, Layers, Layout, Database, Clock, Terminal, Upload, Download, DollarSign, Key, ShieldCheck } from 'lucide-react';

// Hardcoded Kernel Settings (Because `system` is the UI for `core` and `auth`)
const baseSettings = [
    {
        section: 'General Settings',
        items: [
            { label: 'General Settings', icon: Settings, path: '/admin/settings/general' },
        ]
    },
    {
        section: 'Users & Companies',
        items: [] // Reserved slot — populated by users app settingsMenu injection
    },
    {
        section: 'Translations',
        items: [
            { label: 'Languages', icon: Globe, path: '/admin/settings/languages' },
            { label: 'Export Translations', icon: Upload, path: '/admin/settings/translations-export' },
            { label: 'Import Translations', icon: Download, path: '/admin/settings/translations-import' },
        ]
    },
    {
        section: 'Email / Discuss',
        items: [] // Reserved slot — populated by inbox/discuss app settingsMenu injection
    },
    {
        section: 'Financial',
        items: [
            { label: 'Financial & Banking', icon: DollarSign, path: '/admin/settings/financial' },
            { label: 'Currencies', icon: DollarSign, path: '/admin/settings/currencies' },
        ]
    },
    {
        section: 'Technical',
        items: [
            { label: 'System Parameters', icon: Settings, path: '/admin/settings/parameters' },
            { label: 'Scheduled Actions', icon: Clock, path: '/admin/settings/scheduled-actions' },
            { label: 'Document Layouts', icon: Layout, path: '/admin/settings/document-layouts' },
            { label: 'Sequences', icon: Layers, path: '/admin/settings/sequences' },
            { label: 'Menu Sequences', icon: Layout, path: '/admin/settings/menu-sequences' },
            { label: 'System Events', icon: ShieldCheck, path: '/admin/settings/logs' },
            { label: 'Server Logs', icon: Terminal, path: '/admin/settings/server-logs' },
            { label: 'Backup & Restore', icon: Database, path: '/admin/settings/backups' },
            { label: 'Integration Keys', icon: Key, path: '/admin/settings/integration-keys' },
        ]
    }
];

// DYNAMIC SETTINGS AGGREGATOR
const pluginMenus = import.meta.glob('../../*/config/menu.js', { eager: true });

export const getSettingsMenu = (manifestData = []) => {
    // Deep clone the base system/kernel settings to prevent mutation bugs
    const unifiedMenu = baseSettings.map(section => ({
        ...section,
        items: [...section.items]
    }));

    // 1. Layer 2 / Technical static plugin aggregator
    Object.entries(pluginMenus).forEach(([path, mod]) => {
        // Prevent the system app from recursively pulling itself in
        if (path.includes('/system/config/menu.js')) return;

        // Support both static arrays and dynamic functions
        let injectedSettings = [];
        if (mod.settingsMenu && Array.isArray(mod.settingsMenu)) {
            injectedSettings = mod.settingsMenu;
        } else if (mod.getSettingsMenu && typeof mod.getSettingsMenu === 'function') {
            injectedSettings = mod.getSettingsMenu();
        }

        if (injectedSettings.length > 0) {
            injectedSettings.forEach(pluginItem => {
                const existingSection = unifiedMenu.find(s => s.section === pluginItem.section || s.title === pluginItem.section || s.title === pluginItem.title);
                
                if (existingSection) {
                    // Check for nested items if the pluginItem is a full section
                    if (pluginItem.items && Array.isArray(pluginItem.items)) {
                        pluginItem.items.forEach(nestedItem => {
                            if (!existingSection.items.some(i => i.path === nestedItem.path)) {
                                existingSection.items.push(nestedItem);
                            }
                        });
                    } else if (!existingSection.items.some(i => i.path === pluginItem.path)) {
                        existingSection.items.push({
                            label: pluginItem.label,
                            icon: pluginItem.icon,
                            path: pluginItem.path,
                            permissions: pluginItem.permissions
                        });
                    }
                } else {
                    if (pluginItem.items && Array.isArray(pluginItem.items)) {
                        unifiedMenu.push(pluginItem);
                    } else {
                        unifiedMenu.push({
                            title: pluginItem.section,
                            section: pluginItem.section,
                            items: [{
                                label: pluginItem.label,
                                icon: pluginItem.icon,
                                path: pluginItem.path,
                                permissions: pluginItem.permissions
                            }]
                        });
                    }
                }
            });
        }
    });

    // 2. Layer 3 Business Apps dynamic API aggregator
    if (manifestData && manifestData.length > 0) {
        manifestData
            .filter(mod => mod.is_installed !== false && mod.has_settings === true && mod.application === true)
            .forEach(mod => {
                const sectionName = mod.command_center_section || 'Apps';
                
                let section = unifiedMenu.find(s => s.title === sectionName || s.section === sectionName);
                if (!section) {
                    section = { title: sectionName, section: sectionName, items: [] };
                    unifiedMenu.push(section);
                }

                // Resolve Icon from string
                const IconComponent = LucideIcons[mod.icon] || LucideIcons.Settings;

                if (!section.items.some(i => i.path === mod.settings_url)) {
                    section.items.push({
                        label: mod.display_name || mod.name,
                        icon: IconComponent,
                        path: mod.settings_url
                    });
                }
            });
    }

    // Map `section` back to `title` for the layout component compatibility
    return unifiedMenu.map(section => ({
        title: section.section || section.title,
        items: section.items
    }));
};

export const settingsMenu = getSettingsMenu();
