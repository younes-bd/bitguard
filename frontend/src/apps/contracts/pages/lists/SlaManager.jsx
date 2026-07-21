import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { contractsService } from '../../../../core/api/contractsService';

export default function SlaManager() {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const data = await contractsService.getSlaTiers();
                setTiers(data || []);
            } catch (error) {
                console.error("Failed to fetch SLA tiers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTiers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className="text-amber-500" /> SLA Tiers Manager
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Configure Service Level Agreement metrics and targets.</p>
                </div>
                <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Plus size={18} /> New SLA Tier
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search SLAs..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-amber-500 outline-none" />
                    </div>
                    <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2">
                        <Filter size={16}/> Filter
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Tier Name</th>
                            <th className="px-6 py-4 font-semibold text-center">Response Time</th>
                            <th className="px-6 py-4 font-semibold text-center">Resolution Time</th>
                            <th className="px-6 py-4 font-semibold text-center">Uptime Guarantee</th>
                            <th className="px-6 py-4 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {tiers.map(tier => (
                            <tr key={tier.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                    {tier.name.includes('Platinum') && <ShieldCheck size={16} className="text-blue-400"/>}
                                    {tier.name.includes('Gold') && <ShieldCheck size={16} className="text-yellow-400"/>}
                                    {tier.name.includes('Silver') && <ShieldCheck size={16} className="text-slate-300"/>}
                                    {tier.name.includes('Bronze') && <ShieldCheck size={16} className="text-orange-400"/>}
                                    {tier.name}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{tier.first_response_hours} Hours</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{tier.resolution_hours} Hours</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{tier.uptime_percent}%</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        true ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4 mt-6">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-amber-400 font-bold mb-1">SLA Enforcement</h3>
                    <p className="text-amber-500/80 text-sm">SLA policies are automatically applied to support tickets based on the client's active service contract. Ensure that the 'Response Time' values align with your support desk SLA rules.</p>
                </div>
            </div>
        </div>
    );
}
