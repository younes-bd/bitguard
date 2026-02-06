import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group relative ${active
            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
    >
        <Icon size={20} className={`${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
        {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">{label}</span>}

        {/* Tooltip for collapsed state */}
        {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 z-50">
                {label}
            </div>
        )}
    </Link>
);

const Sidebar = ({ title = "BitGuard", items = [], backLink = null, collapsed, setCollapsed }) => {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <aside
            className={`border-r border-slate-800 bg-slate-900/95 hidden md:flex flex-col fixed h-full z-40 backdrop-blur-xl transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Header / Logo */}
            <div className={`h-16 flex items-center border-b border-slate-800 ${collapsed ? 'justify-center px-0' : 'justify-between px-6'} flex-shrink-0 overflow-hidden`}>
                {!collapsed ? (
                    <div className="flex items-center gap-[12px] group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <img
                                src="/assets/logo/logo.png"
                                alt="BitGuard"
                                className="relative h-[30px] w-auto brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)]"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                        <span className="text-white text-[24px] font-semibold font-[Oswald] tracking-[2px] leading-none inline-block mt-[-2px] scale-y-[1.4] origin-left drop-shadow-[0_0_5px_rgba(56,189,248,0.3)]">
                            BITGUARD
                        </span>
                    </div>
                ) : (
                    <img
                        src="/assets/logo/logo.png"
                        alt="Logo"
                        className="h-[30px] w-auto brightness-0 invert"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                )}
            </div>



            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
                {items.map((item, index) => {
                    // Divider
                    if (item.type === 'divider') {
                        return <div key={`div-${index}`} className="my-2 border-t border-slate-800/50" />;
                    }

                    // Header (No interactable path)
                    if (!item.path && item.label) {
                        return (
                            <div key={`head-${index}`} className={`px-4 py-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider transition-opacity duration-300 ${collapsed ? 'opacity-0 h-0 overflow-hidden py-0' : 'opacity-100'}`}>
                                {item.label}
                            </div>
                        );
                    }

                    // Standard Item (Must have path and icon)
                    if (!item.path) return null;

                    return (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
                            collapsed={collapsed}
                        />
                    );
                })}
            </nav>

            {/* Back Link Fixed at Bottom (Separate from Footer) */}
            {backLink && (
                <div className={`px-3 pb-2 ${collapsed ? 'flex justify-center' : ''}`}>
                    <Link
                        to={backLink}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group border border-transparent hover:border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? "Back to Dashboard" : ""}
                    >
                        <ChevronLeft size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                        {!collapsed && <span className="font-medium text-sm">Back to App</span>}
                    </Link>
                </div>
            )}

            {/* Footer Section: Just Logout now */}
            <div className={`p-3 border-t border-slate-800 bg-slate-900/50 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? "Sign Out" : ""}
                >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
