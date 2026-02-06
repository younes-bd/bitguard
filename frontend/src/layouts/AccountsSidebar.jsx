import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Shield, CreditCard, Lock, Users, Database } from 'lucide-react';

const AccountsSidebar = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/account/home' },
        { icon: User, label: 'Personal info', path: '/account/personal-info' },
        { icon: Database, label: 'Data & privacy', path: '/account/data-privacy' },
        { icon: Shield, label: 'Security', path: '/account/security' },
        { icon: Users, label: 'People & sharing', path: '/account/people' },
        { icon: CreditCard, label: 'Payments & subscriptions', path: '/account/payments' },
    ];

    return (
        <aside className="w-[280px] hidden md:flex flex-col py-6 pr-6 bg-transparent h-[calc(100vh-64px)] fixed top-16 left-0 pl-4 lg:pl-8">
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-3 rounded-r-full rounded-l-full text-sm font-medium transition-colors
                            ${isActive
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }
                        `}
                    >
                        <item.icon size={18} className={({ isActive }) => isActive ? "text-blue-500" : "text-slate-500"} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pl-6 text-xs text-slate-600 space-y-2">
                <p>&copy; 2026 BitGuard</p>
                <div className="flex gap-2">
                    <a href="#" className="hover:text-slate-400">Privacy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-slate-400">Terms</a>
                </div>
            </div>
        </aside>
    );
};

export default AccountsSidebar;
