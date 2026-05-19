import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, FileText, CreditCard, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../../../core/hooks/useAuth';

const navItems = [
    { label: 'Overview', path: '/portal', icon: LayoutDashboard, end: true },
    { label: 'My Tickets', path: '/portal/tickets', icon: Ticket },
    { label: 'Invoices', path: '/portal/invoices', icon: FileText },
    { label: 'Contracts', path: '/portal/contracts', icon: Shield },
    { label: 'Billing', path: '/portal/billing', icon: CreditCard },
];

const PortalLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Top Nav */}
            <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield size={16} className="text-white" />
                        </div>
                        <span className="text-white font-bold">BitGuard</span>
                        <span className="text-slate-500 text-sm">Client Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                {(user?.first_name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()}
                            </div>
                            <span>{user?.first_name ?? user?.email ?? 'Client'}</span>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                            <LogOut size={15} /> Sign out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8 flex-1">
                {/* Sidebar */}
                <aside className="w-52 flex-shrink-0 space-y-1">
                    {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline
                                ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
                            }>
                            <item.icon size={16} /> {item.label}
                        </NavLink>
                    ))}
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
