import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../shared/core/components/Sidebar';
import {
    Menu, Bell, LogOut, Settings, User as UserIcon, ChevronDown, Search, Shield
} from 'lucide-react';

import client from '../shared/core/services/client';
import { useSidebarState } from '../shared/core/hooks/useSidebarState';
import { adminMenu, productMenu } from '../shared/core/config/menu';
import { useTenant } from '../shared/core/contexts/TenantContext';
import { useAuth } from '../shared/core/hooks/useAuth';
import NotificationBell from '../shared/core/components/NotificationBell';

const ConsoleLayout = () => {
    const location = useLocation();
    const { hasProduct } = useTenant();
    const { user, logout } = useAuth(); // Use centralized auth
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout(); // Use context logout
    };

    // Filter Menu based on Bundle AND Permissions
    // We only show the MAIN ADMIN MENU here.
    const adminItems = adminMenu.filter(item => {
        // 1. Check Product/Bundle Access
        if (item.requiredProduct && !hasProduct(item.requiredProduct)) {
            return false;
        }

        // 2. Check RBAC Permissions
        // If user is superuser, they see everything
        if (user?.is_superuser) return true;

        // If item has permissions defined, check if user has at least one
        if (item.permissions && item.permissions.length > 0) {
            const userPermissions = user?.permissions || []; // backend must send this
            const hasPerm = item.permissions.some(p => userPermissions.includes(p));
            if (!hasPerm) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Sidebar: Shows BITGUARD logo (Platform Style) */}
            <Sidebar
                title="BITGUARD"
                items={adminItems}
                backLink="/admin"
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>

                {/* Hybrid Header: Inlined structure but with Admin Elements */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">

                    {/* Left: Mobile Toggle + Admin Panel Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <span className="font-['Oswald'] text-2xl font-bold tracking-[1px] text-white hidden md:block" style={{ marginTop: '-2px' }}>
                            Console
                        </span>
                    </div>

                    {/* Center: Search Bar (Restored) */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users, logs, or settings..."
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-full leading-5 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/20"
                            />
                        </div>
                    </div>

                    {/* Right: Actions + User Profile */}
                    <div className="flex items-center space-x-4 ml-auto">

                        {/* View As Dropdown (Restored) */}
                        <div className="hidden lg:flex items-center mr-2">
                            <span className="text-slate-500 text-xs font-medium mr-3 uppercase tracking-wider">View as</span>
                            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 hover:border-blue-500/30 transition-all">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                <span className="font-medium">Admin</span>
                                <ChevronDown size={14} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block"></div>

                        <NotificationBell />

                        {/* User Dropdown (Platform Style - Blue) */}
                        <div className="group relative">
                            <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                                <div className="w-9 h-9 relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-900 relative z-10" />
                                    ) : (
                                        <div className="w-full h-full rounded-full border border-slate-900 relative z-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                            {(user.first_name?.[0] || 'A').toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full z-20"></div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="hidden group-hover:block absolute right-0 top-full pt-4 w-[260px] z-[1000]">
                                <div className="bg-slate-950/95 backdrop-blur-2xl border border-blue-500/30 border-t-[3px] border-t-blue-500 rounded-b-lg shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden [clip-path:polygon(20px_0,100%_0,100%_100%,0_100%,0_20px)] animate-in fade-in zoom-in-95 duration-200">
                                    {/* User Header */}
                                    <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden">
                                        <div className="absolute top-0 right-0 text-[100px] leading-none text-blue-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none font-['Oswald']">A</div>
                                        <div className="font-semibold text-white mb-0.5 font-['Oswald'] tracking-wide text-lg">{user.first_name || 'Admin'}</div>
                                        <div className="text-xs text-blue-400/80 truncate font-mono">{user.email}</div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2 space-y-1">
                                        <button className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-blue-500/20 text-left">
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                                <UserIcon size={14} />
                                            </div>
                                            <span className="font-medium">Profile</span>
                                        </button>
                                        <button className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-blue-500/20 text-left">
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-blue-500/50 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-colors">
                                                <Settings size={14} />
                                            </div>
                                            <span className="font-medium">Settings</span>
                                        </button>

                                        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1"></div>

                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 p-2.5 rounded-lg text-sm hover:bg-red-500/10 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-red-500/20 cursor-pointer text-left">
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-red-500/50 group-hover/item:text-red-400 group-hover/item:bg-red-500/20 transition-colors">
                                                <LogOut size={14} />
                                            </div>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-[1920px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ConsoleLayout;
