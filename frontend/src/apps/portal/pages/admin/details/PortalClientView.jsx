import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Monitor, Ticket, Clock, CheckCircle, Search, CreditCard } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';
import { portalService } from '../../../api/portalService';

export default function PortalClientView() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState(null);
    const [activeTab, setActiveTab] = useState('tickets');
    
    // Aggregated portal data
    const [data, setData] = useState({
        tickets: [],
        invoices: [],
        contracts: [],
        assets: [],
        shares: []
    });

    useEffect(() => {
        // Fetch client details
        client.get(`crm/clients/${clientId}/`)
            .then(res => setClientData(res.data))
            .catch(() => toast.error('Failed to load client profile'));

        // Simulating the aggregation endpoint (since we're building the frontend view)
        // A real backend would have: /api/crm/clients/{id}/portal-summary/
        Promise.all([
            client.get('helpdesk/tickets/', { params: { client: clientId, limit: 10 } }).catch(() => ({ data: [] })),
            client.get('accounting/invoices/', { params: { client: clientId, limit: 10 } }).catch(() => ({ data: [] })),
            client.get('sign/', { params: { client: clientId } }).catch(() => ({ data: [] })),
            client.get('maintenance/assets/', { params: { assigned_to: clientId } }).catch(() => ({ data: [] })),
            portalService.getPortalShares({ client_id: clientId }).catch(() => ({ data: [] }))
        ]).then(([tickets, invoices, contracts, assets, shares]) => {
            setData({
                tickets: tickets.data?.results || tickets.data || [],
                invoices: invoices.data?.results || invoices.data || [],
                contracts: contracts.data?.results || contracts.data || [],
                assets: assets.data?.results || assets.data || [],
                shares: shares.data?.results || shares.data || []
            });
        }).finally(() => setLoading(false));
    }, [clientId]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading portal preview...</p>
        </div>
    );

    if (!clientData) return (
        <div className="text-center py-20 text-slate-500">
            <p className="font-bold">Client not found</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            {/* Preview Banner */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-indigo-400" />
                    <div>
                        <p className="text-indigo-200 text-sm font-bold">Portal Admin → {clientData.company_name} — Previewing as client</p>
                        <p className="text-indigo-300/70 text-xs">Viewing portal exactly as {clientData.company_name} sees it.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => navigate('/admin/portal/access')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                        Manage Access
                    </button>
                    <button onClick={() => navigate('/admin/portal')} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Exit Preview
                    </button>
                </div>
            </div>

            {/* Portal Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {clientData.company_name}</h1>
                <p className="text-slate-400 text-sm">Manage your IT services, support tickets, and billing from one place.</p>
                
                {/* Navigation Tabs */}
                <div className="flex gap-2 mt-6 border-b border-slate-800 pb-px">
                    {[
                        { id: 'tickets', label: 'Support Tickets', icon: Ticket, count: data.tickets.length },
                        { id: 'invoices', label: 'Billing & Invoices', icon: FileText, count: data.invoices.filter(i => i.status !== 'paid').length },
                        { id: 'contracts', label: 'Service Contracts', icon: ShieldCheck, count: data.contracts.length },
                        { id: 'maintenance', label: 'My Devices', icon: Monitor, count: data.assets.length }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>
                            <tab.icon size={16} /> {tab.label}
                            {tab.count > 0 && <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>{tab.count}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[400px]">
                
                {activeTab === 'tickets' && (
                    <div>
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                            <h2 className="text-sm font-bold text-white">Recent Support Requests</h2>
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all">New Ticket</button>
                        </div>
                        {data.tickets.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 text-sm">No recent tickets.</div>
                        ) : (
                            <div className="divide-y divide-slate-800/50">
                                {data.tickets.map(t => (
                                    <div key={t.id} className="p-5 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium text-sm">{t.subject || t.title}</p>
                                            <p className="text-slate-500 text-xs mt-1">#{t.id} · Created {new Date(t.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${t.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {t.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div>
                        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
                            <h2 className="text-sm font-bold text-white">Invoices & Billing</h2>
                        </div>
                        {data.invoices.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 text-sm">No invoices found.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">Invoice #</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {data.invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-white text-sm font-medium">{inv.invoice_number || `#${inv.id}`}</td>
                                            <td className="p-4 text-slate-400 text-sm">{inv.issue_date || new Date(inv.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 text-white text-sm font-bold">${inv.total_amount}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {inv.status !== 'paid' && (
                                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                                                        <CreditCard size={12} /> Pay Now
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.contracts.length === 0 ? (
                            <div className="col-span-2 text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">No active contracts.</div>
                        ) : (
                            data.contracts.map(c => (
                                <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-white font-bold">{c.name || 'Managed Services Agreement'}</h3>
                                            <p className="text-slate-500 text-xs mt-1">Ref: {c.contract_number || `#${c.id}`}</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                                    </div>
                                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">SLA Tier</span>
                                            <span className="text-white font-medium">{c.sla_tier_name || 'Standard SLA'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Renewal Date</span>
                                            <span className="text-white font-medium">{c.end_date || 'Auto-renews'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div>
                        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
                            <h2 className="text-sm font-bold text-white">Assigned Devices & Assets</h2>
                        </div>
                        {data.assets.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 text-sm">No assets assigned.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                                {data.assets.map(a => (
                                    <div key={a.id} className="flex items-start gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                                            <Monitor size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-sm font-bold">{a.name}</h3>
                                            <p className="text-slate-400 text-xs mt-0.5">{a.asset_type} · {a.manufacturer}</p>
                                            <p className="text-slate-500 text-xs mt-2 font-mono">SN: {a.serial_number}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Shared Documents Section */}
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 bg-slate-950/40">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText size={16} className="text-indigo-400" /> Currently Shared Documents
                    </h2>
                </div>
                {data.shares.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No documents shared with this client.</div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {data.shares.map(share => (
                            <div key={share.id} className="p-4 flex justify-between items-center hover:bg-slate-800/30">
                                <div>
                                    <p className="text-white text-sm font-medium">{share.title}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{share.type || 'Document'} · Shared on {new Date(share.created_at).toLocaleDateString()}</p>
                                </div>
                                <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors">View</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}




