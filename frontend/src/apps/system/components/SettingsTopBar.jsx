import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDeveloperMode } from '../../../../core/context/DeveloperModeContext';
import { ChevronDown } from 'lucide-react';

const pluginManifests = import.meta.glob('../../../*/config/settingsManifest.js', { eager: true });

export default function SettingsTopBar() {
    const { isDeveloperMode } = useDeveloperMode();
    const location = useLocation();

    // The Odoo 17 Base Layout
    const baseMenus = [
        {
            label: 'Users & Companies',
            items: [
                { label: 'Users', path: '/admin/settings/users' },
                { label: 'Companies', path: '/admin/settings/companies' },
            ]
        },
        {
            label: 'Translations',
            items: [
                { label: 'Languages', path: '/admin/settings/languages' },
                { label: 'Export Translations', path: '/admin/settings/translations-export' },
                { label: 'Import Translations', path: '/admin/settings/translations-import' },
            ]
        }
    ];

    const technicalMenu = {
        label: 'Technical',
        groups: {
            'Security': [
                { label: 'Access Rights', path: '/admin/settings/access-rights' },
                { label: 'Record Rules', path: '/admin/settings/record-rules' },
                { label: 'Security Policy', path: '/admin/settings/security-policy' },
                { label: 'Integration Keys', path: '/admin/settings/integration-keys' }
            ],
            'Database': [
                { label: 'Backups', path: '/admin/settings/backups' },
                { label: 'System Parameters', path: '/admin/settings/parameters' },
                { label: 'Menu Sequences', path: '/admin/settings/menu-sequences' }
            ],
            'Reporting': [
                { label: 'Server Logs', path: '/admin/settings/server-logs' },
                { label: 'System Events', path: '/admin/settings/system-events' },
            ],
            'Financial': [
                { label: 'Currencies', path: '/admin/settings/currencies' },
            ]
        }
    };

    // Inject dynamic Top Menu items
    Object.values(pluginManifests).forEach(mod => {
        const manifest = mod.default || {};
        if (manifest.topMenu && Array.isArray(manifest.topMenu)) {
            manifest.topMenu.forEach(item => {
                if (item.category === 'Technical' || item.devOnly) {
                    const group = item.group || 'Other';
                    if (!technicalMenu.groups[group]) {
                        technicalMenu.groups[group] = [];
                    }
                    technicalMenu.groups[group].push(item);
                } else {
                    const targetMenu = baseMenus.find(m => m.label === item.category);
                    if (targetMenu) {
                        targetMenu.items.push(item);
                    }
                }
            });
        }
    });

    const activeMenus = [...baseMenus];
    if (isDeveloperMode) {
        activeMenus.push(technicalMenu);
    }

    return (
        <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 h-12 flex items-center gap-8 text-sm font-medium relative z-40">
            {activeMenus.map(menu => (
                <DropdownMenu key={menu.label} menu={menu} currentPath={location.pathname} />
            ))}
        </div>
    );
}

const DropdownMenu = ({ menu, currentPath }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative h-full flex items-center" onMouseLeave={() => setIsOpen(false)} onMouseEnter={() => setIsOpen(true)}>
            <button className={`flex items-center gap-1.5 transition-colors h-full ${isOpen ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {menu.label} <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-12 left-0 min-w-[200px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/80 z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {menu.groups ? (
                        <div className="flex gap-8 p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {Object.entries(menu.groups).map(([groupName, items]) => (
                                <div key={groupName} className="min-w-[160px]">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{groupName}</h4>
                                    <div className="flex flex-col gap-1">
                                        {items.map(item => (
                                            <Link 
                                                key={item.path} 
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`text-sm px-2.5 py-1.5 rounded-lg transition-colors ${currentPath === item.path ? 'text-blue-400 bg-blue-500/10 font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 px-2">
                            {menu.items.map(item => (
                                <Link 
                                    key={item.path} 
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${currentPath === item.path ? 'text-blue-400 bg-blue-500/10 font-medium' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
