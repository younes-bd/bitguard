import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import { Menu, Search, Command, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSidebarState } from '../hooks/useSidebarState';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';
import NotificationBell from '../components/shared/core/NotificationBell';
import CommandPalette from '../components/shared/core/CommandPalette';
import { portalSections } from '../../apps/portal/config/portalMenu';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
const Breadcrumb = ({ sections }) => {
    const location = useLocation();
    const pathname = location.pathname;

    const segments = pathname.replace(/^\/portal\//, '').split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const findLabel = (path) => {
        for (const section of (sections || [])) {
            const found = section.items?.find(item => item.path === path);
            if (found) return found.label;
        }
        return null;
    };

    const humanize = (seg) => {
        if (/^\d+$/.test(seg)) return `#${seg}`;
        return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const crumbs = [];
    let cumPath = '/portal';

    for (let i = 0; i < segments.length; i++) {
        cumPath += (i === 0 ? '/' : '/') + segments[i];
        const label = findLabel(cumPath) || humanize(segments[i]);
        const isLast = i === segments.length - 1;
        crumbs.push({ label, path: cumPath, isLast });
    }

    if (crumbs.length <= 1) return null; 

    return (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
            <Link to="/portal" className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                <Home size={11} />
                <span>Portal</span>
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

const PortalLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const openSearch = () => {
        window.dispatchEvent(new CustomEvent('command-palette:open'));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            <CommandPalette />
            
            <Sidebar
                title="Client Portal"
                sections={portalSections}
                moduleKey="portal"
                backLink="/"
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>
                
                <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (window.innerWidth >= 768) {
                                    setSidebarCollapsed(!sidebarCollapsed);
                                } else {
                                    setMobileOpen(!mobileOpen);
                                }
                            }}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <span className="font-sans text-xl font-bold tracking-tight text-white hidden md:block">
                            Client Portal
                        </span>
                    </div>

                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                        <button 
                            onClick={openSearch}
                            className="w-full flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all group shadow-inner"
                        >
                            <Search size={16} className="group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium">Quick search...</span>
                            <div className="ml-auto flex items-center gap-1.5 opacity-50">
                                <Command size={12} />
                                <span className="text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">K</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        <NotificationBell />
                        
                        <div className="h-6 w-px bg-slate-800 hidden md:block mx-1"></div>

                        <UserAvatarDropdown user={user} onLogout={handleLogout} variant="portal" />
                    </div>
                </header>

                <div className="p-5 md:p-8 max-w-[1920px] mx-auto">
                    <Breadcrumb sections={portalSections} />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PortalLayout;
