import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Shield, Users, Lock, Building } from 'lucide-react';

const IAMLayout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin/iam/roles', label: 'Roles & Permissions', icon: <Shield size={18} /> },
        { path: '/admin/iam/users', label: 'Users', icon: <Users size={18} /> },
        { path: '/admin/iam/tenants', label: 'Tenants', icon: <Building size={18} /> },
        { path: '/admin/iam/audit', label: 'Audit Log', icon: <Lock size={18} /> },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Header / Tabs */}
            <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Identity & Access</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage organization security, roles, and tenant access.</p>
                    </div>
                </div>

                <div className="flex space-x-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 
                                    ${isActive
                                        ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default IAMLayout;
