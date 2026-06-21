import React, { useState } from 'react';
import { 
    Search, Server, Users, ShieldCheck, LifeBuoy, 
    Briefcase, CreditCard, PieChart, ShoppingBag, 
    FileText, CheckSquare, BarChart3, Database,
    Globe, Key, Filter, CheckCircle2, Circle
} from 'lucide-react';

const APP_CATALOG = [
    { id: 'crm', name: 'Sales & CRM', category: 'Customer & Revenue', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', installed: true, desc: 'Manage leads, opportunities, and sales pipelines.' },
    { id: 'marketing', name: 'Marketing Automation', category: 'Customer & Revenue', icon: Globe, color: 'text-pink-500', bg: 'bg-pink-500/10', installed: false, desc: 'Email campaigns, lead nurturing, and social media.' },
    { id: 'store', name: 'Commerce Storefront', category: 'Customer & Revenue', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10', installed: true, desc: 'B2B/B2C online store and shopping cart.' },
    { id: 'billing', name: 'Subscription Billing', category: 'Customer & Revenue', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10', installed: true, desc: 'Recurring revenue, invoicing, and Stripe integration.' },
    
    { id: 'erp', name: 'Finance & ERP', category: 'Finance & Resources', icon: PieChart, color: 'text-indigo-500', bg: 'bg-indigo-500/10', installed: true, desc: 'Accounting, general ledger, and financial reporting.' },
    { id: 'hrm', name: 'Human Capital', category: 'Finance & Resources', icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-500/10', installed: true, desc: 'Employee directory, time off, and payroll integrations.' },
    { id: 'projects', name: 'Project Portfolio', category: 'Finance & Resources', icon: Database, color: 'text-cyan-500', bg: 'bg-cyan-500/10', installed: true, desc: 'Tasks, milestones, timesheets, and resource allocation.' },
    
    { id: 'services', name: 'IT Service Desk', category: 'IT Service Management', icon: LifeBuoy, color: 'text-sky-500', bg: 'bg-sky-500/10', installed: true, desc: 'Ticketing, SLA management, and customer portal.' },
    { id: 'assets', name: 'IT Asset Management', category: 'IT Service Management', icon: Server, color: 'text-slate-400', bg: 'bg-slate-500/10', installed: false, desc: 'Track hardware, software licenses, and endpoints.' },
    
    { id: 'secops', name: 'Security Operations', category: 'Security & Governance', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-500/10', installed: true, desc: 'Incident response, threat hunting, and compliance.' },
    { id: 'iam', name: 'Identity & Access', category: 'Security & Governance', icon: Key, color: 'text-amber-500', bg: 'bg-amber-500/10', installed: true, desc: 'SSO, MFA, and role-based access control.' },
    { id: 'edms', name: 'Document Management', category: 'Security & Governance', icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10', installed: true, desc: 'Enterprise vault, digital signing, and archiving.' },
    { id: 'approvals', name: 'Approval Center', category: 'Security & Governance', icon: CheckSquare, color: 'text-green-500', bg: 'bg-green-500/10', installed: true, desc: 'Automated multi-tier approval workflows.' },
    
    { id: 'analytics', name: 'Enterprise Analytics', category: 'Intelligence & Platform', icon: BarChart3, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', installed: true, desc: 'Cross-module BI dashboards and KPI tracking.' }
];

export default function AppInstaller() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [apps, setApps] = useState(APP_CATALOG);

    const categories = ['All', ...new Set(APP_CATALOG.map(a => a.category))];

    const toggleInstall = (id) => {
        setApps(apps.map(app => 
            app.id === id ? { ...app, installed: !app.installed } : app
        ));
    };

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                              app.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Enterprise App Store</h1>
                <p className="text-slate-400">Install or uninstall modules to customize your platform experience.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search apps..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-blue-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    <Filter className="text-slate-500 mr-2 flex-shrink-0" size={16} />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                categoryFilter === cat 
                                ? 'bg-blue-600 text-white border-blue-500' 
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredApps.map((app) => {
                    const Icon = app.icon;
                    return (
                        <div key={app.id} className={`flex flex-col bg-slate-900 border rounded-xl overflow-hidden transition-all duration-300 ${app.installed ? 'border-slate-700 shadow-lg' : 'border-slate-800/50 opacity-75'}`}>
                            <div className="p-6 flex-1 flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${app.bg}`}>
                                    <Icon size={28} className={app.color} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-bold text-lg text-white">{app.name}</h3>
                                    </div>
                                    <p className="text-xs text-blue-400 mb-3">{app.category}</p>
                                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{app.desc}</p>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-950/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    {app.installed ? (
                                        <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={16} /> Installed</span>
                                    ) : (
                                        <span className="text-slate-500 flex items-center gap-1.5"><Circle size={16} /> Not Installed</span>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => toggleInstall(app.id)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                        app.installed 
                                        ? 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white' 
                                        : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    }`}
                                >
                                    {app.installed ? 'Uninstall' : 'Install'}
                                </button>
                            </div>
                        </div>
                    );
                })}
                
                {filteredApps.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                        <Search className="mx-auto text-slate-600 mb-4" size={32} />
                        <h3 className="text-lg font-medium text-white mb-1">No modules found</h3>
                        <p className="text-slate-500">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
