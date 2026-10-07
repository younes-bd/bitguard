import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import client from '../api/client';
import * as LucideIcons from 'lucide-react';

const ManifestContext = createContext({
    manifestData: [],
    installedSet: new Set(),
    commandCenterSections: [],
    moduleMenus: {},
    activeApps: [],
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
        if (manifestData.length === 0) {
            setLoading(true);
        }
        try {
            const [modulesRes, sectionsRes] = await Promise.all([
                client.get('base/modules/?limit=200'),
                client.get('base/sections/').catch(() => ({ data: [] }))
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { installedSet, commandCenterSections, moduleMenus, activeApps } = useMemo(() => {
        const menusMap = {};

        // 1. Extract *Menu sidebar navigation arrays from frontend glob imports.
        //    This is the React equivalent of Odoo's ir.ui.menu tree for sidebar items.
        //    *Manifest blocks have been removed — the DB is the sole metadata authority.
        Object.entries(menuConfigs).forEach(([path, moduleExport]) => {
            const appName = path.split('/')[3];
            let moduleMenu = [];
            Object.keys(moduleExport).forEach(key => {
                if (key.endsWith('Menu') && Array.isArray(moduleExport[key])) {
                    moduleMenu = moduleExport[key];
                }
            });
            menusMap[appName] = moduleMenu;
        });

        // 2. Build active modules exclusively from the DB response (Odoo 17 standard).
        //    If the API has not returned yet (loading), activeModules stays empty and
        //    the UI shows nothing rather than flashing stale hardcoded classifications.
        const installed = new Set();
        const activeModules = [];

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
                { label: 'Inbox', icon: LucideIcons.Bell, path: '/admin/inbox', techName: null }
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

        const activeApps = activeModules.filter(mod => mod.application !== false);

        return {
            installedSet: installed,
            commandCenterSections: finalSections,
            moduleMenus: menusMap,
            activeApps: activeApps
        };
    }, [manifestData, menuConfigs, sectionsData]);

    return (
        <ManifestContext.Provider value={{ manifestData, installedSet, commandCenterSections, moduleMenus, activeApps, loading, refreshManifest: fetchManifest }}>
            {children}
        </ManifestContext.Provider>
    );
};

export const useManifest = () => useContext(ManifestContext);
