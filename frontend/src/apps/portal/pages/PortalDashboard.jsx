import React, { useState, useEffect } from 'react';
import { ExternalLink, Users, Settings, Activity, ShieldAlert, Globe, Edit2 } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function PortalDashboard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch clients for portal assignment/status
        client.get('crm/clients/')
            .then(res => setClients(res.data?.results || res.data || []))
            .catch(() => toast.error('Failed to load client data'))
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total: clients.length,
        active_portals: clients.filter(c => c.portal_access).length,
        pending_invites: clients.filter(c => c.status === 'onboarding').length,
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading portal configurations...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Globe className="text-indigo-400" size={28} /> Client Portal Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage white-label portals, client access, and announcements</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-sm">
                    <ExternalLink size={16} /> Open Portal Live View
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Clients', value: stats.total, color: 'text-white' },
                    { label: 'Active Portals', value: stats.active_portals, color: 'text-indigo-400' },
                    { label: 'Pending Invites', value: stats.pending_invites, color: 'text-amber-400' },
                ].map(s => (
                    <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                <Users size={16} className="text-indigo-400" /> Portal Access Management
                            </h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Primary Contact</th>
                                    <th className="p-4">Portal Status</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-sm font-medium text-white">{client.company_name}</td>
                                        <td className="p-4 text-sm text-slate-400">{client.email || '—'}</td>
                                        <td className="p-4">
                                            {client.portal_access ? (
                                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest">Disabled</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Manage Access</button>
                                        </td>
                                    </tr>
                                ))}
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">No clients available to manage.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings size={18} className="text-slate-400" />
                            <h3 className="text-sm font-bold text-white">White-Label Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Portal Domain</label>
                                <div className="flex bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                                    <span className="px-3 py-2.5 bg-slate-800 text-slate-400 border-r border-slate-700 text-sm font-mono">https://</span>
                                    <input type="text" defaultValue="clients.yourcompany.com" className="w-full bg-transparent px-3 py-2.5 text-white text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#4f46e5" className="w-10 h-10 rounded cursor-pointer bg-slate-950 border border-slate-700" />
                                    <span className="text-sm text-slate-400 font-mono">#4f46e5</span>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
                                Save Branding
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                                <Activity size={18} /> Global Announcement
                            </h3>
                            <p className="text-slate-300 text-sm mb-4">Broadcast a message to all active client portals.</p>
                            <textarea placeholder="Type announcement here..." rows={3} className="w-full bg-slate-950/50 border border-indigo-500/30 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors mb-3 resize-none" />
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors">
                                Publish Announcement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
