import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/core/components/Sidebar';
import {
    Shield, Activity, Server, Globe,
    LayoutGrid, LifeBuoy, Menu, Bell,
    LogOut, Settings, User as UserIcon, ChevronDown
} from 'lucide-react';

import client from '../shared/core/services/client';
import { useSidebarState } from '../shared/core/hooks/useSidebarState';

const PlatformLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [user, setUser] = useState({ first_name: 'Admin', last_name: 'User', email: 'admin@bitguard.com' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await client.get('accounts/me/');
                setUser(res.data);
            } catch (err) {
                // Info only
            }
        };
        fetchUser();

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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    const platformItems = [
        { icon: Activity, label: 'Dashboard', path: '/app/soc' },
        { icon: Globe, label: 'Connect (Apps)', path: '/app/soc/workspaces' },
        { icon: Shield, label: 'Analyze (Events)', path: '/app/soc/security' },
        { icon: Shield, label: 'Remediation', path: '/app/soc/assets' }, // Mapped to Assets/Endpoints for now
        { icon: LifeBuoy, label: 'Support Tools', path: '/app/soc/remote' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Sidebar with specialized title and back link */}
            <Sidebar title="BitGuard Ops" items={platformItems} backLink="/dashboard" collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className={`flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Technical Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-slate-400 hover:text-white mr-4 transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Status Indicator */}
                    <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono text-emerald-400">SYSTEM OPERATIONAL</span>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* User Dropdown (PublicLayout Style) */}
                        <div className="group relative">
                            <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                                <div className="w-9 h-9 relative">
                                    <div className="absolute inset-0 bg-emerald-500 blur-sm opacity-20 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-900 relative z-10" />
                                    ) : (
                                        <div className="w-full h-full rounded-full border border-slate-900 relative z-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                            {(user.first_name?.[0] || 'A').toUpperCase()}
                                        </div>
                                    )}

                                    {/* Online Status Dot */}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full z-20 shadow-[0_0_5px_rgba(34,197,94,0.6)]">
                                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="hidden group-hover:block absolute right-0 top-full pt-4 w-[260px] z-[1000]">
                                <div className="bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 border-t-[3px] border-t-emerald-500 rounded-b-lg shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] overflow-hidden [clip-path:polygon(20px_0,100%_0,100%_100%,0_100%,0_20px)] animate-in fade-in zoom-in-95 duration-200">
                                    {/* User Header */}
                                    <div className="p-4 border-b border-white/5 bg-gradient-to-r from-emerald-900/20 to-transparent relative overflow-hidden">
                                        <div className="absolute top-0 right-0 text-[100px] leading-none text-emerald-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none font-['Oswald']">U</div>
                                        <div className="font-semibold text-white mb-0.5 font-['Oswald'] tracking-wide text-lg">{user.first_name || 'Admin'}</div>
                                        <div className="text-xs text-emerald-400/80 truncate font-mono">{user.email}</div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2 space-y-1">
                                        <button className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-emerald-500/20 text-left">
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-emerald-500/50 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/20 transition-colors">
                                                <UserIcon size={14} />
                                            </div>
                                            <span className="font-medium">Profile</span>
                                        </button>
                                        <button className="flex items-center gap-3 w-full text-slate-300 p-2.5 rounded-lg text-sm hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 group/item bg-transparent border border-transparent hover:border-emerald-500/20 text-left">
                                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-emerald-500/50 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/20 transition-colors">
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

export default PlatformLayout;
