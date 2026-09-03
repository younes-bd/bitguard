import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, FileText, CreditCard, LogOut, Shield, User, ShoppingCart, Briefcase, Target, Cloud, Home } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import { useTenant } from '@/core/context/TenantContext';
import UserAvatarDropdown from '@/core/components/shared/core/UserAvatarDropdown';

const navItems = [
    { label: 'Overview', path: '/portal', icon: LayoutDashboard, end: true },
    { label: 'Sale Orders', path: '/portal/orders', icon: ShoppingCart },
    { label: 'Invoices', path: '/portal/invoices', icon: FileText },
    { label: 'My Tickets', path: '/portal/tickets', icon: Ticket },
    { label: 'Projects', path: '/portal/projects', icon: Briefcase },
    { label: 'Contracts', path: '/portal/contracts', icon: Shield },
    { label: 'Subscriptions', path: '/portal/subscriptions', icon: Cloud },
    { label: 'Managed Assets', path: '/portal/assets', icon: Target },
];

const PortalLayout = () => {
    const { user, logout } = useAuth();
    const { tenant } = useTenant();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
            {/* Premium Top Nav */}
            <header className="border-b border-slate-800/80 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
                <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {tenant?.logo ? (
                            <img src={tenant.logo} alt={tenant.name || "Company Logo"} className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm ring-1 ring-slate-800/50" />
                        ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50">
                                <Shield size={20} className="text-white" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-white font-black tracking-tight text-lg leading-tight">{tenant?.name || 'BitGuard'}</span>
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest leading-tight">Client Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserAvatarDropdown user={user} onLogout={logout} variant="portal" />
                    </div>
                </div>
            </header>

            <div className="w-full px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 flex-1">
                {/* Modern Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl sticky top-24">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">My Account</div>
                        <nav className="space-y-1.5">
                            {navItems.map(item => (
                                <NavLink key={item.path} to={item.path} end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline
                                        ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'}`
                                    }>
                                    <item.icon size={18} className={({ isActive }) => isActive ? 'text-white' : 'text-slate-500'} /> 
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PortalLayout;
