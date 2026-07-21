import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../../../core/api/client';
import { Ticket, FileText, Briefcase, Activity, AlertCircle, Clock, CheckCircle2, Cloud, ShieldCheck, Server, ShoppingCart, Target, User } from 'lucide-react';

const ClientPortalDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await client.get('portal/dashboard/');
                setDashboardData(response.data);
            } catch (err) {
                console.error("Failed to load client portal dashboard:", err);
                setError("Unable to retrieve dashboard information. Ensure your account is linked to an active client profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold text-red-500 mb-2">Access Error</h2>
                        <p className="text-red-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { 
        client: clientProfile, 
        counts, 
        recent_invoices, 
        recent_tickets, 
        recent_orders,
        recent_projects,
        open_invoices,
        open_tickets,
        active_contracts
    } = dashboardData;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white text-slate-900 tracking-tight">
                        {clientProfile?.name || "Client Portal"}
                    </h1>
                    <p className="dark:text-slate-400 text-slate-500 mt-1 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        Account Status: Active
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/portal/support" className="px-4 py-2 dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-lg dark:text-white text-slate-900 text-sm font-bold dark:hover:bg-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
                        Submit Ticket
                    </Link>
                    <Link to="/contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all">
                        Contact Manager
                    </Link>
                </div>
            </div>

            {/* Odoo-style Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Link to="/portal/orders" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.orders || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Sale Orders</h4>
                </Link>

                <Link to="/portal/invoices" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.invoices || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Invoices</h4>
                    {open_invoices > 0 && <p className="text-xs text-red-400 mt-1">{open_invoices} to pay</p>}
                </Link>
                
                <Link to="/portal/tickets" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.tickets || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Support Tickets</h4>
                    {open_tickets > 0 && <p className="text-xs text-amber-500 mt-1">{open_tickets} open</p>}
                </Link>

                <Link to="/portal/projects" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.projects || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Projects</h4>
                </Link>

                <Link to="/portal/subscriptions" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                            <Cloud className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.subscriptions || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Subscriptions</h4>
                </Link>

                <Link to="/portal/contracts" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.contracts || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Contracts</h4>
                    {active_contracts > 0 && <p className="text-xs text-emerald-500 mt-1">{active_contracts} active</p>}
                </Link>

                <Link to="/portal/assets" className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 border border-teal-500/20 group-hover:scale-110 transition-transform">
                            <Target className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{counts?.assets || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Managed Assets</h4>
                </Link>
            </div>

            {/* Detailed Lists - Recent items mapped side by side */}
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Your Details Sector (Odoo Parity) */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" /> Your Details
                        </h3>
                        <Link to="/portal/account" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                            Edit Account
                        </Link>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Name</div>
                            <div className="font-medium text-slate-200">{clientProfile?.name || 'Not provided'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Email</div>
                            <div className="font-medium text-slate-200">{clientProfile?.email || 'Not provided'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Company / Tenant</div>
                            <div className="font-medium text-slate-200">{clientProfile?.tenant_name || 'BitGuard Platform'}</div>
                        </div>
                    </div>
                </div>

                {/* Sale Orders Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-indigo-500" /> Recent Orders & Quotes
                        </h3>
                    </div>
                    <div className="p-0">
                        {recent_orders?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {recent_orders.map((order, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="font-bold dark:text-white text-slate-900 font-mono mb-1">{order.number}</div>
                                            <div className="text-xs dark:text-slate-500 text-slate-400">
                                                Date: {new Date(order.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg dark:text-white text-slate-900">${parseFloat(order.amount).toLocaleString()}</div>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${order.status === 'done' || order.status === 'sale' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                                <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                                <p>No recent orders found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Invoices Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" /> Recent Invoices
                        </h3>
                    </div>
                    <div className="p-0">
                        {recent_invoices?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {recent_invoices.map((inv, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="font-bold dark:text-white text-slate-900 font-mono mb-1">{inv.number}</div>
                                            <div className="text-xs dark:text-slate-500 text-slate-400 flex items-center gap-2">
                                                <span>Issued: {new Date(inv.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg dark:text-white text-slate-900">${parseFloat(inv.amount).toLocaleString()}</div>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : inv.status === 'overdue' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                                <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                                <p>No recent invoices found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tickets Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-blue-500" /> Recent Tickets
                        </h3>
                    </div>
                    <div className="p-0">
                        {recent_tickets?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {recent_tickets.map((t, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold dark:text-white text-slate-900 truncate pr-4">{t.subject}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${t.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs dark:text-slate-500 text-slate-400 gap-4">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.date}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                                <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                                <p>No active support tickets. You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-purple-500" /> Recent Projects
                        </h3>
                    </div>
                    <div className="p-0">
                        {recent_projects?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {recent_projects.map((p, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div className="font-bold dark:text-white text-slate-900 truncate pr-4">{p.name}</div>
                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                            {p.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                                <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                                <p>No active projects.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientPortalDashboard;
