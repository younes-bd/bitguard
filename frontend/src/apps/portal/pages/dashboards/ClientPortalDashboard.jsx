import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../../../core/api/client';
import { Ticket, FileText, Briefcase, Activity, AlertCircle, Clock, CheckCircle2, Cloud, ShieldCheck, Server } from 'lucide-react';

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

    const { client: clientProfile, tickets, invoices, projects, tenants, contracts } = dashboardData;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
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

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{tickets?.length || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Support Tickets</h4>
                </div>
                
                <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{invoices?.filter(i => i.status !== 'paid').length || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Unpaid Invoices</h4>
                </div>

                <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/20">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{projects?.length || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Deployments</h4>
                </div>

                <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                            <Cloud className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{tenants?.length || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Workspaces</h4>
                </div>

                <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-slate-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-extrabold dark:text-white text-slate-900">{contracts?.length || 0}</span>
                    </div>
                    <h4 className="dark:text-slate-400 text-slate-500 text-sm font-medium">Contracts</h4>
                </div>
            </div>

            {/* SaaS Tenants & Cloud Workspaces */}
            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-cyan-500" /> Cloud Workspaces
                    </h3>
                </div>
                <div className="p-6">
                    {tenants?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tenants.map((tenant, i) => (
                                <div key={i} className="dark:bg-slate-800/40 bg-slate-50 border dark:border-slate-700/50 border-slate-200 rounded-xl p-5 dark:hover:border-blue-500/30 hover:border-blue-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-white text-slate-900">{tenant.name}</h4>
                                            <p className="dark:text-slate-400 text-slate-500 text-sm mt-1">{tenant.domain}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${tenant.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {tenant.is_active ? 'Active' : 'Suspended'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tenant.allowed_modules && tenant.allowed_modules.map((mod, idx) => (
                                            <span key={idx} className="px-2 py-1 dark:bg-slate-700/50 bg-slate-200 dark:text-slate-300 text-slate-700 text-xs rounded dark:border-slate-600 border-slate-300">
                                                {mod}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t dark:border-slate-700/50 border-slate-200 flex justify-between items-center">
                                        <span className="text-xs dark:text-slate-400 text-slate-500 uppercase font-bold tracking-wider">Plan: <span className="dark:text-white text-slate-900">{tenant.subscription_plan}</span></span>
                                        <a href={`https://${tenant.domain}.bitguard.app`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold">
                                            Console â†’
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                            <Server className="w-12 h-12 mb-3 opacity-20" />
                            <p>You have no active Cloud Workspaces.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tickets Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-blue-500" /> Recent Tickets
                        </h3>
                    </div>
                    <div className="p-0">
                        {tickets?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {tickets.slice(0, 5).map((t, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold dark:text-white text-slate-900 truncate pr-4">{t.summary}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${t.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs dark:text-slate-500 text-slate-400 gap-4">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString()}</span>
                                            <span className="capitalize text-slate-400 flex items-center gap-1">Priority: {t.priority}</span>
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

                {/* Invoices Sector */}
                <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" /> Recent Invoices
                        </h3>
                    </div>
                    <div className="p-0">
                        {invoices?.length > 0 ? (
                            <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                                {invoices.slice(0, 5).map((inv, i) => (
                                    <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="font-bold dark:text-white text-slate-900 font-mono mb-1">{inv.invoice_number}</div>
                                            <div className="text-xs dark:text-slate-500 text-slate-400 flex items-center gap-2">
                                                <span>Issued: {new Date(inv.issued_date).toLocaleDateString()}</span>
                                                <span className={`${inv.status === 'overdue' ? 'text-red-500' : ''}`}>Due: {new Date(inv.due_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg dark:text-white text-slate-900">${parseFloat(inv.total).toLocaleString()}</div>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : inv.status === 'overdue' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
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
            </div>

            {/* Contracts Sector */}
            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-8">
                <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-500" /> Service Contracts & SLAs
                    </h3>
                </div>
                <div className="p-0">
                    {contracts?.length > 0 ? (
                        <ul className="divide-y dark:divide-slate-800 divide-slate-100">
                            {contracts.map((contract, i) => (
                                <li key={i} className="p-6 dark:hover:bg-slate-800/30 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                    <div>
                                        <div className="font-bold dark:text-white text-slate-900 mb-1">{contract.title || `Contract #${contract.id}`}</div>
                                        <div className="text-xs dark:text-slate-500 text-slate-400 flex items-center gap-2">
                                            <span>Valid: {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`inline-block mb-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${contract.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                            {contract.status || 'Active'}
                                        </span>
                                        <div className="font-bold text-lg dark:text-white text-slate-900">${parseFloat(contract.amount || 0).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center dark:text-slate-500 text-slate-400 flex flex-col items-center">
                            <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                            <p>No active service contracts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientPortalDashboard;

