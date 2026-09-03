import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import { Menu, Bell, User, Search, ChevronRight, Home, Command, Grid, RefreshCw, LayoutTemplate, Briefcase, Calculator, ShoppingCart, Truck, Wrench, Globe, Megaphone, Users, Activity, Settings, List, Shield, MessageSquare, Code } from 'lucide-react';
import { useSidebarState } from '../hooks/useSidebarState';
import { useAuth } from '../hooks/useAuth';
import { useManifest } from '../hooks/useManifest';
import { getSettingsMenu } from '../../apps/system/config/menu';
import NotificationBell from '../components/shared/core/NotificationBell';
import CommandPalette from '../components/shared/core/CommandPalette';
import AppSwitcher from '../components/shared/core/AppSwitcher';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
const Breadcrumb = ({ sections }) => {
    const location = useLocation();
    const pathname = location.pathname;

    // Build crumbs from path segments
    const segments = pathname.replace(/^\/admin\//, '').split('/').filter(Boolean);
    if (segments.length === 0) return null;

    // Try to find a matching label from sections
    const findLabel = (path) => {
        for (const section of (sections || [])) {
            const found = section.items?.find(item => item.path === path);
            if (found) return found.label;
        }
        // Fallback: humanize path segment
        return null;
    };

    const humanize = (seg) => {
        if (/^\d+$/.test(seg)) return `#${seg}`;
        return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    // Build crumb list: Home > Module > Sub-page
    const crumbs = [];
    let cumPath = '/admin';

    for (let i = 0; i < segments.length; i++) {
        cumPath += (i === 0 ? '/' : '/') + segments[i];
        const label = findLabel(cumPath) || humanize(segments[i]);
        const isLast = i === segments.length - 1;
        crumbs.push({ label, path: cumPath, isLast });
    }

    if (crumbs.length <= 1) return null; // Don't show for top-level module page

    return (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
            <Link to="/admin" className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                <Home size={11} />
                <span>Admin</span>
            </Link>
            {crumbs.map((crumb) => (
                <React.Fragment key={crumb.path}>
                    <ChevronRight size={11} className="text-slate-700 flex-shrink-0" />
                    {crumb.isLast ? (
                        <span className="text-slate-300 font-medium truncate max-w-[200px]">{crumb.label}</span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="hover:text-slate-300 transition-colors truncate max-w-[150px]"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

// ─── Module Top Bar ───────────────────────────────────────────────────────────
const ModuleTopBar = ({ title, onToggleSidebar, onMobileToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30
            flex items-center justify-between px-4 gap-4 flex-shrink-0">

            {/* Left: App Switcher + Hamburger + Module Title */}
            <div className="flex items-center gap-2 min-w-0">
                <AppSwitcher />
                
                <button
                    onClick={() => {
                        if (window.innerWidth >= 768) {
                            onToggleSidebar();
                        } else {
                            onMobileToggle();
                        }
                    }}
                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0 ml-1"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={18} />
                </button>

                <div className="hidden sm:flex items-center gap-2 min-w-0 ml-2">
                    <span className="text-white font-bold text-sm font-[Oswald] tracking-[2px] uppercase truncate">
                        {title}
                    </span>
                    <span className="text-slate-700 text-xs hidden md:block">|</span>
                    <span className="text-slate-500 text-xs hidden md:block">Enterprise Platform</span>
                </div>
            </div>

            {/* Center: Module Search */}
            <div className="hidden lg:flex flex-1 max-w-sm">
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('command-palette:open'))}
                    className="relative w-full flex items-center h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
                >
                    <Search size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <span className="ml-2 text-sm text-slate-500 group-hover:text-slate-300">Search in {title}...</span>
                    <div className="ml-auto flex items-center gap-1 opacity-50">
                        <Command size={10} />
                        <span className="text-[9px] font-bold bg-slate-800 px-1 rounded border border-slate-700">K</span>
                    </div>
                </button>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <NotificationBell />

                <div className="h-5 w-px bg-slate-800" />

                <div className="flex items-center gap-2">
                    <UserAvatarDropdown user={user} onLogout={handleLogout} variant="backend" />
                </div>
            </div>
        </header>
    );
};

// ─── Module Layout ────────────────────────────────────────────────────────────

const ModuleLayout = ({ title, sections, items, accentColor, backLink = '/admin' }) => {
    const [collapsed, setCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { manifestData, installedSet, settingsAppEntries } = useManifest();

    // If this is the Settings module, dynamically build the menu
    if (title === 'Settings' || title?.toLowerCase() === 'settings') {
        sections = getSettingsMenu(settingsAppEntries);
    }
    
    // If this is the Apps module, dynamically build the menu based on manifestData
    if (title === 'Apps' || title?.toLowerCase() === 'apps') {
        const majorCategoryCounts = {};
        let totalCount = 0;

        manifestData.forEach(mod => {
            const majorCat = mod.command_center_section || 'Other';
            majorCategoryCounts[majorCat] = (majorCategoryCounts[majorCat] || 0) + 1;
            totalCount++;
        });
        
        const getIconForCategory = (cat) => {
            const map = {
                'Sales': ShoppingCart,
                'Services': Briefcase,
                'Finance': Calculator,
                'Accounting': Calculator,
                'Inventory & MRP': Truck,
                'Inventory': Truck,
                'Manufacturing': Wrench,
                'Website': Globe,
                'Marketing': Megaphone,
                'Human Resources': Users,
                'Productivity': Activity,
                'Administration': Settings,
                'Security': Shield,
                'Discuss': MessageSquare,
                'Technical': Code,
                'Other': List
            };
            return map[cat] || List;
        };

        const dynamicCategories = Object.keys(majorCategoryCounts)
            .sort((a, b) => {
                if (a === 'Other') return 1;
                if (b === 'Other') return -1;
                return a.localeCompare(b);
            })
            .map(cat => ({
                label: `${cat} (${majorCategoryCounts[cat]})`,
                icon: getIconForCategory(cat),
                path: `/admin/apps?category=${encodeURIComponent(cat)}`
            }));

        sections = [
            {
                title: 'App Store',
                items: [
                    { label: 'Apps', icon: Grid, path: '/admin/apps' },
                    { label: 'Updates', icon: RefreshCw, path: '/admin/apps/updates' },
                    { label: 'Themes', icon: LayoutTemplate, path: '/admin/apps/themes' },
                ]
            },
            {
                title: 'Categories',
                items: [
                    { label: `All (${totalCount})`, icon: List, path: '/admin/apps?category=All' },
                    ...dynamicCategories
                ]
            }
        ];
    }

    // Normalize: accept sections array directly OR legacy items array
    let normalizedSections = sections
        ? sections
        : items
            ? (items[0]?.title ? items : [{ items }])
            : [];
            
    // Filter sections and items based on techName and installed modules
    normalizedSections = normalizedSections.map(section => ({
        ...section,
        items: section.items?.filter(item => !item.techName || (installedSet && installedSet.has(item.techName))) || []
    })).filter(section => section.items.length > 0);

    // Derive a unique module key from the title for namespaced localStorage
    const moduleKey = title?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'module';

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <CommandPalette />
            <Sidebar
                title={title}
                sections={normalizedSections}
                moduleKey={moduleKey}
                backLink={backLink}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out
                ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>

                <ModuleTopBar
                    title={title}
                    onToggleSidebar={() => setCollapsed(c => !c)}
                    onMobileToggle={() => setMobileOpen(o => !o)}
                />

                <main className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar">
                    <div className="p-5 md:p-8 max-w-[1800px] mx-auto">
                        <Breadcrumb sections={normalizedSections} />
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ModuleLayout;
