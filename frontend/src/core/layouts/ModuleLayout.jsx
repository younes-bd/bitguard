import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import { Menu, Bell, User, Search, ChevronRight, Home } from 'lucide-react';
import { useSidebarState } from '../hooks/useSidebarState';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/shared/core/NotificationBell';
import CommandPalette from '../components/shared/core/CommandPalette';
import AppSwitcher from '../components/shared/core/AppSwitcher';

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
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30
            flex items-center justify-between px-4 gap-4 flex-shrink-0">

            {/* Left: App Switcher + Hamburger + Module Title */}
            <div className="flex items-center gap-2 min-w-0">
                <AppSwitcher />
                
                <button
                    onClick={() => { onToggleSidebar(); onMobileToggle(); }}
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
                <div className="relative w-full">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder={`Search in ${title}...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200
                            placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <NotificationBell />

                <div className="h-5 w-px bg-slate-800" />

                <div className="flex items-center gap-2">
                    <Link
                        to="/settings/profile"
                        className="w-8 h-8 rounded-full bg-blue-600 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                        title={user?.email || 'User'}
                    >
                        {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </Link>
                    <div className="hidden md:block">
                        <p className="text-xs font-medium text-white leading-tight">{user?.first_name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                            {user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Admin' : 'User'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

// ─── Module Layout ────────────────────────────────────────────────────────────
const ModuleLayout = ({ title, sections, items, accentColor, backLink = '/admin' }) => {
    const [collapsed, setCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Normalize: accept sections array directly OR legacy items array
    const normalizedSections = sections
        ? sections
        : items
            ? (items[0]?.title ? items : [{ items }])
            : [];

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
