import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import client from '../api/client';
import * as LucideIcons from 'lucide-react';

const ManifestContext = createContext({
    manifestData: [],
    installedSet: new Set(),
    commandCenterSections: [],
    settingsAppEntries: [],
    moduleMenus: {},
    loading: true,
    refreshManifest: async () => {},
});

export const ManifestProvider = ({ children }) => {
    const [manifestData, setManifestData] = useState([]);
    const [sectionsData, setSectionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Glob import all menu configs from all apps
    const menuConfigs = useMemo(() => {
        try {
            return import.meta.glob('../../apps/*/config/menu.js', { eager: true });
        } catch (e) {
            console.error('Error loading glob menus:', e);
            return {};
        }
    }, []);

    const fetchManifest = async () => {
        setLoading(true);
        try {
            const [modulesRes, sectionsRes] = await Promise.all([
                client.get('system/modules/?limit=200'),
                client.get('system/sections/').catch(() => ({ data: [] }))
            ]);
            
            const payload = modulesRes?.data ?? modulesRes;
            
            // Handle DRF paginated response (payload.results) or plain array
            let modules = [];
            if (Array.isArray(payload?.results)) {
                modules = payload.results;
            } else if (Array.isArray(payload)) {
                modules = payload;
            } else if (Array.isArray(payload?.modules)) {
                modules = payload.modules;
            }
            
            setManifestData(modules);
            setSectionsData(sectionsRes?.data || []);
        } catch (err) {
            console.error('Failed to load system manifest, falling back to all modules:', err);
            // Fallback: we could build manifestData from glob imports
            setManifestData([]);
            setSectionsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManifest();
    }, []);

    const { installedSet, commandCenterSections, settingsAppEntries, moduleMenus } = useMemo(() => {
        const moduleMap = {};
        const menusMap = {};
        
        // 1. Process Frontend Glob Data
        Object.entries(menuConfigs).forEach(([path, moduleExport]) => {
            const appName = path.split('/')[3];
            
            // Extract Menu and Manifest
            let moduleMenu = [];
            let moduleManifest = null;
            
            Object.keys(moduleExport).forEach(key => {
                if (key.endsWith('Menu')) moduleMenu = moduleExport[key];
                if (key.endsWith('Manifest')) moduleManifest = moduleExport[key];
            });
            
            menusMap[appName] = moduleMenu;
            if (moduleManifest) {
                moduleMap[appName] = moduleManifest;
            }
        });

        // 2. Merge with Backend Data
        const installed = new Set();
        let activeModules = [];
        
        if (manifestData.length > 0) {
            // Backend data available
            manifestData.filter(m => m.is_installed !== false).forEach(mod => {
                installed.add(mod.technical_name);
                activeModules.push({
                    name: mod.name,
                    techName: mod.technical_name,
                    displayName: mod.display_name,
                    commandCenterSection: mod.command_center_section,
                    sequence: mod.sequence,
                    application: mod.application,
                    hasSettings: mod.has_settings,
                    url: mod.url,
                    settingsUrl: mod.settings_url,
                    settingsDesc: mod.settings_desc,
                    icon: mod.icon || 'Box'
                });
            });
        } else {
            // Fallback to frontend manifest data
            Object.values(moduleMap).forEach(mod => {
                installed.add(mod.techName);
                activeModules.push({ ...mod, icon: 'Box' });
            });
        }

        // 3. Build Command Center Sections
        const sectionMap = {};
        activeModules.filter(mod => mod.application !== false).forEach(mod => {
            const section = mod.commandCenterSection || 'Other';
            if (!sectionMap[section]) sectionMap[section] = [];
            
            const IconComponent = LucideIcons[mod.icon] || LucideIcons.Box;
            
            sectionMap[section].push({
                label: mod.displayName,
                icon: IconComponent,
                path: mod.url || `/admin/${mod.techName}`,
                techName: mod.techName,
                sequence: mod.sequence || 99
            });
        });

        const sortedSections = Object.entries(sectionMap).map(([title, items]) => {
            return {
                title,
                items: items.sort((a, b) => a.sequence - b.sequence)
            };
        });
        
        // Define hardcoded sections
        const overviewSection = {
            title: 'Overview',
            items: [
                { label: 'Command Center', icon: LucideIcons.LayoutDashboard, path: '/admin', techName: null },
                { label: 'Notifications', icon: LucideIcons.Bell, path: '/admin/notifications', techName: null }
            ]
        };
        
        // Sort sections logically purely from the Database (Tier-1 Standard)
        const dbSectionSequence = {};
        sectionsData.forEach(sec => {
            dbSectionSequence[sec.name] = sec.sequence;
        });
        
        const finalSections = [overviewSection, ...sortedSections.filter(s => s.title !== 'Overview')].sort((a, b) => {
            const aSeq = dbSectionSequence[a.title] ?? 999;
            const bSeq = dbSectionSequence[b.title] ?? 999;
            if (aSeq === bSeq) return a.title.localeCompare(b.title);
            return aSeq - bSeq;
        });

        // 4. Build Settings App Entries
        const settingsEntries = activeModules
            .filter(mod => mod.hasSettings)
            .sort((a, b) => (a.sequence || 99) - (b.sequence || 99))
            .map(mod => ({
                title: mod.displayName,
                desc: mod.settingsDesc,
                link: mod.settingsUrl
            }));

        return {
            installedSet: installed,
            commandCenterSections: finalSections,
            settingsAppEntries: settingsEntries,
            moduleMenus: menusMap
        };
    }, [manifestData, menuConfigs, sectionsData]);

    return (
        <ManifestContext.Provider value={{ manifestData, installedSet, commandCenterSections, settingsAppEntries, moduleMenus, loading, refreshManifest: fetchManifest }}>
            {children}
        </ManifestContext.Provider>
    );
};

export const useManifest = () => useContext(ManifestContext);
