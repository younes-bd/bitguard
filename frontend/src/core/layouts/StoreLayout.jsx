import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import {
    LayoutDashboard, ShoppingBag, CreditCard, Box,
    Menu, Bell, LogOut, Settings, User as UserIcon
} from 'lucide-react';

import client from '../api/client';
import { iamService } from '../api/iamService';
import { useSidebarState } from '../hooks/useSidebarState';
import { useAuth } from '../hooks/useAuth';

const StoreLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();
    const [user, setUser] = useState({ first_name: 'Store', last_name: 'User', email: 'user@bitguard.com' });
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await iamService.getMe();
                setUser(data);
            } catch (err) {
                // Warning only
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentPage = pathParts.length > 1 ? pathParts[pathParts.length - 1].replace(/-/g, ' ') : 'overview';
    const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    const storeSections = [
        {
            title: 'Store',
            items: [
                { icon: LayoutDashboard, label: 'Overview', path: '/app/store' },
                { icon: Box, label: 'Catalog', path: '/app/store/products' },
                { icon: CreditCard, label: 'Pricing', path: '/app/store/pricing' },
                { icon: ShoppingBag, label: 'My Orders', path: '/app/store/orders' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
            <Sidebar title="Store & Marketplace" sections={storeSections} backLink="/dashboard" collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} moduleKey="store" />

            <main className={`flex-1 relative transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Header */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-slate-400 hover:text-white mr-4 transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Breadcrumb */}
                    <div className="hidden md:flex items-center text-sm font-medium text-slate-400 capitalize">
                        <span className="text-slate-200">Store</span>
                        <span className="mx-2">/</span>
                        <span>{pageTitle}</span>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors" aria-label="Notifications">
                            <Bell size={20} />
                        </button>

                        {/* User Dropdown */}
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
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="hidden group-hover:block absolute right-0 top-full pt-4 w-[260px] z-[1000]">
                                <div className="bg-slate-950/95 backdrop-blur-2xl border border-blue-500/30 border-t-[3px] border-t-blue-500 rounded-b-lg shadow-xl overflow-hidden">
                                    <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent">
                                        <div className="font-semibold text-white mb-0.5">{user.first_name}</div>
                                        <div className="text-xs text-blue-400/80 truncate">{user.email}</div>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 p-2.5 rounded-lg text-sm hover:bg-red-500/10 transition-colors">
                                            <LogOut size={14} />
                                            <span>Sign Out</span>
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

export default StoreLayout;
