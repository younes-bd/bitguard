import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronDown, X, LayoutDashboard, Home } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../context/TenantContext';

// ─── Sidebar Item ────────────────────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, path, active, collapsed, count }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
            ${active
                ? 'bg-blue-600/20 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            } ${collapsed ? 'justify-center px-0' : ''}`}
    >
        {Icon ? (
            <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`}
            />
        ) : (
            <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-blue-400' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
            </div>
        )}

        {!collapsed && (
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 truncate">
                {label}
            </span>
        )}

        {!collapsed && count !== undefined && count > 0 && (
            <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-1.5 py-0.5 flex-shrink-0">
                {count > 99 ? '99+' : count}
            </span>
        )}

        {/* Active indicator bar */}
        {active && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 z-[200] shadow-xl">
                {label}
                {count !== undefined && count > 0 && (
                    <span className="ml-1.5 text-red-400">({count})</span>
                )}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
            </div>
        )}
    </Link>
);

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = ({
    title = 'BitGuard',
    items = [],
    sections = [],
    backLink = null,
    collapsed,
    setCollapsed,
    moduleKey = 'global',   // unique key per module to namespace localStorage
    mobileOpen = false,
    onMobileClose,
}) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { tenant } = useTenant();

    const isAdmin = !!user?.is_staff || !!user?.is_superuser;

    // Normalize: sections OR wrap flat items into one unnamed section
    const menuData = sections.length > 0
        ? sections
        : items.length > 0
            ? [{ items }]
            : [];

    // ── Namespaced section open/close state ──────────────────────────────────
    const storageKey = (sectionTitle) => `sidebar__${moduleKey}__${sectionTitle}`;

    const getInitialSectionState = () => {
        const state = {};
        menuData.forEach((section) => {
            if (section.title) {
                const stored = localStorage.getItem(storageKey(section.title));
                state[section.title] = stored !== null ? stored === 'true' : true; // default open
            }
        });
        return state;
    };

    const [openSections, setOpenSections] = useState(getInitialSectionState);

    const toggleSection = (sTitle) => {
        setOpenSections(prev => {
            const next = { ...prev, [sTitle]: !prev[sTitle] };
            localStorage.setItem(storageKey(sTitle), next[sTitle]);
            return next;
        });
    };

    const handleLogout = () => logout();

    // ── Sidebar content (shared between desktop + mobile) ────────────────────
    const moduleRoot = '/' + location.pathname.split('/').filter(Boolean).slice(0, 2).join('/');

    const SidebarContent = () => (
        <>
            {/* Header / Module Title */}
            <div className={`h-14 flex items-center border-b border-slate-800/80 flex-shrink-0 overflow-hidden
                ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
                {!collapsed ? (
                    moduleKey === 'global' ? (
                        <Link to="/admin" className="flex items-center gap-3 w-full group overflow-hidden px-1">
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                {tenant?.logo ? (
                                    <img
                                        src={tenant.logo}
                                        alt={tenant?.name || "Company Logo"}
                                        className="relative h-6 w-auto object-contain brightness-0 invert drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
                                        onError={(e) => e.target.src = '/assets/logo/logo.png'}
                                    />
                                ) : (
                                    <img
                                        src="/assets/logo/logo.png"
                                        alt="BitGuard"
                                        className="relative h-6 w-auto brightness-0 invert drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                            </div>
                            <span className="text-white text-[17px] font-bold font-[Oswald] tracking-[1.5px] leading-none uppercase drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] truncate flex-1">
                                {tenant?.name || 'BITGUARD'}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3 w-full">
                            <Link to="/admin" title="Back to Dashboard" className="relative flex-shrink-0 flex items-center justify-center w-7 h-7 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                                <Home size={16} className="text-slate-400 hover:text-white transition-colors" />
                            </Link>
                            <Link to={moduleRoot} className="text-white text-[15px] font-bold font-[Oswald] tracking-[1.5px] uppercase truncate hover:text-blue-400 transition-colors block flex-1">
                                {title}
                            </Link>
                        </div>
                    )
                ) : (
                    moduleKey === 'global' ? (
                        <Link to="/admin" title={tenant?.name || "BitGuard Home"}>
                            {tenant?.logo ? (
                                <img
                                    src={tenant.logo}
                                    alt="Logo"
                                    className="h-6 w-auto rounded object-contain"
                                    onError={(e) => e.target.src = '/assets/logo/logo.png'}
                                />
                            ) : (
                                <img
                                    src="/assets/logo/logo.png"
                                    alt="Logo"
                                    className="h-6 w-auto brightness-0 invert"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                        </Link>
                    ) : (
                        <Link to="/admin" title="Back to Dashboard" className="flex items-center justify-center w-8 h-8 hover:bg-slate-800 rounded-lg transition-colors">
                            <Home size={18} className="text-slate-400 hover:text-white" />
                        </Link>
                    )
                )}

                {/* Mobile close button */}
                {mobileOpen && onMobileClose && (
                    <button
                        onClick={onMobileClose}
                        className="ml-auto p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors md:hidden"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {menuData.map((section, sIndex) => {
                    const isOpen = openSections[section.title] ?? true;

                    return (
                        <React.Fragment key={`sec-${moduleKey}-${sIndex}`}>
                            {/* Section Header */}
                            {section.title && !collapsed && (
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-3 pt-5 pb-1.5 group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-px h-3 bg-blue-500/40 rounded-full" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] group-hover:text-blue-400 transition-colors">
                                            {section.title}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-slate-600 group-hover:text-blue-400 transition-all duration-300
                                            ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                                    />
                                </button>
                            )}

                            {/* Collapsed mode: section divider */}
                            {section.title && collapsed && sIndex > 0 && (
                                <div className="my-2 mx-3 border-t border-slate-800/60" />
                            )}

                            {/* Items */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${collapsed ? 'opacity-100' : (isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none')}`}>
                                <div className="space-y-0.5">
                                    {section.items?.map((item) => {
                                        if (!item.path) return null;
                                        if (item.permissions?.length > 0 && !isAdmin) return null;

                                        const isActive = location.pathname === item.path
                                            || (item.path !== '/admin' && location.pathname.startsWith(item.path + '/'));

                                        return (
                                            <SidebarItem
                                                key={item.path}
                                                icon={item.icon}
                                                label={item.label}
                                                path={item.path}
                                                active={isActive}
                                                collapsed={collapsed}
                                                count={item.count}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </nav>

            {/* Back Link */}
            {backLink && (
                <div className={`px-2 pb-1 ${collapsed ? 'flex justify-center' : ''}`}>
                    <Link
                        to={backLink}
                        title={collapsed ? 'Back to Command Center' : ''}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-800/60 hover:text-slate-300
                            transition-all group border border-transparent hover:border-slate-700/50 text-sm
                            ${collapsed ? 'justify-center' : ''}`}
                    >
                        <ChevronLeft size={16} className="flex-shrink-0 group-hover:text-white transition-colors" />
                        {!collapsed && <span className="font-medium">Command Center</span>}
                    </Link>
                </div>
            )}

            {/* Footer / Logout */}
            <div className={`p-2 border-t border-slate-800/80 bg-slate-950/30 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Sign Out' : ''}
                    className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400
                        transition-all group ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={16} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`border-r border-slate-800/80 bg-slate-950/95 hidden md:flex flex-col fixed h-full z-40
                    backdrop-blur-xl transition-all duration-300 ease-in-out shadow-xl shadow-black/20
                    ${collapsed ? 'w-[72px]' : 'w-64'}`}
            >
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar (Overlay Drawer) ─────────────────────────── */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden"
                        onClick={onMobileClose}
                    />
                    {/* Drawer */}
                    <aside className="fixed top-0 left-0 h-full w-72 bg-slate-950 border-r border-slate-800/80 z-[160]
                        flex flex-col shadow-2xl md:hidden animate-in slide-in-from-left-full duration-300">
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
