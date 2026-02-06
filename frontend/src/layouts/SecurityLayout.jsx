import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/core/components/Sidebar';
import {
    LayoutDashboard, ShieldAlert, Lock, Network, Search,
    Menu, Bell, LogOut, Settings, User as UserIcon, Shield, Flame, Bug
} from 'lucide-react';

import client from '../shared/core/services/client';
import { useSidebarState } from '../shared/core/hooks/useSidebarState';

const SecurityLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [user, setUser] = useState({ first_name: 'Security', last_name: 'Analyst', email: 'sec@bitguard.com' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Reuse user fetch logic...
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await client.get('accounts/me/');
                setUser(res.data);
            } catch (err) { }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    const socItems = [
        { icon: LayoutDashboard, label: 'SOC Overview', path: '/admin/security' },
        { icon: ShieldAlert, label: 'Alerts', path: '/admin/security/alerts' },
        { icon: Flame, label: 'Incidents', path: '/admin/security/incidents' },
        { icon: Lock, label: 'Assets', path: '/admin/security/assets' },
        { icon: Bug, label: 'Vulnerabilities', path: '/admin/security/vulnerabilities' },
        { icon: Search, label: 'Threat Intel', path: '/admin/security/intel' },
        { icon: Settings, label: 'SOC Settings', path: '/admin/security/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
            <Sidebar title="Security Ops" items={socItems} backLink="/admin" collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className={`flex-1 relative transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-white mr-4 transition-colors">
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center text-sm font-medium text-slate-400">
                        <span className="text-slate-200">Security Operations Center</span>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Simplified User Menu */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-white">{user.first_name}</div>
                                <div className="text-xs text-blue-400">SOC Analyst</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-blue-500/50 flex items-center justify-center">
                                <Shield size={18} className="text-blue-500" />
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

export default SecurityLayout;
