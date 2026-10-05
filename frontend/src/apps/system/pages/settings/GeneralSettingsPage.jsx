import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../../../shell/components/ui/iconRegistry';
import { useDeveloperMode } from '../../../../core/context/DeveloperModeContext';
import { Building2, Globe, Settings as SettingsIcon, Users, Layout, Key, ShieldCheck, Smartphone, Terminal, Database, Search } from 'lucide-react'; 

// 1. DYNAMIC PLUGIN INJECTION (Layer 2 & Layer 4)
const pluginManifests = import.meta.glob('../../*/config/settingsManifest.js', { eager: true });

// ─── Interactive Blocks ─────────────────────────────────────────────────────────

const UsersInteractiveBlock = () => {
    return (
        <div className="mt-4 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Active Users</span>
                <span className="text-xl font-bold text-white">42</span>
            </div>
            <div className="flex gap-2">
                <input 
                    type="email" 
                    placeholder="Invite via email..." 
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none" 
                />
                <button 
                    onClick={(e) => e.preventDefault()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    Invite
                </button>
            </div>
        </div>
    );
};

const DeveloperModeBlock = () => {
    const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
    return (
        <div className="mt-4 border-t border-slate-800 pt-4">
            <button 
                onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    toggleDeveloperMode(); 
                }}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm
                    ${isDeveloperMode 
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                        : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600'}`}
            >
                {isDeveloperMode ? 'Deactivate Developer Mode' : 'Activate Developer Mode'}
            </button>
        </div>
    );
};


// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function GeneralSettingsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    // 2. LAYER 1 KERNEL CARDS (Hardcoded Foundation)
    const baseKernelCards = [
        {
            title: 'Users & Companies',
            cards: [
                { 
                    label: 'Company Profile', 
                    description: 'Manage your primary company details and tenant configuration', 
                    icon: Building2, 
                    path: '/admin/settings/companies' 
                },
                { 
                    label: 'Manage Users', 
                    description: 'Invite and manage users, assign roles, and handle provisioning', 
                    icon: Users, 
                    path: '/admin/settings/users',
                    customBlock: <UsersInteractiveBlock />
                },
                { 
                    label: 'Document Layout', 
                    description: 'Configure PDF and print layout templates for your company', 
                    icon: Layout, 
                    path: '/admin/settings/document-layouts' 
                },
                { 
                    label: 'Localization', 
                    description: 'Set default system language, timezone, and date formats', 
                    icon: Globe, 
                    path: '/admin/settings/languages' 
                }
            ]
        },
        {
            title: 'Permissions',
            cards: [
                { 
                    label: 'Default Access Rights', 
                    description: 'Configure default permission groups and access rules', 
                    icon: Key, 
                    path: '/admin/settings/access-rights' 
                },
                { 
                    label: 'Security & Password Policy', 
                    description: 'Manage password requirements, expiration, and session limits', 
                    icon: ShieldCheck, 
                    path: '/admin/settings/security-policy' 
                },
                { 
                    label: 'Multi-Factor Authentication', 
                    description: 'Enforce MFA requirements across your organization', 
                    icon: Smartphone, 
                    path: '/admin/settings/mfa' 
                }
            ]
        },
        {
            title: 'Developer Tools',
            cards: [
                { 
                    label: 'System Parameters', 
                    description: 'Advanced IT configuration and low-level system variables', 
                    icon: SettingsIcon, 
                    path: '/admin/settings/parameters',
                    customBlock: <DeveloperModeBlock />
                },
                { 
                    label: 'Server & Event Logs', 
                    description: 'Audit system events, API requests, and exception traces', 
                    icon: Terminal, 
                    path: '/admin/settings/server-logs' 
                },
                { 
                    label: 'Database Backups', 
                    description: 'Manage automated backups, retention, and restorations', 
                    icon: Database, 
                    path: '/admin/settings/backups' 
                }
            ]
        }
    ];

    // 3. AGGREGATE PLUGINS
    const aggregatedCards = [...baseKernelCards];

    Object.entries(pluginManifests).forEach(([path, mod]) => {
        const manifest = mod.default || {};
        if (manifest.generalSettingsCards && Array.isArray(manifest.generalSettingsCards)) {
            
            manifest.generalSettingsCards.forEach(pluginSection => {
                const existingSection = aggregatedCards.find(s => s.title === pluginSection.title);
                
                if (existingSection) {
                    pluginSection.cards.forEach(card => {
                        if (!existingSection.cards.some(c => c.path === card.path)) {
                            existingSection.cards.push(card);
                        }
                    });
                } else {
                    aggregatedCards.push(pluginSection);
                }
            });
        }
    });

    // 4. FILTER BY SEARCH
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return aggregatedCards;

        const lowerQuery = searchQuery.toLowerCase();
        
        return aggregatedCards.map(section => {
            const filteredCards = section.cards.filter(card => 
                card.label.toLowerCase().includes(lowerQuery) || 
                card.description.toLowerCase().includes(lowerQuery)
            );
            return { ...section, cards: filteredCards };
        }).filter(section => section.cards.length > 0);
    }, [aggregatedCards, searchQuery]);

    // 5. RENDER THE PAGE
    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <SettingsIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">General Settings</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage global IT infrastructure and core features</p>
                    </div>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search settings..." 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Empty State */}
            {filteredSections.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No settings found</h3>
                    <p className="text-slate-400">Could not find any settings matching "{searchQuery}"</p>
                </div>
            )}

            {/* Dynamic Grid */}
            <div className="space-y-10">
                {filteredSections.map((section, idx) => (
                    <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                        <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800/80 pb-3 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            {section.title}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {section.cards.map((card, cIdx) => {
                                const CardIcon = card.icon || getIcon(card.iconName, SettingsIcon);
                                
                                return (
                                    <div 
                                        key={cIdx} 
                                        onClick={() => card.path && navigate(card.path)}
                                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/40 hover:bg-slate-800/50 transition-all cursor-pointer group flex flex-col h-full shadow-lg shadow-black/20 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/50 transition-all duration-500" />
                                        
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300 shadow-inner">
                                                <CardIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-semibold mb-1.5 truncate pr-2">{card.label}</h3>
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Optional Interactive Block (e.g. User Invite Form, Dev Mode Toggle) */}
                                        {card.customBlock && (
                                            <div onClick={(e) => e.stopPropagation()} className="mt-auto">
                                                {card.customBlock}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
