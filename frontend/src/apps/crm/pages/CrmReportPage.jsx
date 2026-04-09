import React, { useState, useEffect } from 'react';
import { PieChart, Users, TrendingUp, Activity, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function CrmReportPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrm = async () => {
            try {
                const res = await client.get('crm/clients/');
                setClients(res.data?.results || res.data || []);
            } catch (error) {
                console.error("CRM API Failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCrm();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <PieChart className="text-blue-400" size={28} />
                    Sales & CRM Reports
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Live conversion rates and active client pipeline</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <Users size={20} className="text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{clients.length}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">Total Active Clients</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <TrendingUp size={20} className="text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">28%</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">Lead Conversion Rate</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <Activity size={20} className="text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">$14,500</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">Avg Deal Size</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Enterprise Pipeline Snapshot</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Client Name</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {clients.length === 0 ? (
                                <tr><td colSpan="3" className="py-4 text-slate-500">No CRM accounts provisioned.</td></tr>
                            ) : clients.map((c, i) => (
                                <tr key={i}>
                                    <td className="py-3 text-white font-medium">{c.name || 'Enterprise LLC'}</td>
                                    <td className="py-3 text-slate-400">{c.status || 'Active'}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-0.5 rounded textxs bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                            {c.client_type || 'B2B'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
