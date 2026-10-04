import React from 'react';
import { getIcon } from '../../../shell/components/ui/iconRegistry';
import { Building2, Globe, Settings as SettingsIcon, Users, Layout, Key, ShieldCheck, Smartphone, Terminal, Database } from 'lucide-react'; 

// 1. DYNAMIC PLUGIN INJECTION (Layer 2 & Layer 4)
// This strictly reads from the settingsManifest, never menu.js
const pluginManifests = import.meta.glob('../../*/config/settingsManifest.js', { eager: true });

export default function GeneralSettingsPage() {
    
    // 2. LAYER 1 KERNEL CARDS (Hardcoded Foundation)
    // The system app is the UI proxy for the headless `core` and `tenants` modules.
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
                    path: '/admin/settings/users' 
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
                    path: '/admin/settings/parameters' 
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
                // Check if the section (e.g., "Discuss & Email") already exists to merge cards
                const existingSection = aggregatedCards.find(s => s.title === pluginSection.title);
                
                if (existingSection) {
                    pluginSection.cards.forEach(card => {
                        // Prevent duplicates
                        if (!existingSection.cards.some(c => c.path === card.path)) {
                            existingSection.cards.push(card);
                        }
                    });
                } else {
                    // Inject entirely new section (e.g., "AI Engine Configuration")
                    aggregatedCards.push(pluginSection);
                }
            });
        }
    });

    // 4. RENDER THE PAGE
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-white">General Settings</h1>
            </div>

            {aggregatedCards.map((section, idx) => (
                <div key={idx} className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-800 pb-2">
                        {section.title}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.cards.map((card, cIdx) => {
                            // Rule 53: Resolve dynamic strings to actual SVG components
                            const CardIcon = card.icon || getIcon(card.iconName, SettingsIcon);
                            
                            return (
                                <div key={cIdx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                            <CardIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium mb-1">{card.label}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
